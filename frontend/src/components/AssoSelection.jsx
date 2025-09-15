import { useState } from 'react';
import { API_URL } from '../utils/Constants';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils';
import { useData } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';

/**
 * Component listing the different Assos the user can "subscribe" to.
 * @component
 * @returns {JSX.Element}
 */
function AssoSelection() {
  const { userAssos, assoList, forceUpdate } = useData();
  const { t } = useTranslation();

  const [selectedAssos, setSelectedAssos] = useState(new Set(userAssos));
  const [statusMessage, setStatusMessage] = useState(' ');
  const [errorFlag, raiseErrorFlag] = useState(false);

  // Function to toggle selection of a Asso
  const toggleAsso = (assoName) => {
    const updatedAssos = new Set(selectedAssos);
    if (updatedAssos.has(assoName)) {
      updatedAssos.delete(assoName);
    } else {
      updatedAssos.add(assoName);
    }
    setSelectedAssos(updatedAssos);
  };

  // Function to save selection to the backend
  const saveSelection = async () => {
    try {
      const response = await fetch(API_URL + '/api/user/associations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ selected_assos: Array.from(selectedAssos) }),
      });
      const data = await parseJsonSafe(response);
      setStatusMessage(data.success);
      forceUpdate();
    } catch (error) {
      raiseErrorFlag(true);
      setStatusMessage(t('ErrorSavingAsso'));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="checkbox-list subsection">
            <h1>{t('AssoSelect')}</h1>
            {assoList.map((asso) => (
              <li key={asso}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAssos.has(asso)}
                    onChange={() => toggleAsso(asso)}
                  />
                  {asso}
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

export default AssoSelection;
