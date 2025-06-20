import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// les traductions
const resources = {
  en: {
    translation: {
      "AboutTitle": "The project",
    }
  },
  fr: {
    translation: {
      "AboutTitle": "Le projet",
    }
  }
};

i18n
  .use(initReactI18next) // passe i18n à react-i18next
  .init({
    resources,
    lng: 'fr', // langue par défaut
    keySeparator: false, // nous ne voulons pas utiliser de keys comme 'some.translation'
    interpolation: {
      escapeValue: false // pas besoin pour React car il échappe déjà par défaut
    }
  });

export default i18n;
