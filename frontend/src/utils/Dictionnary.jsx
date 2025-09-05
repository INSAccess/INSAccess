import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useData } from '../contexts/DataContext.jsx'

const resources = {
  en: {
    translation: {
      // About
      "AboutTitle": "The project",
      "AboutContent":"This project, initiated by Raphaël Senellart and Jules Galhardo in ITI,\
       aims to make it easier for students to access courses and cultural events at INSA. Many \
       people contributed to its development, and we would like to thank them: Mr. Bonnegent and\
        Mr. Vasseur (DSI), Ms. Baudesson and Ms. Caldin (Cultural Service), as well as Mr. Reynet\
         (Communication Service) for their support. We also thank Michel Vespier for his technical advice on\
          the website interface. Finally, we are grateful to the students, representatives, associations, and clubs at\
           INSA for their suggestions and ideas that helped improve the project.",
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
      "Delete":"Delete",
      // Other
      "WIP":"Coming soon...",
    }
  },
  fr: {
    translation: {
      // About
      "AboutTitle": "Le projet",
      "AboutContent":"Ce projet, initié par Raphaël Senellart et Jules Galhardo en ITI, vise à faciliter l’accès des \
                     étudiants aux cours et aux événements culturels de l’INSA. De nombreuses personnes ont contribué à \
                     son développement et nous tenons à les remercier : M. Bonnegent et M. Vasseur (DSI), Mme Baudesson \
                     et Mme Caldin (Service Culture), ainsi que M. Reynet (Service Communication) pour leur soutien. Merci \
                     également à Michel Vespier pour ses conseils techniques sur l’interface du site. Nous remercions enfin \
                     les étudiants, élus, associations et clubs de l’INSA pour leurs suggestions et idées qui ont enrichi le projet.",
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
      "Delete":"Supprimer",
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
