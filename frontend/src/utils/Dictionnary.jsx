import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // About
      "AboutTitle": "The project",
      "AboutContent":"This project, created by Raphaël Senellart and Jules Galhardo in ITI, aims to make it easier for students to access INSA's courses and cultural events. Throughout its development, \
                      we have benefited from the invaluable support of many people whom we would like to thank: Mr Bonnegent and Mr Vasseur from the DSI, Ms Baudesson and Ms Caldin \
                      from the Culture Department and Mr Reynet from the Communications Department for their constant support and for promoting this project, not forgetting Michel Vespier for his technical advice on the site's interface. \
                      We don't forget either the students, elected representatives, associations and clubs at INSA for their suggestions and ideas on the site's functionalities.",
      // Navbar
      "Calendar":"Calendar",
      "Events":"Events",
      "Settings":"Settings",
      "Friends":"Friends",
      "About":"About",
      // Days
      "Sunday":"Sun",
      "Monday":"Mon",
      "Tuesday":"Tue",
      "Wednesday":"Wed",
      "Thursday":"Thu",
      "Friday":"Fri",
      "Saturday":"Sat",
      // Months
      "January":"Jan", 
      "February":"Febr", 
      "March":"March", 
      "April":"April", 
      "May":"May", 
      "June":"June", 
      "July":"Jul", 
      "August":"Aug", 
      "September":"Sept", 
      "October":"Oct", 
      "November":"Nov", 
      "December":"Dec",
      // Settings
      "TDList":"TD list",
      "TDListShort":"TD",
      "CreateEvent":"Create an event",
      "CreateEventShort":"Event",
      "OtherSettings":"Other",
      "TDLikely":"Likely your TDs",
      "TDNotLikely":"Likely not your TDs",
      "Save":"Save",
      "DepartmentDD":"Department : ",
      "YearDD":"Year : ",
      "ICSLink":"Link to your ICS calendar",
      "ICSText":"You can paste this link in Google Agenda to see your classes and personal events alltogether",
      "ICSCopy":"Copy",
      "ThemeChange":"Change theme",
      "ThemeDD":"Theme : ",
      "LanguageChange":"Language",
      "LanguageDD":"Language : ",
      "Logout":"Log out",
      "Welcome":"Welcome",
      // Event
      "Close":"Close",
      "StartHour":"Start hour : ",
      "EndHour":"End hour : ",
      "Color":"Color : ",
      "More":"More",
      "Description":"Description : ",
      "Associations":"Association(s)",
      "Teachers":"Teacher(s)",
      // Other
      "WIP":"Coming soon...",
    }
  },
  fr: {
    translation: {
      // About
      "AboutTitle": "Le projet",
      "AboutContent":"Ce projet, créé par Raphaël Senellart et Jules Galhardo en ITI, a pour ambition de faciliter l'accès des étudiants aux cours et aux événements culturels de l'INSA. Tout au long de son développement, \
                      nous avons bénéficié du soutien précieux de nombreuses personnes que nous tenons à remercier : M. Bonnegent et M. Vasseur de la DSI, Mme Baudesson et Mme Caldin \
                      du Service Culture et M. Reynet du Service Communication pour leur soutien constant et pour avoir valorisé ce projet, sans oublier Michel Vespier pour ses conseils techniques concernant l'interface du site. \
                      Nous n'oublions pas les étudiants, les élus, les associations et les clubs de l'INSA pour leurs propositions et idées sur les fonctionnalités du site.",
      // Navbar
      "Calendar":"Calendrier",
      "Events":"Evenements",
      "Settings":"Parametres",
      "Friends":"Amis",
      "About":"A propos",
      // Days
      "Sunday":"Dim",
      "Monday":"Lun",
      "Tuesday":"Mar",
      "Wednesday":"Mer",
      "Thursday":"Jeu",
      "Friday":"Ven",
      "Saturday":"Sam",
      // Months
      "January":"Jan", 
      "February":"Févr", 
      "March":"Mars", 
      "April":"Avril", 
      "May":"Mai", 
      "June":"Juin", 
      "July":"Juil", 
      "August":"Août", 
      "September":"Sept", 
      "October":"Oct", 
      "November":"Nov", 
      "December":"Déc",
      // Settings
      "TDList":"Liste des TDs",
      "TDListShort":"TD",
      "CreateEvent":"Créer un événement",
      "CreateEventShort":"Evénement",
      "OtherSettings":"Autre",
      "TDLikely":"Probablement vos TDs",
      "TDNotLikely":"Probablement pas vos TDs",
      "Save":"Sauvegarder",
      "DepartmentDD":"Département : ",
      "YearDD":"Année : ",
      "ICSLink":"Lien pour votre calendrier ICS",
      "ICSText":"Vous pouvez copier ce lien dans Google Agenda pour visualiser vos cours et vos événements personnels \
                dans le même agenda",
      "ICSCopy":"Copier",
      "ThemeChange":"Changer le thème",
      "ThemeDD":"Thème : ",
      "LanguageChange":"Langue",
      "LanguageDD":"Langue : ",
      "Logout":"Se déconnecter",
      "Welcome":"Bienvenue",
      // Event
      "Close":"Fermer",
      "StartHour":"Heure de début : ",
      "EndHour":"Heure de fin : ",
      "Color":"Couleur : ",
      "More":"En savoir plus",
      "Description":"Description : ",
      "Associations":"Association(s)",
      "Teachers":"Professeur(s)",
      // Other
      "WIP":"Ça arrive bientôt...",
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
