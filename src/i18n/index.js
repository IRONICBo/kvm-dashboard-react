import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './en.json';
import zhTranslation from './zh.json';

const lang = localStorage.getItem('local') || (['en' , 'en-US', 'en-us'].includes(navigator.language)  ? 'en' : 'zh');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    lng: lang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
});

console.log('lang', lang)

export default i18n;