/**
 * @fileoverview Composant React pour la création d'événements INSA.
 * Ce fichier contient les composants pour créer et gérer des événements
 * avec validation d'authentification pour les associations.
 * @author Votre nom
 * @version 1.0.0
 */

import { API_URL } from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Day from '../utils/Day.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {Object} FormData
 * @property {string} title - Titre de l'événement
 * @property {string} date - Date de l'événement (format YYYY-MM-DD)
 * @property {string} start_hour - Heure de début (format HH:MM)
 * @property {string} end_hour - Heure de fin (format HH:MM)
 * @property {string} info - Description de l'événement
 * @property {string} associated_link - Lien associé à l'événement
 * @property {string} location - Lieu de l'événement
 */

/**
 * @typedef {Object} SaveEvenementParams
 * @property {FormData} form - Données du formulaire à sauvegarder
 */

/**
 * Composant formulaire pour la création d'événements INSA.
 * Ce composant permet aux associations de créer de nouveaux événements
 * avec validation des horaires et soumission vers l'API backend.
 *
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {string} [props.url] - URL pour la création (non utilisé dans l'implémentation actuelle)
 * @returns {JSX.Element} Le composant formulaire de création d'événement
 *
 * @example
 * // Utilisation basique du composant
 * <EvenementForm />
 *
 * @example
 * // Avec une URL personnalisée
 * <EvenementForm url="/custom/create/endpoint" />
 */
