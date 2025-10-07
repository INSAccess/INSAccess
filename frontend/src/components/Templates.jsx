import { useTranslation } from 'react-i18next';
import { Alert, Button } from 'react-bootstrap';
import duck from '../images/duck.png';
import '../assets/Templates.scss';

/**
 * Custom Error handling component
 * @component
 * @returns {JSX.Element}
 */
const ErrorTemplate = ({ message, onRetry }) => {
  const { t } = useTranslation();

  const errorText =
    typeof message === 'string' && message.trim().length > 0
      ? message
      : t('messages.unexpectedError');

  console.error('ErrorTemplate:', message);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '60vh' }}
    >
      <Alert
        variant="danger"
        role="alert"
        className="p-4 shadow-lg rounded-3 w-100"
        style={{ maxWidth: 600 }}
      >
        <h4 className="alert-heading">
          {t('messages.errorTemplateTitle') || t('messages.error')}
        </h4>
        <p className="mb-3">
          {t('messages.errorTemplate')}: {errorText}
        </p>
        {onRetry && (
          <div className="d-flex justify-content-end">
            <Button variant="outline-light" onClick={onRetry}>
              {t('messages.retry')}
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
};

/**
 * Custom Loading component
 * @component
 * @returns {JSX.Element}
 */
const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="loadingBackground">
      <img id="rotating-logo" src={duck} alt={t('messages.imageLoadingError')}></img>
    </div>
  );
};

/**
 * Custom WIP component
 * @component
 * @returns {JSX.Element}
 */
const WorkInProgressTemplate = () => {
  const { t } = useTranslation();

  return (
    <div className="WIP">
      <h1>{t('messages.wip')}</h1>
    </div>
  );
};

export { ErrorTemplate, Loading, WorkInProgressTemplate };
