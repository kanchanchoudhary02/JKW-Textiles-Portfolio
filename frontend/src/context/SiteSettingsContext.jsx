import { createContext, useContext, useEffect, useState } from 'react'
import api, { API_BASE_URL } from '../config/api'
import { COMPANY } from '../data/siteData'

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')
const mediaUrl = (url) => {
  if (!url) return url
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}
const normalizeMedia = (value = {}) => Object.fromEntries(
  Object.entries(value).map(([key, item]) => [key, { ...item, url: mediaUrl(item?.url) }])
)

const defaults = {
  company: COMPANY,
  hero: {
    eyebrow: 'Textile Sourcing & Manufacturing',
    title: 'Fabric Sourcing, Made Simple',
    description: 'A dependable partner for fabric sourcing discovery, custom weaving, dyeing, and printing — all under one roof.',
  },
  resources: { enabled: true, label: 'Resources', description: '' },
  media: {},
}

const SiteSettingsContext = createContext(defaults)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults)

  useEffect(() => {
    Promise.allSettled([api.get('/settings'), api.get('/media')]).then(([settingsResult, mediaResult]) => {
      setSettings((current) => {
        const next = { ...current }
        if (settingsResult.status === 'fulfilled') {
          const incoming = settingsResult.value.data.settings || {}
          next.company = { ...current.company, ...(incoming.company || {}) }
          next.hero = { ...current.hero, ...(incoming.hero || {}) }
          next.resources = { ...current.resources, ...(incoming.resources || {}) }
        }
        if (mediaResult.status === 'fulfilled') next.media = normalizeMedia(mediaResult.value.data.media || {})
        return next
      })
    })
  }, [])

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
