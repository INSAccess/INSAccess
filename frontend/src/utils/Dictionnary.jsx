import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // About Section
      about: {
        title: 'The project',
        content: 'This project, initiated by Raphaël Senellart and Jules Galhardo in ITI, aims to make it easier for students to access courses and cultural events at INSA. Many people contributed to its development, and we would like to thank them: Mr. Bonnegent and Mr. Vasseur (DSI), Ms. Baudesson and Ms. Caldin (Cultural Service), as well as Mr. Reynet (Communication Service) for their support. We also thank Michel Vespier for his technical advice on the website interface. Finally, we are grateful to the students, representatives, associations, and clubs at INSA for their suggestions and ideas that helped improve the project.'
      },

      // Navigation
      nav: {
        calendar: 'Calendar',
        events: 'Events',
        settings: 'Settings',
        friends: 'Friends',
        help: 'Help'
      },

      // Date & Time
      date: {
        days: {
          sunday: 'Sun',
          monday: 'Mon',
          tuesday: 'Tue',
          wednesday: 'Wed',
          thursday: 'Thu',
          friday: 'Fri',
          saturday: 'Sat'
        },
        months: {
          january: 'Jan',
          february: 'Febr',
          march: 'March',
          april: 'April',
          may: 'May',
          june: 'June',
          july: 'Jul',
          august: 'Aug',
          september: 'Sept',
          october: 'Oct',
          november: 'Nov',
          december: 'Dec'
        }
      },

      // Settings
      settings: {
        tdList: 'TD list',
        tdListShort: 'TD',
        assoList: 'Association list',
        assoListShort: 'Assos',
        createEvent: 'Publish an event',
        createEventShort: 'Publish',
        otherSettings: 'Other',
        assoSelect: 'Association selection',
        tdLikely: 'Likely your TDs',
        tdNotLikely: 'Likely not your TDs',
        save: 'Save',
        departmentDD: 'Department : ',
        yearDD: 'Year : ',
        icsLink: 'Link to your ICS calendar',
        icsText: 'You can paste this link in Google Agenda to see your classes and personal events alltogether',
        icsCopy: 'Copy',
        themeChange: 'Change theme',
        themeDD: 'Theme : ',
        languageChange: 'Language',
        languageDD: 'Language : ',
        logout: 'Log out',
        welcome: 'Welcome',
        report: 'Report an error',
        casAutoSync: 'Sync my TDs with CAS at login',
        syncNow: 'Sync now',
        syncSuccess: 'TDs synced successfully',
        syncError: 'Failed to sync TDs'
      },

      // Events
      events: {
        close: 'Close',
        startHour: 'Start hour : ',
        endHour: 'End hour : ',
        color: 'Color : ',
        more: 'More',
        description: 'Description : ',
        associations: 'Association(s)',
        teachers: 'Teacher(s)',
        delete: 'Delete',
        syncing: 'Syncing...',
        synced: 'Synced!',
        failed: 'Failed'
      },

      // Forms
      forms: {
        title: 'Event title',
        date: 'Date',
        startHour: 'Start hour',
        endHour: 'End hour',
        description: 'Description',
        link: 'Link',
        room: 'Room',
        isSubmitting: 'Creating...',
        create: 'Create event',
        reset: 'Reset',
        roomDefault: 'Ma H R1 1',
        linkDefault: 'Link to buy tickets, association linktree, ...',
        titleDefault: 'The name of your event',
        descriptionDefault: 'Quick summary of your event',
        notAnAsso: 'You are not an association',
        connectAsAsso: 'Connect as association',
        titleRequired: "Title required",
        invalidLink: "Invalid links"
      },

      // Friends
      friends: {
        remove: 'Remove',
        cancel: 'Cancel',
        accept: 'Accept',
        refuse: 'Refuse',
        invite: 'Invite',
        noUserFound: 'No user found',
        inviteSent: 'Invitations sent',
        inviteReceived: 'Invitations received',
        return: 'Return',
        seeing: 'Seeing',
        search: 'Search for a friend...'
      },

      // Messages & Notifications
      messages: {
        wip: 'Coming soon...',
        toastInfoTitle: 'Important',
        toastInfoContent: "Some classes were not given a TD group when first created by the administration and consequently don't show up on the list of available TDs. We are currently working on the issue, thank you for your understanding.",
        loadError: 'Error while loading ',
        saveError: 'Error while saving ',
        deleteError: 'Error while deleting ',
        configError: 'Error while loading config ',
        loadSuccess: 'Loading successful',
        saveSuccess: 'Saving successful',
        deleteSuccess: 'Delete successful',
        creationSuccess: 'Creation successful ',
        creationError: 'Error during creation ',
        sendError: 'Error while sending invitation ',
        acceptError: 'Error while accepting invitation ',
        cancelError: 'Error while canceling invitation ',
        nameError: "Error while searching for a user's display name ",
        imageLoadingError: 'Failed to load image ',
        errorSavingTD: 'Failed to save TDs ',
        errorSavingAsso: 'Failed to save associations',
        errorTemplateTitle: 'An error occurred',
        errorTemplate: 'Details',
        retry: 'Retry',
        unexpectedError: 'An unexpected error happened. Please try again later.',
        error: 'Error'
      },

      // Support
      support: {
        preferences: 'Preferences',
        support: 'Support',
        supportSummary: 'If you encounter issues, please fill out the form below.',
        supportTitle: 'Title',
        supportTitleDefault: 'Type of issue',
        supportDetails: 'Details',
        supportDetailsDefault: 'Quick description of your issue (please include how to reproduce the problem)',
        submitReport: 'Submit Report',
        submitting: 'Submitting...',
        reportSent: 'Your report has been sent successfully.',
        reportError: 'An error occurred while sending your report. Please try again.',
        reportBug: 'Report a bug'
      },

      // Manual
      manual: {
        title: 'User Manual',
        chooseClasses: 'Choose your classes',
        chooseClassesContent: '1) Got to Settings / TD List \n2) Select your department and year (ex: ITI 4) \n3) Select your TD groups (if you are in doubt, or to simplify the task, look for the TD groups by clicking on the class on agendas.insa-rouen.fr) \n4) IMPORTANT : Save your selection by clicking on the button at the bottom of the page',
        ics: 'See your calendar on your personnal app',
        icsContent: 'Our site is ICS enabled, which means that by clicking on the link in Settings / Other / ICS, you can import your INSA calendar into applications such as Google Calendar, etc. (the calendar will update automatically at regular intervals).',
        friends: 'Add friends',
        friendsContent: "1) Go to Friends, search for the user's INSA username (not their first and last name). If you are searching for Bernard Dupont, search for bdupont. \n2) Once invited, the user must accept the request so that both users can see each other's calendars (remember to refresh the page if the invitation does not appear).",
        personalize: 'Personnalization',
        personalizeContent: 'In Settings / Other, you can change the site\'s theme and language.'
      },

      // FAQ
      faq: {
        title: 'FAQ',
        tdNotFoundQuestion: "I can't find some of my classes !",
        tdNotFoundAnswer: "For each class, there is a TD group associated. We use this to enable you to 'subscribe' to these classes. But sometimes, as these groups are written by hand, there can be some errors and we can't do anything on our side. We are actively working on a solution (temporary or permanent).",
        assoPublisherQuestion: 'How can I publish events ?',
        assoPublisherAnswer: "If you are eligible (an association, a club, or an INSA Service for exemple) you can contact the DSI (via https://support.insa-rouen.fr/, in the category \'Service en ligne > Emploi du temps\') to be flagged as a publisher. You must have beforehand visited the website at least once (for your account to be created via CAS) and there must be someone legally responsible for the CAS account you'll be using. When all this is done, there will be an extra tab in the Settings page for you to create and publish an event.",
        webviewQuestion: 'Is the calendar available to download ?',
        webviewAnswer: "The app is not available on Google Play or App Store but you can create a webview for yourself, as most navigators allow you to add a page to your homescreen. The way to do this can vary depending on your phone's model and the version of your navigator.",
        friendNotFoundQuestion: "I can't find my friends in the research bar",
        friendNotFoundAnswer: "First, check if you used the username of your friend and not their full name (Alice Durand would be adurand). Then, if you still can't find your friend, even with the right username, maybe they never connected to our website. The users are created when first connecting with CAS so they must first have visited they app at least once before they are visible in the list",
        whyDuckQuestion: 'Why are there duck everywhere ?',
        whyDuckAnswer: "Ducks are the emblem of the ITI department. This comes from a story every developper know. When you are stuck with a problem and you can't find the solution, it often helps to talk about it with someone. And as many people know ITI student don't have friends, so we use a rubber duck instead :) ."
      }
    }
  },
  fr: {
    translation: {
      // About Section
      about: {
        title: 'Le projet',
        content: 'Ce projet, initié par Raphaël Senellart et Jules Galhardo en ITI, vise à faciliter l\'accès des étudiants aux cours et aux événements culturels de l\'INSA. De nombreuses personnes ont contribué à son développement et nous tenons à les remercier : M. Bonnegent et M. Vasseur (DSI), Mme Baudesson et Mme Caldin (Service Culture), ainsi que M. Reynet (Service Communication) pour leur soutien. Merci également à Michel Vespier pour ses conseils techniques sur l\'interface du site. Nous remercions enfin les étudiants, élus, associations et clubs de l\'INSA pour leurs suggestions et idées qui ont enrichi le projet.'
      },

      // Navigation
      nav: {
        calendar: 'Calendrier',
        events: 'Evenements',
        settings: 'Parametres',
        friends: 'Amis',
        help: 'Aide'
      },

      // Date & Time
      date: {
        days: {
          sunday: 'Dim',
          monday: 'Lun',
          tuesday: 'Mar',
          wednesday: 'Mer',
          thursday: 'Jeu',
          friday: 'Ven',
          saturday: 'Sam'
        },
        months: {
          january: 'Jan',
          february: 'Févr',
          march: 'Mars',
          april: 'Avril',
          may: 'Mai',
          june: 'Juin',
          july: 'Juil',
          august: 'Août',
          september: 'Sept',
          october: 'Oct',
          november: 'Nov',
          december: 'Déc'
        }
      },

      // Settings
      settings: {
        tdList: 'Liste des TDs',
        tdListShort: 'TD',
        assoList: 'Liste des associations',
        assoListShort: 'Assos',
        createEvent: 'Publier un événement',
        createEventShort: 'Publier',
        otherSettings: 'Autre',
        assoSelect: 'Selection des associations',
        tdLikely: 'Probablement vos TDs',
        tdNotLikely: 'Probablement pas vos TDs',
        save: 'Sauvegarder',
        departmentDD: 'Département : ',
        yearDD: 'Année : ',
        icsLink: 'Lien pour votre calendrier ICS',
        icsText: 'Vous pouvez copier ce lien dans Google Agenda pour visualiser vos cours et vos événements personnels dans le même agenda',
        icsCopy: 'Copier',
        themeChange: 'Changer le thème',
        themeDD: 'Thème : ',
        languageChange: 'Langue',
        languageDD: 'Langue : ',
        logout: 'Se déconnecter',
        welcome: 'Bienvenue',
        report: 'Signaler une erreur',
        casAutoSync: 'Synchroniser mes TDs avec CAS à la connexion',
        syncNow: 'Synchroniser',
        syncSuccess: 'TDs synchronisés avec succès',
        syncError: 'Échec de la synchronisation des TDs'
      },

      // Events
      events: {
        close: 'Fermer',
        startHour: 'Heure de début : ',
        endHour: 'Heure de fin : ',
        color: 'Couleur : ',
        more: 'En savoir plus',
        description: 'Description : ',
        associations: 'Association(s)',
        teachers: 'Professeur(s)',
        delete: 'Supprimer',
        syncing: 'Synchronisation...',
        synced: 'Synchronisé !',
        failed: 'Échec'
      },

      // Forms
      forms: {
        title: "Titre de l'événement",
        date: 'Date',
        startHour: 'Heure de début',
        endHour: 'Heure de fin',
        description: 'Description',
        link: 'Lien',
        room: 'Salle',
        isSubmitting: 'Création en cours...',
        create: "Créer l'événement",
        reset: 'Effacer',
        roomDefault: 'Ma H R1 1',
        linkDefault: "Lien de la billeterie, linktree de l'association, ...",
        titleDefault: 'Le nom de votre événement',
        descriptionDefault: "Résumé rapide de l'événement",
        notAnAsso: "Vous n'êtes pas une association",
        connectAsAsso: "Se connecter en tant qu'association",
        titleRequired: "Titre obligatoire",
        invalidLink: "Lien non valide"
      },

      // Friends
      friends: {
        remove: 'Retirer',
        cancel: 'Annuler',
        accept: 'Accepter',
        refuse: 'Refuser',
        invite: 'Inviter',
        noUserFound: 'Aucun utilisateur trouvé',
        inviteSent: 'Invitations envoyées',
        inviteReceived: 'Invitations reçues',
        return: 'Retour',
        seeing: 'Regarde',
        search: 'Rechercher un ami...'
      },

      // Messages & Notifications
      messages: {
        wip: 'Ça arrive bientôt...',
        toastInfoTitle: 'Important',
        toastInfoContent: "Certains cours n'ont pas de groupes de TD qui leur ont été associés par l'administration, ils n'apparaissent donc pas encore sur l'agenda. On travaille activement dessus, merci pour votre compréhension.",
        loadError: 'Erreur pendant le chargement',
        saveError: 'Erreur pendant la sauvegarde',
        deleteError: 'Erreur pendant la suppression',
        configError: 'Erreur pendant le chargement de la configuration',
        loadSuccess: 'Chargement réussi',
        saveSuccess: 'Sauvegarde réussie',
        deleteSuccess: 'Suppression réussie ',
        creationSuccess: 'Création réussie ',
        creationError: 'Erreur lors de la création',
        sendError: "Erreur lors de l'envoi de l'invitation ",
        acceptError: "Erreur lors de l'acceptation de l'invitation ",
        cancelError: "Erreur lors de l'annulation de l'invitation ",
        nameError: "Erreur pendant la recherche du nom d'affichage de l'utilisateur ",
        imageLoadingError: "Echec du chargement de l'image",
        errorSavingTD: 'Echec de la sauvegarde des TDs',
        errorSavingAsso: 'Echec de la sauvegarde des associations',
        errorTemplateTitle: 'Une erreur est survenue',
        errorTemplate: 'Détails',
        retry: 'Réessayer',
        unexpectedError: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',
        error: 'Erreur'
      },

      // Support
      support: {
        preferences: 'Préférences',
        support: 'Support',
        supportSummary: 'Si vous rencontrez des problèmes, veuillez remplir le formulaire ci-dessous.',
        supportTitle: 'Titre',
        supportTitleDefault: 'Type du bug',
        supportDetails: 'Détails',
        supportDetailsDefault: 'Description rapide du bug (avec les étapes pour le reproduire si possible)',
        submitReport: 'Envoyer le rapport',
        submitting: 'Envoi...',
        reportSent: 'Votre rapport a été envoyé avec succès.',
        reportError: "Une erreur est survenue lors de l'envoi de votre rapport. Veuillez réessayer.",
        reportBug: 'Signalez un bug'
      },

      // Manual
      manual: {
        title: 'Manuel utilisateur',
        chooseClasses: 'Choisir ses cours',
        chooseClassesContent: '1) Allez dans Paramètres / Liste des TDs \n2) Selectionnez votre département et année (ex: ITI 4) \n3) Selectionnez les groupes de TD qui vous appartient (si vous avez un doute, ou tout simplement pour vous facilitez la tache, regardez quel sont les groupes de TD pour chaque cours en cliquant dessus sur agendas.insa-rouen.fr ) \n4) IMPORTANT : appuyez sur le bouton de sauvegarde en rouge en bas de la page ',
        ics: 'Consultez votre agenda sur votre application personnelle',
        icsContent: "Notre site est ICS enabled, c'est à dire que grâce au lien dans Paramètres / Autre / ICS, vous pouvez importer votre agenda de l'INSA sur des application comme Google Calendar etc (l'agenda se mettra a jour automatiquement périodiquement)",
        friends: 'Ajouter des amis',
        friendsContent: "1) Allez dans Amis, cherchez le username INSA de l'utilisateur (pas le prenom nom), si vous cherchez Bernard Dupont, tapez bdupont \n2) Une fois invité, l'utilisateur dois accepter la demande pour que les 2 utilisateurs puissent voir l'agenda de l'autre (pensez a rechargez la page si l'invitation n'apparrait pas)",
        personalize: 'Personnalisation',
        personalizeContent: 'Dans Paramètres / Autre, vous pouvez changer le thème et la langue du site'
      },

      // FAQ
      faq: {
        title: 'FAQ',
        tdNotFoundQuestion: "Je n'arrive pas à trouver mes cours !",
        tdNotFoundAnswer: "À chaque cours correspond un groupe TD. Nous utilisons ce système pour vous permettre de vous « inscrire » à ces cours. Cependant, ces groupes étant créés manuellement, des erreurs peuvent parfois se produire et nous ne pouvons rien y faire de notre côté. Nous travaillons activement à la mise en place d'une solution (temporaire ou permanente).",
        assoPublisherQuestion: 'Comment est-ce que je peux publier des événements ?',
        assoPublisherAnswer: "Si vous êtes éligible (une association, un club ou un service INSA par exemple), vous pouvez contacter le DSI (via https://support.insa-rouen.fr/, catégorie \'Service en ligne > Emploi du temps\') pour être référencé en tant qu'éditeur. Vous devez avoir préalablement visité le site web au moins une fois (pour que votre compte soit créé via CAS) et il doit y avoir une personne légalement responsable du compte CAS que vous utiliserez. Une fois toutes ces étapes effectuées, un onglet supplémentaire apparaîtra dans la page Paramètres pour vous permettre de créer et de publier un événement.",
        webviewQuestion: "Est-ce que je peux télécharger l'application ?",
        webviewAnswer: "L'application n'est pas disponible sur Google Play ou l'App Store, mais vous pouvez créer une vue Web pour vous-même, car la plupart des navigateurs vous permettent d'ajouter une page à votre écran d'accueil. La manière de procéder peut varier en fonction du modèle de votre téléphone et de la version de votre navigateur.",
        friendNotFoundQuestion: "Je n'arrive pas à trouver mes amis dans la barre de recherche",
        friendNotFoundAnswer: "Tout d'abord, vérifiez que vous avez bien utilisé le nom d'utilisateur de votre ami et non son nom complet (Alice Durand serait adurand). Ensuite, si vous ne trouvez toujours pas votre ami, même avec le bon nom d'utilisateur, il se peut qu'il ne se soit jamais connecté à notre site web. Les utilisateurs sont créés lors de leur première connexion à CAS, ils doivent donc avoir visité l'application au moins une fois avant d'apparaître dans la liste.",
        whyDuckQuestion: 'Pourquoi il y a des canards partout ?',
        whyDuckAnswer: "Les canards sont l'emblème du département ITI. Ça vient d'une histoire que tous les développeurs connaissent. Lorsque vous êtes bloqué sur un problème et que vous ne trouvez pas la solution, il est souvent utile d'en parler à quelqu'un. Et comme beaucoup le savent, les ITI n'ont pas d'amis, alors on utilise un canard en plastique à la place :) ."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // langue par défaut
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;