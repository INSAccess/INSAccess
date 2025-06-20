import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "AboutTitle": "The project",
      "AboutContent":"This project, created by Raphaël Senellart and Jules Galhardo in ITI, aims to make it easier for students to access INSA's courses and cultural events. Throughout its development, \
                      we have benefited from the invaluable support of many people whom we would like to thank: Mr Bonnegent and Mr Vasseur from the DSI, Ms Baudesson and Ms Caldin \
                      from the Culture Department and Mr Reynet from the Communications Department for their constant support and for promoting this project, not forgetting Michel Vespier for his technical advice on the site's interface. \
                      We don't forget either the students, elected representatives, associations and clubs at INSA for their suggestions and ideas on the site's functionalities.",
      "Calendar":"Calendar",
      "Events":"Events",
      "Settings":"Settings",
      "Friends":"Friends",
      "About":"About",
    }
  },
  fr: {
    translation: {
      "AboutTitle": "Le projet",
      "AboutContent":"Ce projet, créé par Raphaël Senellart et Jules Galhardo en ITI, a pour ambition de faciliter l'accès des étudiants aux cours et aux événements culturels de l'INSA. Tout au long de son développement, \
                      nous avons bénéficié du soutien précieux de nombreuses personnes que nous tenons à remercier : M. Bonnegent et M. Vasseur de la DSI, Mme Baudesson et Mme Caldin \
                      du Service Culture et M. Reynet du Service Communication pour leur soutien constant et pour avoir valorisé ce projet, sans oublier Michel Vespier pour ses conseils techniques concernant l'interface du site. \
                      Nous n'oublions pas les étudiants, les élus, les associations et les clubs de l'INSA pour leurs propositions et idées sur les fonctionnalités du site.",
      "Calendar":"Calendrier",
      "Events":"Evenements",
      "Settings":"Parametres",
      "Friends":"Amis",
      "About":"A propos",
    }
  }
};

i18n
  .use(initReactI18next) // passe i18n à react-i18next
  .init({
    resources,
    lng: 'fr', // langue par défaut
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
