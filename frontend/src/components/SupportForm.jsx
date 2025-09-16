import { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../utils/Constants.jsx';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils.jsx';
import './SupportForm.scss';

const SupportForm = ({ className = '' }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ title: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);
  const titleRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setErrorFlag(false);

    try {
      const response = await fetch(API_URL + '/api/user/bug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      await parseJsonSafe(response);

      setStatusMessage(t('ReportSent'));
      setErrorFlag(false);
      setFormData({ title: '', details: '' });
    } catch (err) {
      console.error(err);
      setStatusMessage(t('ReportError'));
      setErrorFlag(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`support-inline ${className}`}>
      <p className="support-summary">{t('SupportSummary')}</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="bugTitle">
          <Form.Label>{t('Title')}</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            ref={titleRef}
            placeholder={t('Title')}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="bugDetails">
          <Form.Label>{t('Details')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            placeholder={t('Details')}
          />
        </Form.Group>

        {statusMessage && (
          <p className={`status-message ${errorFlag ? 'error' : 'success'}`}>
            {statusMessage}
          </p>
        )}

        <Button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('Submitting...') : t('Submit Report')}
        </Button>
      </Form>
    </div>
  );
};

export default SupportForm;
