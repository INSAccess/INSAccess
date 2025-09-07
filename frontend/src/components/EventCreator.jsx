import { API_URL } from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Day from '../utils/Day.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext.jsx';

const EvenementForm = ({}) => {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const { forceUpdate } = useData();

  // Function to save evenement to the backend
  const saveEvenement = async ({ form }) => {
    try {
      const response = await fetch(API_URL + '/api/post_insa_evenement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await response.json();
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

  let date = new Date();
  let day = new Day(date);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
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
      <form method="post" onSubmit={handleSubmit}>
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

const EventCreator = () => {
  const { isAssos } = useAuth();
  const { t } = useTranslation();
  const urlLogin = API_URL + 'authentification/login';
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
