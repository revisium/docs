const COOKIE_NAME = 'revisium-theme'
const COOKIE_DOMAIN = '.revisium.io'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const COOKIE_REGEX = new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)

function getThemeFromCookie() {
  const match = COOKIE_REGEX.exec(document.cookie)

  return match ? match[1] : undefined
}

function setThemeCookie(theme) {
  const isLocalhost = globalThis.location.hostname === 'localhost'
  const domain = isLocalhost ? '' : `; domain=${COOKIE_DOMAIN}`

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${domain}`
}

let observerStarted = false

export function onRouteDidUpdate() {
  // Sync cookie → Docusaurus on load
  const cookieTheme = getThemeFromCookie()

  if (cookieTheme) {
    const currentTheme = document.documentElement.dataset.theme

    if (cookieTheme !== currentTheme) {
      document.documentElement.dataset.theme = cookieTheme
      localStorage.setItem('theme', cookieTheme)
    }
  }

  // Watch for theme changes and sync to cookie (once)
  if (!observerStarted) {
    observerStarted = true

    const observer = new MutationObserver(() => {
      const theme = document.documentElement.dataset.theme

      if (theme) {
        setThemeCookie(theme)
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  }
}