const EvenementForm = ({}) => {
  const { t } = useTranslation();

  /**
   * État de soumission du formulaire
   * @type {boolean}
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Flag d'affichage du message d'état
   * @type {boolean}
   */
  const [errorFlag, setErrorFlag] = useState(false);

  /**
   * Message de statut à afficher à l'utilisateur
   * @type {string}
   */
  const [statusMessage, setStatusMessage] = useState('');

  const { forceUpdate } = useData();

  /**
   * Fonction asynchrone pour sauvegarder un événement vers l'API backend.
   * Envoie les données du formulaire via une requête POST et gère les réponses.
   *
   * @async
   * @function saveEvenement
   * @param {SaveEvenementParams} params - Paramètres de sauvegarde
   * @param {FormData} params.form - Les données du formulaire à sauvegarder
   * @throws {Error} Lance une erreur si la requête échoue
   *
   * @example
   * await saveEvenement({
   *   form: {
   *     title: "Conférence Tech",
   *     date: "2023-12-01",
   *     start_hour: "14:00",
   *     end_hour: "16:00",
   *     info: "Conférence sur les nouvelles technologies",
   *     associated_link: "https://example.com",
   *     location: "Amphithéâtre A"
   *   }
   * });
   */
  const saveEvenement = async ({ form }) => {
    try {
      const response = await fetch(API_URL + '/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await parseJsonSafe(response);
      setStatusMessage(t('CreationSuccess'));
      setErrorFlag(true);
      setIsSubmitting(true);
      forceUpdate();
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatusMessage(t('CreationError'));
      setErrorFlag(true);
      setIsSubmitting(false);
    }
  };

  /**
   * Date courante pour l'initialisation du formulaire
   * @type {Date}
   */
  let date = new Date();

  /**
   * Instance Day pour le formatage de la date
   * @type {Day}
   */
  let day = new Day(date);

  /**
   * Gestionnaire de soumission du formulaire.
   * Traite les données du formulaire, valide et normalise les heures,
   * puis appelle la fonction de sauvegarde.
   *
   * Les heures sont automatiquement ajustées :
   * - L'heure de début est arrondie à la dizaine inférieure (ex: 14:23 → 14:20)
   * - L'heure de fin est arrondie à la dizaine supérieure avec 5 minutes (ex: 16:23 → 16:25)
   *
   * @function handleSubmit
   * @param {Event} e - Événement de soumission du formulaire
   *
   * @example
   * // Le formulaire normalise automatiquement les heures :
   * // start_hour: "14:23" devient "14:20"
   * // end_hour: "16:23" devient "16:25"
   */
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Normalisation de l'heure de début
    let startHour = formData.get('start_hour');
    if (startHour != undefined && startHour != '') {
      if (
        startHour[startHour.length - 1] != '5' &&
        startHour[startHour.length - 1] != '0'
      ) {
        formData.set('start_hour', startHour.replace(/.$/, '0'));
      }
    } else {
      formData.set('start_hour', '08:00');
    }

    // Normalisation de l'heure de fin
    let endHour = formData.get('end_hour');
    if (endHour != undefined && endHour != '') {
      if (
        endHour[endHour.length - 1] != '5' &&
        endHour[endHour.length - 1] != '0'
      ) {
        formData.set('end_hour', endHour.replace(/.$/, '5'));
      }
    } else {
      formData.set('end_hour', '18:15');
    }

    const formJson = Object.fromEntries(formData.entries());
    saveEvenement({ form: formJson });
  }

  return (
    <div style={{ position: 'relative', minHeight: '100svh', margin: '2%' }}>
      <form
        method="post"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        <div className="row g-3">
          {/* Première ligne : Titre et Date */}
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">
              {t('FormTitle')}
            </label>
            <input
              className="form-control"
              id="title"
              name="title"
              placeholder={t('FormTitleDefault')}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="date" className="form-label">
              {t('FormDate')}
            </label>
            <input
              className="form-control"
              id="date"
              name="date"
              type="date"
              defaultValue={day.getDate()}
            />
          </div>

          {/* Deuxième ligne : Heures */}
          <div className="col-md-6">
            <label htmlFor="start_hour" className="form-label">
              {t('FormStartHour')}
            </label>
            <input
              className="form-control"
              id="start_hour"
              name="start_hour"
              type="time"
              defaultValue="08:00"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="end_hour" className="form-label">
              {t('FormEndHour')}
            </label>
            <input
              className="form-control"
              id="end_hour"
              name="end_hour"
              type="time"
              defaultValue="18:15"
            />
          </div>

          {/* Troisième ligne : Description et Lien */}
          <div className="col-md-6">
            <label htmlFor="info" className="form-label">
              {t('FormDescription')}
            </label>
            <input
              className="form-control"
              id="info"
              name="info"
              placeholder={t('FormDescriptionDefault')}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="associated_link" className="form-label">
              {t('FormLink')}
            </label>
            <input
              className="form-control"
              id="associated_link"
              name="associated_link"
              placeholder={t('FormLinkDefault')}
            />
          </div>

          {/* Quatrième ligne : Salle */}
          <div className="col-md-12">
            <label htmlFor="location" className="form-label">
              {t('FormRoom')}
            </label>
            <input
              className="form-control"
              id="location"
              name="location"
              placeholder={t('FormRoomDefault')}
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="mt-4 d-flex gap-2">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('FormIsSubmitting') : t('FormCreate')}
          </button>
          <button className="btn btn-secondary" type="reset">
            {t('FormReset')}
          </button>
        </div>
      </form>
      {errorFlag && (
        <Alert
          variant="success"
          onClose={() => setErrorFlag(false)}
          dismissible
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            right: 20,
            zIndex: 1050,
          }}
        >
          {statusMessage}
        </Alert>
      )}
    </div>
  );
};

/**
 * Composant principal pour la création d'événements avec vérification d'authentification.
 * Ce composant vérifie si l'utilisateur est une association autorisée avant
 * d'afficher le formulaire de création d'événement.
 *
 * @component
 * @returns {JSX.Element} Le composant de création d'événement ou un message d'erreur d'authentification
 *
 * @example
 * // Utilisation dans un routeur React
 * <Route path="/create-event" component={EventCreator} />
 *
 * @example
 * // Utilisation directe
 * function App() {
 *   return (
 *     <div>
 *       <EventCreator />
 *     </div>
 *   );
 * }
 */
const EventCreator = () => {
  const { isAssos } = useData();
  const { t } = useTranslation();

  /**
   * Redirect URL to the login page
   * @type {string}
   */
  const urlLogin = API_URL + 'authentification/login';

  /**
   * Event creation URL (not used in current implementation)
   * @type {string}
   */
  const urlCreate = API_URL + '/create';

  if (!isAssos) {
    return (
      <div>
        <p>{t('NotAnAsso')}</p>
        <Button href={urlLogin}>{t('ConnectAsAsso')}</Button>
      </div>
    );
  } else {
    return <EvenementForm url={urlCreate} />;
  }
};

export default EventCreator;
