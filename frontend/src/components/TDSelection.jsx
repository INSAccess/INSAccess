import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constants';
import { useData } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils';
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
  const [infoOpen, setInfoOpen] = useState(false);

  const { refreshUserCalendar, updateUserTDs } = useData();

  const { t } = useTranslation();

  useEffect(() => {
    setSelectedTDs(new Set(userTDs));
  }, [userTDs]);

  const toggleTD = (tdName) => {
    const updatedTDs = new Set(selectedTDs);
    if (updatedTDs.has(tdName)) {
      updatedTDs.delete(tdName);
    } else {
      updatedTDs.add(tdName);
    }
    setSelectedTDs(updatedTDs);
  };

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
      updateUserTDs(selectedTDs);
      refreshUserCalendar();
    } catch (error) {
      raiseErrorFlag(true);
      setStatusMessage(t('messages.errorSavingTD'));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="checkbox-list subsection">
            <div className="d-flex justify-content-between align-items-start">
              <h1>{t('settings.tdLikely')}</h1>
              <div className="info-section position-relative">
                <button
                  type="button"
                  className="btn btn-danger"
                  id="info-btn"
                  onClick={() => setInfoOpen(!infoOpen)}
                  aria-expanded={infoOpen}
                >
                  !
                </button>

                {infoOpen && (
                  <div className="info-popup">
                    <strong>{t('messages.toastInfoTitle')}</strong>
                    <p className="mb-0">{t('messages.toastInfoContent')}</p>
                  </div>
                )}
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

        <div className="col-12 col-md-6">
          <div className="checkbox-list subsection">
            <h1>{t('settings.tdNotLikely')}</h1>
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
            {t('settings.save')}
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
