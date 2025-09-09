import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // About
      AboutTitle: 'The project',
      AboutContent:
        'This project, initiated by Raphaël Senellart and Jules Galhardo in ITI,\
       aims to make it easier for students to access courses and cultural events at INSA. Many \
       people contributed to its development, and we would like to thank them: Mr. Bonnegent and\
        Mr. Vasseur (DSI), Ms. Baudesson and Ms. Caldin (Cultural Service), as well as Mr. Reynet\
         (Communication Service) for their support. We also thank Michel Vespier for his technical advice on\
          the website interface. Finally, we are grateful to the students, representatives, associations, and clubs at\
           INSA for their suggestions and ideas that helped improve the project.',
      // Navbar
      Calendar: 'Calendar',
      Events: 'Events',
      Settings: 'Settings',
      Friends: 'Friends',
      About: 'About',
      // Days
      Sunday: 'Sun',
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      // Months
      January: 'Jan',
      February: 'Febr',
      March: 'March',
      April: 'April',
      May: 'May',
      June: 'June',
      July: 'Jul',
      August: 'Aug',
      September: 'Sept',
      October: 'Oct',
      November: 'Nov',
      December: 'Dec',
      // Settings
      TDList: 'TD list',
      TDListShort: 'TD',
      CreateEvent: 'Create an event',
      CreateEventShort: 'Event',
      OtherSettings: 'Other',
      TDLikely: 'Likely your TDs',
      TDNotLikely: 'Likely not your TDs',
      Save: 'Save',
      DepartmentDD: 'Department : ',
      YearDD: 'Year : ',
      ICSLink: 'Link to your ICS calendar',
      ICSText:
        'You can paste this link in Google Agenda to see your classes and personal events alltogether',
      ICSCopy: 'Copy',
      ThemeChange: 'Change theme',
      ThemeDD: 'Theme : ',
      LanguageChange: 'Language',
      LanguageDD: 'Language : ',
      Logout: 'Log out',
      Welcome: 'Welcome',
      Report: 'Report an error',
      // Event
      Close: 'Close',
      StartHour: 'Start hour : ',
      EndHour: 'End hour : ',
      Color: 'Color : ',
      More: 'More',
      Description: 'Description : ',
      Associations: 'Association(s)',
      Teachers: 'Teacher(s)',
      Delete: 'Delete',
      // Other
      WIP: 'Coming soon...',
      // Errors and Success
      LoadError: 'Error while loading ',
      SaveError: 'Error while saving ',
      DeleteError: 'Error while deleting ',
      ConfigError: 'Error while loading config ',
      LoadSuccess: 'Loading successful',
      SaveSuccess: 'Saving successful',
      DeleteSuccess: 'Delete successful (reload the page to see the update)',
      CreationSuccess:
        'Creation successful (reload the page to see the update)',
      CreationError: 'Error during creation ',
      SendError: 'Error while sending invitation ',
      AcceptError: 'Error while accepting invitation ',
      CancelError: 'Error while canceling invitation ',
      NameError: "Error while searching for a user's display name ",
      ImageLoadingError: 'Failed to load image ',
      ErrorSavingTD: 'Failed to save TDs ',
      ErrorTemplate: 'An error occured ',
      // Form
      FormTitle: 'Event title',
      FormDate: 'Date',
      FormStartHour: 'Start hour',
      FormEndHour: 'End hour',
      FormDescription: 'Description',
      FormLink: 'Link',
      FormRoom: 'Room',
      FormIsSubmitting: 'Creating...',
      FormCreate: 'Create event',
      FormReset: 'Reset',
      FormRoomDefault: 'Ma H R1 1',
      FormLinkDefault: 'Link to buy tickets, association linktree, ...',
      FormTitleDefault: 'The name of your event',
      FormDescriptionDefault: 'Quick summary of your event',
      NotAnAsso: 'You are not an association',
      ConnectAsAsso: 'Connect as association',
      // Friends
      Remove: 'Remove',
      Cancel: 'Cancel',
      Accept: 'Accept',
      Refuse: 'Refuse',
      Invite: 'Invite',
      NoUserFound: 'No user found',
      InviteSent: 'Invitations sent',
      InviteReceived: 'Invitations received',
      Return: 'Return',
      ErrorTemplateTitle: 'An error occurred',
      ErrorTemplate: 'Details',
      Retry: 'Retry',
      UnexpectedError: 'An unexpected error happened. Please try again later.',
      Error: 'Error',
      Preferences: 'Preferences',
      Support: 'Support',
      SupportSummary:
        'If you encounter issues, please fill out the form below.',
      Title: 'Title',
      Details: 'Details',
      'Submit Report': 'Submit Report',
      'Submitting...': 'Submitting...',
      ReportSent: 'Your report has been sent successfully.',
      ReportError:
        'An error occurred while sending your report. Please try again.',
      ReportBug: 'Report a bug',
      // Manual
      Manual_ChooseClasses: 'Choose your classes',
      Manual_ChooseClassesContent: '1°) Got to Settings / TD List \n2°) Select your department and year (ex: ITI 4) \n3°) Select your TD groups (if you are in doubt, or to simplify the task, look for the TD groups by clicking on the class on agendas.insa-rouen.fr) \n4°) IMPORTANT : Save your selection by clicking on the button at the bottom of the page',
      Manual_Webview: 'See your calendar on your personnal app',
      Manual_WebviewContent: "Our site is ICS enabled, which means that by clicking on the link in Settings / Other / ICS, you can import your INSA calendar into applications such as Google Calendar, etc. (the calendar will update automatically at regular intervals).",
      Manual_Friends: 'Friends',
      Manual_FriendsContent: "To add friends: \n1°) Go to Friends, search for the user's INSA username (not their first and last name). If you are searching for Bernard Dupont, search for bdupont. \n2°) Once invited, the user must accept the request so that both users can see each other's calendars (remember to refresh the page if the invitation does not appear).",
      Manual_Personnalize: 'Personnalization',
      Manual_PersonnalizeContent: 'Dans Paramètres / Autre, vous pouvez changer le thème et la langue du site',
    },
  },
  fr: {
    translation: {
      // About
      AboutTitle: 'Le projet',
      AboutContent:
        'Ce projet, initié par Raphaël Senellart et Jules Galhardo en ITI, vise à faciliter l’accès des \
                     étudiants aux cours et aux événements culturels de l’INSA. De nombreuses personnes ont contribué à \
                     son développement et nous tenons à les remercier : M. Bonnegent et M. Vasseur (DSI), Mme Baudesson \
                     et Mme Caldin (Service Culture), ainsi que M. Reynet (Service Communication) pour leur soutien. Merci \
                     également à Michel Vespier pour ses conseils techniques sur l’interface du site. Nous remercions enfin \
                     les étudiants, élus, associations et clubs de l’INSA pour leurs suggestions et idées qui ont enrichi le projet.',
      // Navbar
      Calendar: 'Calendrier',
      Events: 'Evenements',
      Settings: 'Parametres',
      Friends: 'Amis',
      About: 'A propos',
      // Days
      Sunday: 'Dim',
      Monday: 'Lun',
      Tuesday: 'Mar',
      Wednesday: 'Mer',
      Thursday: 'Jeu',
      Friday: 'Ven',
      Saturday: 'Sam',
      // Months
      January: 'Jan',
      February: 'Févr',
      March: 'Mars',
      April: 'Avril',
      May: 'Mai',
      June: 'Juin',
      July: 'Juil',
      August: 'Août',
      September: 'Sept',
      October: 'Oct',
      November: 'Nov',
      December: 'Déc',
      // Settings
      TDList: 'Liste des TDs',
      TDListShort: 'TD',
      CreateEvent: 'Créer un événement',
      CreateEventShort: 'Evénement',
      OtherSettings: 'Autre',
      TDLikely: 'Probablement vos TDs',
      TDNotLikely: 'Probablement pas vos TDs',
      Save: 'Sauvegarder',
      DepartmentDD: 'Département : ',
      YearDD: 'Année : ',
      ICSLink: 'Lien pour votre calendrier ICS',
      ICSText:
        'Vous pouvez copier ce lien dans Google Agenda pour visualiser vos cours et vos événements personnels \
                dans le même agenda',
      ICSCopy: 'Copier',
      ThemeChange: 'Changer le thème',
      ThemeDD: 'Thème : ',
      LanguageChange: 'Langue',
      LanguageDD: 'Langue : ',
      Logout: 'Se déconnecter',
      Welcome: 'Bienvenue',
      Report: 'Signaler une erreur',
      // Event
      Close: 'Fermer',
      StartHour: 'Heure de début : ',
      EndHour: 'Heure de fin : ',
      Color: 'Couleur : ',
      More: 'En savoir plus',
      Description: 'Description : ',
      Associations: 'Association(s)',
      Teachers: 'Professeur(s)',
      Delete: 'Supprimer',
      // Other
      WIP: 'Ça arrive bientôt...',
      // Errors and Success
      LoadError: 'Erreur pendant le chargement',
      SaveError: 'Erreur pendant la sauvegarde',
      DeleteError: 'Erreur pendant la suppression',
      ConfigError: 'Erreur pendant le chargement de la configuration',
      LoadSuccess: 'Chargement réussi',
      SaveSuccess: 'Sauvegarde réussie',
      DeleteSuccess:
        'Suppression réussie (rechargez la page pour mettre à jour les événements)',
      CreationSuccess:
        'Création réussie (rechargez la page pour mettre à jour les événements)',
      CreationError: 'Erreur lors de la création',
      SendError: 'Error while sending invitation ',
      AcceptError: 'Error while accepting invitation ',
      CancelError: 'Error while canceling invitation ',
      NameError: "Error while searching for a user's display name ",
      ImageLoadingError: "Echec du chargement de l'image",
      ErrorSavingTD: 'Echec de la sauvegarde des TDs',
      ErrorTemplate: 'Une erreur est arrivé',
      // Form
      FormTitle: "Titre de l'événement",
      FormDate: 'Date',
      FormStartHour: 'Heure de début',
      FormEndHour: 'Heure de fin',
      FormDescription: 'Description',
      FormLink: 'Lien',
      FormRoom: 'Salle',
      FormIsSubmitting: 'Création en cours...',
      FormCreate: "Créer l'événement",
      FormReset: 'Effacer',
      FormRoomDefault: 'Ma H R1 1',
      FormLinkDefault: "Lien de la billeterie, linktree de l'association, ...",
      FormTitleDefault: 'Le nom de votre événement',
      FormDescriptionDefault: "Résumé rapide de l'événement",
      NotAnAsso: "Vous n'êtes pas une association",
      ConnectAsAsso: "Se connecter en tant qu'association",
      // Friends
      Remove: 'Retirer',
      Cancel: 'Annuler',
      Accept: 'Accepter',
      Refuse: 'Refuser',
      Invite: 'Inviter',
      NoUserFound: 'Aucun utilisateur trouvé',
      InviteSent: 'Invitations envoyées',
      InviteReceived: 'Invitations reçues',
      Return: 'Retour',
      ErrorTemplateTitle: 'Une erreur est survenue',
      ErrorTemplate: 'Détails',
      Retry: 'Réessayer',
      UnexpectedError:
        'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',
      Error: 'Erreur',
      Preferences: 'Préférences',
      Support: 'Support',
      SupportSummary:
        'Si vous rencontrez des problèmes, veuillez remplir le formulaire ci-dessous.',
      Title: 'Titre',
      Details: 'Détails',
      'Submit Report': 'Envoyer le rapport',
      'Submitting...': 'Envoi...',
      ReportSent: 'Votre rapport a été envoyé avec succès.',
      ReportError:
        "Une erreur est survenue lors de l'envoi de votre rapport. Veuillez réessayer.",
      ReportBug: 'Signalez un bug',
      // Manual
      Manual_ChooseClasses: 'Choisir ses cours',
      Manual_ChooseClassesContent: '1°) Allez dans Paramètres / Liste des TDs \n2°) Selectionnez votre département et année (ex: ITI 4) \n3°) Selectionnez les groupes de TD qui vous appartient (si vous avez un doute, ou tout simplement pour vous facilitez la tache, regardez quel sont les groupes de TD pour chaque cours en cliquant dessus sur agendas.insa-rouen.fr ) \n4°) IMPORTANT : appuyez sur le bouton de sauvegarde en rouge en bas de la page ',
      Manual_Webview: 'Consultez votre agenda sur votre application personnelle',
      Manual_WebviewContent: "Notre site est ICS enabled, c'est à dire que grâce au lien dans Paramètres / Autre / Ics, vous pouvez importer votre agenda de l'INSA sur des application comme Google Calendar etc (l'agenda se mettra a jour automatiquement périodiquement)",
      Manual_Friends: 'Amis',
      Manual_FriendsContent: "Pour rajouter des amis : \n1°) Allez dans Amis, cherchez le `username` INSA de l'utilisateur (pas le prenom nom), si vous cherchez `Bernard Dupont`, cherchez `bdupont` \n2°) Une fois invité, l'utilisateur dois accepter la demande pour que les 2 utilisateurs puissent voir l'agenda de l'autre (pensez a rechargez la page si l'invitation n'apparrait pas)",
      Manual_Personnalize: 'Personnalisation',
      Manual_PersonnalizeContent: 'Dans Paramètres / Autre, vous pouvez changer le thème et la langue du site',
    },
  },
};

i18n
  .use(initReactI18next) // passe i18n à react-i18next
  .init({
    resources,
    lng: 'fr', // langue par défaut
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
