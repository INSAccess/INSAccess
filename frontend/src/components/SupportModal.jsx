import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../utils/Constants.jsx';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils.jsx';

const SupportModal = () => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setFormData({ title: '', details: '' }); // reset form
    setStatusMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      const data = await parseJsonSafe(response);

      setStatusMessage(t('ReportSent'));
      setErrorFlag(false);
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatusMessage(t('ReportError'));
      setErrorFlag(true);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 🔹 Button to open modal */}
      <Button className="btn btn-primary" onClick={handleOpen}>
        {t('ReportBug')}
      </Button>

      {/* 🔹 Modal itself */}
      <Modal show={show} onHide={handleClose} centered>
        <div className="support-modal">
          <Modal.Header closeButton>
            <Modal.Title>{t('Support')}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{t('SupportSummary')}</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="bugTitle">
                <Form.Label>{t('Title')}</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
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
                />
              </Form.Group>

              {statusMessage && (
                <p
                  className={`status-message ${
                    errorFlag ? 'error' : 'success'
                  }`}
                >
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
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default SupportModal;
