import { writable } from 'simple-store-svelte'
import { defaults } from '@/../common/util.js'
export let alToken = localStorage.getItem('ALtoken') || null

let storedSettings = { ...defaults }

try {
  storedSettings = JSON.parse(localStorage.getItem('settings')) || { ...defaults }
} catch (e) {}

const scopedDefaults = {
  homeSections: [...[...storedSettings.rssFeedsNew.reverse()].map(([title]) => title), 'Continue Watching', 'Sequels You Missed', 'Your List', 'Popular This Season', 'Trending Now', 'All Time Popular', 'Romance', 'Action', 'Adventure', 'Fantasy', 'Comedy']
}

/**
 * @type {import('svelte/store').Writable & { value: any }}
 */
export const settings = writable({ ...defaults, ...scopedDefaults, ...storedSettings })

settings.subscribe(value => {
  localStorage.setItem('settings', JSON.stringify(value))
})

export function resetSettings () {
  settings.value = { ...defaults, ...scopedDefaults }
}

window.addEventListener('paste', ({ clipboardData }) => {
  if (clipboardData.items?.[0]) {
    if (clipboardData.items[0].type === 'text/plain' && clipboardData.items[0].kind === 'string') {
      clipboardData.items[0].getAsString(text => {
        let token = text.split('access_token=')?.[1]?.split('&token_type')?.[0]
        if (token) {
          if (token.endsWith('/')) token = token.slice(0, -1)
          handleToken(token)
        }
      })
    }
  }
})
window.IPC.on('altoken', handleToken)
function handleToken (data) {
  localStorage.setItem('ALtoken', data)
  alToken = data
  location.reload()
}
