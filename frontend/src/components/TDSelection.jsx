import { useState } from 'react';
import { API_URL } from '../utils/Constants';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils';
import { useData } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import './TDSelection.scss';

/**
 * Component listing the different TDs the user can "subscribe" to.
 * @component
 * @returns {JSX.Element}
 */
function TDSelection({ departementTDs, otherTDs, userTDs }) {
  const [selectedTDs, setSelectedTDs] = useState(new Set(userTDs));
  const [statusMessage, setStatusMessage] = useState(' ');
  const [errorFlag, raiseErrorFlag] = useState(false);

  const BUNDLE = useData();
  const updateFunction = BUNDLE.forceUpdate;

  const { t } = useTranslation();

  const toastTrigger = document.getElementById('info-btn')
  const toast = document.getElementById('info')

  if (toastTrigger) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show()
    })
  }

  // Function to toggle selection of a TD
  const toggleTD = (tdName) => {
    const updatedTDs = new Set(selectedTDs);
    if (updatedTDs.has(tdName)) {
      updatedTDs.delete(tdName);
    } else {
      updatedTDs.add(tdName);
    }
    setSelectedTDs(updatedTDs);
  };

  // Function to save selection to the backend
  const saveSelection = async () => {
    try {
      const response = await fetch(API_URL + '/api/user/td_groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ selected_tds: Array.from(selectedTDs) }),
      });
      const data = await parseJsonSafe(response);
      setStatusMessage(data.success);
      updateFunction();
    } catch (error) {
      raiseErrorFlag(true);
      setStatusMessage(t('ErrorSavingTD'));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Première liste - 12 colonnes sur mobile, 6 sur desktop */}
        <div className="col-12 col-md-6">
          <div className="checkbox-list subsection">
            <div className="d-flex justify-content-between align-items-stretch">
              <h1>{t('TDLikely')}</h1>
              <button type="button" className="btn btn-danger" id="info-btn">!</button>

              <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="info" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                  <div className="toast-header" style={{gap:"0.6rem"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                    </svg>
                    <strong className="me-auto">{t('ToastInfoTitle')}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                  </div>
                  <div className="toast-body">
                    {t('ToastInfoContent')}
                  </div>
                </div>
              </div>
            </div>
            {departementTDs.map((td) => (
              <li key={td}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTDs.has(td)}
                    onChange={() => toggleTD(td)}
                  />
                  {td}
                </label>
              </li>
            ))}
          </div>
        </div>

        {/* Deuxième liste - 12 colonnes sur mobile, 6 sur desktop */}
        <div className="col-12 col-md-6">
          <div className="checkbox-list subsection">
            <h1>{t('TDNotLikely')}</h1>
            {otherTDs.map((td) => (
              <li key={td}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTDs.has(td)}
                    onChange={() => toggleTD(td)}
                  />
                  {td}
                </label>
              </li>
            ))}
          </div>
        </div>
        <div className="validate subsection">
          <button
            className="button-validate btn btn-primary"
            onClick={saveSelection}
          >
            {t('Save')}
          </button>
          <p>{statusMessage}</p>
        </div>
      </div>
      {errorFlag && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => {
            raiseErrorFlag(false);
          }}
        >
          {statusMessage}
        </Alert>
      )}
    </div>
  );
}

export default TDSelection;
