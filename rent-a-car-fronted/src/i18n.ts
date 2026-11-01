import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import az from "./locales/az.json"
import en from "./locales/en.json"

export const LANGUAGES = ["az", "en"] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = "lang"

const getInitialLanguage = (): Language => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && (LANGUAGES as readonly string[]).includes(saved)) return saved as Language
    } catch {
        // localStorage əlçatan deyilsə, susmaya görə az
    }
    return "az"
}

i18n.use(initReactI18next).init({
    resources: {
        az: { translation: az },
        en: { translation: en }
    },
    lng: getInitialLanguage(),
    fallbackLng: "az",
    supportedLngs: LANGUAGES as unknown as string[],
    interpolation: {
        escapeValue: false
    }
})

// Dil dəyişəndə yadda saxla və <html lang> yenilə
const applyLanguage = (lng: string) => {
    document.documentElement.lang = lng
    try {
        localStorage.setItem(STORAGE_KEY, lng)
    } catch {
        // ignore
    }
}

applyLanguage(i18n.language)
i18n.on("languageChanged", applyLanguage)

export default i18n
