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
      Help: 'Help',
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
      AssoList: 'Association list',
      AssoListShort: 'Assos',
      CreateEvent: 'Publish an event',
      CreateEventShort: 'Publish',
      OtherSettings: 'Other',
      AssoSelect: 'Association selection',
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
      ToastInfoTitle: 'Important',
      ToastInfoContent:
        "Some classes were not given a TD group when first created by the administration and consequently don't show up on the list of available TDs. We are currently working on the issue, thank you for your understanding.",
      // Errors and Success
      LoadError: 'Error while loading ',
      SaveError: 'Error while saving ',
      DeleteError: 'Error while deleting ',
      ConfigError: 'Error while loading config ',
      LoadSuccess: 'Loading successful',
      SaveSuccess: 'Saving successful',
      DeleteSuccess: 'Delete successful',
      CreationSuccess: 'Creation successful ',
      CreationError: 'Error during creation ',
      SendError: 'Error while sending invitation ',
      AcceptError: 'Error while accepting invitation ',
      CancelError: 'Error while canceling invitation ',
      NameError: "Error while searching for a user's display name ",
      ImageLoadingError: 'Failed to load image ',
      ErrorSavingTD: 'Failed to save TDs ',
      ErrorSavingAsso: 'Failed to save associations',
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
      SupportTitle: 'Title',
      SupportTitleDefault: 'Type of issue',
      SupportDetails: 'Details',
      SupportDetailsDefault:
        'Quick description of your issue (please include how to reproduce the problem)',
      'Submit Report': 'Submit Report',
      'Submitting...': 'Submitting...',
      ReportSent: 'Your report has been sent successfully.',
      ReportError:
        'An error occurred while sending your report. Please try again.',
      ReportBug: 'Report a bug',
      Seeing: 'Seeing',
      Search: 'Search for a friend...',
      CasAutoSync: 'Sync my TDs with CAS at login',
      SyncNow: 'Sync now',
      SyncSuccess: 'TDs synced successfully',
      SyncError: 'Failed to sync TDs',
      // Manual
      Manual_Title: 'User Manual',
      Manual_ChooseClasses: 'Choose your classes',
      Manual_ChooseClassesContent:
        '1) Got to Settings / TD List \n2) Select your department and year (ex: ITI 4) \n3) Select your TD groups (if you are in doubt, or to simplify the task, look for the TD groups by clicking on the class on agendas.insa-rouen.fr) \n4) IMPORTANT : Save your selection by clicking on the button at the bottom of the page',
      Manual_ICS: 'See your calendar on your personnal app',
      Manual_ICSContent:
        'Our site is ICS enabled, which means that by clicking on the link in Settings / Other / ICS, you can import your INSA calendar into applications such as Google Calendar, etc. (the calendar will update automatically at regular intervals).',
      Manual_Friends: 'Add friends',
      Manual_FriendsContent:
        "1) Go to Friends, search for the user's INSA username (not their first and last name). If you are searching for Bernard Dupont, search for bdupont. \n2) Once invited, the user must accept the request so that both users can see each other's calendars (remember to refresh the page if the invitation does not appear).",
      Manual_Personnalize: 'Personnalization',
      Manual_PersonnalizeContent:
        'In Settings / Other, you can change the site’s theme and language.',
      //FAQ
      FAQ_Title: 'FAQ',
      FAQ_TdNotFound_Question: "I can't find some of my classes !",
      FAQ_TdNotFound_Answer:
        "For each class, there is a TD group associated. We use this to enable you to 'subscribe' to these classes. But sometimes, as these groups are written by hand, there can be some errors and we can't do anything on our side. We are actively working on a solution (temporary or permanent).",
      FAQ_AssoPublisher_Question: 'How can I publish events ?',
      FAQ_AssoPublisherAnswer:
        "If you are eligible (an association, a club, or an INSA Service for exemple) you can contact the DSI (via https://support.insa-rouen.fr/) to be flagged as a publisher. You must have beforehand visited the website at least once (for your account to be created via CAS) and there must be someone legally responsible for the CAS account you'll be using. When all this is done, there will be an extra tab in the Settings page for you to create and publish an event.",
      FAQ_Webview_Question: 'Is the calendar available to download ?',
      FAQ_Webview_Answer:
        "The app is not available on Google Play or App Store but you can create a webview for yourself, as most navigators allow you to add a page to your homescreen. The way to do this can vary depending on your phone's model and the version of your navigator.",
      FAQ_FriendNotFound_Question:
        "I can't find my friends in the research bar",
      FAQ_FriendNotFound_Answer:
        "First, check if you used the username of your friend and not their full name (Alice Durand would be adurand). Then, if you still can't find your friend, even with the right username, maybe they never connected to our website. The users are created when first connecting with CAS so they must first have visited they app at least once before they are visible in the list",
      FAQ_WhyDuck_Question: 'Why are there duck everywhere ?',
      FAQ_WhyDuck_Answer:
        "Ducks are the emblem of the ITI department. This comes from a story every developper know. When you are stuck with a problem and you can't find the solution, it often helps to talk about it with someone. And as many people know ITI student don't have friends, so we use a rubber duck instead :) .",
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
      Help: 'Aide',
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
      AssoList: 'Liste des associations',
      AssoListShort: 'Assos',
      CreateEvent: 'Publier un événement',
      CreateEventShort: 'Publier',
      OtherSettings: 'Autre',
      AssoSelect: 'Selection des associations',
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
      ToastInfoTitle: 'Important',
      ToastInfoContent:
        "Certains cours n'ont pas de groupes de TD qui leur ont été associés par l'administration, ils n'apparaissent donc pas encore sur l'agenda. On travaille activement dessus, merci pour votre compréhension.",
      // Errors and Success
      LoadError: 'Erreur pendant le chargement',
      SaveError: 'Erreur pendant la sauvegarde',
      DeleteError: 'Erreur pendant la suppression',
      ConfigError: 'Erreur pendant le chargement de la configuration',
      LoadSuccess: 'Chargement réussi',
      SaveSuccess: 'Sauvegarde réussie',
      DeleteSuccess: 'Suppression réussie ',
      CreationSuccess: 'Création réussie ',
      CreationError: 'Erreur lors de la création',
      SendError: "Erreur lors de l'envoi de l'invitation ",
      AcceptError: "Erreur lors de l'acceptation de l'invitation ",
      CancelError: "Erreur lors de l'annulation de l'invitation ",
      NameError:
        "Erreur pendant la recherche du nom d'affichage de l'utilisateur ",
      ImageLoadingError: "Echec du chargement de l'image",
      ErrorSavingTD: 'Echec de la sauvegarde des TDs',
      ErrorSavingAsso: 'Echec de la sauvegarde des associations',
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
      SupportTitle: 'Titre',
      SupportTitleDefault: 'Type du bug',
      SupportDetails: 'Détails',
      SupportDetailsDefault:
        'Description rapide du bug (avec les étapes pour le reproduire si possible)',
      'Submit Report': 'Envoyer le rapport',
      'Submitting...': 'Envoi...',
      ReportSent: 'Votre rapport a été envoyé avec succès.',
      ReportError:
        "Une erreur est survenue lors de l'envoi de votre rapport. Veuillez réessayer.",
      ReportBug: 'Signalez un bug',
      Seeing: 'Regarde',
      Search: 'Rechercher un ami...',
      CasAutoSync: 'Synchroniser mes TDs avec CAS à la connexion',
      SyncNow: 'Synchroniser',
      SyncSuccess: 'TDs synchronisés avec succès',
      SyncError: 'Échec de la synchronisation des TDs',
      // Manual
      Manual_Title: 'Manuel utilisateur',
      Manual_ChooseClasses: 'Choisir ses cours',
      Manual_ChooseClassesContent:
        '1) Allez dans Paramètres / Liste des TDs \n2) Selectionnez votre département et année (ex: ITI 4) \n3) Selectionnez les groupes de TD qui vous appartient (si vous avez un doute, ou tout simplement pour vous facilitez la tache, regardez quel sont les groupes de TD pour chaque cours en cliquant dessus sur agendas.insa-rouen.fr ) \n4) IMPORTANT : appuyez sur le bouton de sauvegarde en rouge en bas de la page ',
      Manual_ICS: 'Consultez votre agenda sur votre application personnelle',
      Manual_ICSContent:
        "Notre site est ICS enabled, c'est à dire que grâce au lien dans Paramètres / Autre / ICS, vous pouvez importer votre agenda de l'INSA sur des application comme Google Calendar etc (l'agenda se mettra a jour automatiquement périodiquement)",
      Manual_Friends: 'Ajouter des amis',
      Manual_FriendsContent:
        "1) Allez dans Amis, cherchez le username INSA de l'utilisateur (pas le prenom nom), si vous cherchez Bernard Dupont, tapez bdupont \n2) Une fois invité, l'utilisateur dois accepter la demande pour que les 2 utilisateurs puissent voir l'agenda de l'autre (pensez a rechargez la page si l'invitation n'apparrait pas)",
      Manual_Personnalize: 'Personnalisation',
      Manual_PersonnalizeContent:
        'Dans Paramètres / Autre, vous pouvez changer le thème et la langue du site',
      //FAQ
      FAQ_Title: 'FAQ',
      FAQ_TdNotFound_Question: "Je n'arrive pas à trouver mes cours !",
      FAQ_TdNotFound_Answer:
        "À chaque cours correspond un groupe TD. Nous utilisons ce système pour vous permettre de vous « inscrire » à ces cours. Cependant, ces groupes étant créés manuellement, des erreurs peuvent parfois se produire et nous ne pouvons rien y faire de notre côté. Nous travaillons activement à la mise en place d'une solution (temporaire ou permanente).",
      FAQ_AssoPublisher_Question:
        'Comment est-ce que je peux publier des événements ?',
      FAQ_AssoPublisherAnswer:
        "Si vous êtes éligible (une association, un club ou un service INSA par exemple), vous pouvez contacter le DSI (via https://support.insa-rouen.fr/) pour être référencé en tant qu'éditeur. Vous devez avoir préalablement visité le site web au moins une fois (pour que votre compte soit créé via CAS) et il doit y avoir une personne légalement responsable du compte CAS que vous utiliserez. Une fois toutes ces étapes effectuées, un onglet supplémentaire apparaîtra dans la page Paramètres pour vous permettre de créer et de publier un événement.",
      FAQ_Webview_Question: "Est-ce que je peux télécharger l'application ?",
      FAQ_Webview_Answer:
        "L'application n'est pas disponible sur Google Play ou l'App Store, mais vous pouvez créer une vue Web pour vous-même, car la plupart des navigateurs vous permettent d'ajouter une page à votre écran d'accueil. La manière de procéder peut varier en fonction du modèle de votre téléphone et de la version de votre navigateur.",
      FAQ_FriendNotFound_Question:
        "Je n'arrive pas à trouver mes amis dans la barre de recherche",
      FAQ_FriendNotFound_Answer:
        "Tout d'abord, vérifiez que vous avez bien utilisé le nom d'utilisateur de votre ami et non son nom complet (Alice Durand serait adurand). Ensuite, si vous ne trouvez toujours pas votre ami, même avec le bon nom d'utilisateur, il se peut qu'il ne se soit jamais connecté à notre site web. Les utilisateurs sont créés lors de leur première connexion à CAS, ils doivent donc avoir visité l'application au moins une fois avant d'apparaître dans la liste.",
      FAQ_WhyDuck_Question: 'Pourquoi il y a des canards partout ?',
      FAQ_WhyDuck_Answer:
        "Les canards sont l'emblème du département ITI. Ça vient d'une histoire que tous les développeurs connaissent. Lorsque vous êtes bloqué sur un problème et que vous ne trouvez pas la solution, il est souvent utile d'en parler à quelqu'un. Et comme beaucoup le savent, les ITI n'ont pas d'amis, alors on utilise un canard en plastique à la place :) .",
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
