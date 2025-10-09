import { API_URL } from '../utils/Constants.jsx';
import { useState } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import { useTranslation } from 'react-i18next';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils.jsx';
import Alert from 'react-bootstrap/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/EventCreator.scss';

const EvenementForm = () => {
  const { t } = useTranslation();
  const { refreshAssoCalendar } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [eventDate, setEventDate] = useState(new Date());
  const [startHour, setStartHour] = useState(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });
  const [endHour, setEndHour] = useState(() => {
    const d = new Date();
    d.setHours(18, 15, 0, 0);
    return d;
  });

  const validateForm = (formJson) => {
    if (!formJson.title || formJson.title.trim() === '') {
      setStatusMessage(t('forms.titleRequired'));
      setErrorFlag(true);
      setMessageType('error');
      return false;
    }

    if (formJson.associated_link && formJson.associated_link.trim() !== '') {
      try {
        new URL(formJson.associated_link);
      } catch {
        setStatusMessage(t('forms.invalidLink'));
        setErrorFlag(true);
        setMessageType('error');
        return false;
      }
    }

    return true;
  };

  const saveEvenement = async (form) => {
    setIsSubmitting(true);
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

      if (!response.ok) {
        setStatusMessage(t('messages.creationError') + ' : ' + data?.error || '');
        setErrorFlag(true);
        setMessageType('error');
      } else {
        setStatusMessage(t('messages.creationSuccess'));
        setErrorFlag(true);
        setMessageType('success');
        refreshAssoCalendar();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(t('messages.creationError'));
      setMessageType('error');
      setErrorFlag(true);
    } finally {
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorFlag(false);

    const form = e.target;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    // Swap if start > end
    if (startHour > endHour) {
      let temp = startHour.copy();
      setStartHour(endHour);
      setEndHour(temp);
    }

    // Add Date & Time as formatted strings
    formJson.date = eventDate.toISOString().split('T')[0];
    formJson.start_hour = startHour.toTimeString().slice(0, 5);
    formJson.end_hour = endHour.toTimeString().slice(0, 5);    

    if (!validateForm(formJson)) return; // Prevent submit if validation fails

    saveEvenement(formJson);
  };

  return (
    <div className="evenement-form-wrapper">
      <div className="evenement-form">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        >
          <div className="row g-3">
            {/* Title */}
            <div className="col-md-6">
              <label htmlFor="title" className="form-label">
                {t('forms.title')}
              </label>
              <input
                className="form-control"
                id="title"
                name="title"
                placeholder={t('forms.titleDefault')}
              />
            </div>

            {/* Date */}
            <div className="col-md-6">
              <label htmlFor="date" className="form-label">
                {t('forms.date')}
              </label>
              <DatePicker
                selected={eventDate}
                onChange={(date) => setEventDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            {/* Start Time */}
            <div className="col-md-6">
              <label htmlFor="start_hour" className="form-label">
                {t('forms.startHour')}
              </label>
              <DatePicker
                selected={startHour}
                onChange={(time) => setStartHour(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                className="form-control"
              />
            </div>

            {/* End Time */}
            <div className="col-md-6">
              <label htmlFor="end_hour" className="form-label">
                {t('forms.endHour')}
              </label>
              <DatePicker
                selected={endHour}
                onChange={(time) => setEndHour(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                className="form-control"
              />
            </div>

            {/* Description */}
            <div className="col-md-6">
              <label htmlFor="info" className="form-label">
                {t('forms.description')}
              </label>
              <input
                className="form-control"
                id="info"
                name="info"
                placeholder={t('forms.descriptionDefault')}
              />
            </div>

            {/* Link */}
            <div className="col-md-6">
              <label htmlFor="associated_link" className="form-label">
                {t('forms.link')}
              </label>
              <input
                className="form-control"
                id="associated_link"
                name="associated_link"
                placeholder={t('forms.linkDefault')}
              />
            </div>

            {/* Location */}
            <div className="col-md-12">
              <label htmlFor="location" className="form-label">
                {t('forms.room')}
              </label>
              <input
                className="form-control"
                id="location"
                name="location"
                placeholder={t('forms.roomDefault')}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex gap-2">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('forms.isSubmitting') : t('forms.create')}
            </button>
            <button className="btn btn-secondary" type="reset">
              {t('forms.reset')}
            </button>
          </div>
        </form>

        {errorFlag && (
          <Alert
            variant={messageType === 'success' ? 'success' : 'danger'}
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
    </div>
  );
};

export default EvenementForm;
