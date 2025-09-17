import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constants';
import RandomUtils, { parseJsonSafe } from '../utils/RandomUtils';
import { useData } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';

function AssoSelection() {
  const { userAssos, assoList, updateUserAssos, refreshAssoCalendar } =
    useData();
  const { t } = useTranslation();

  const [selectedAssos, setSelectedAssos] = useState(new Set());
  const [statusMessage, setStatusMessage] = useState(' ');
  const [errorFlag, raiseErrorFlag] = useState(false);

  const normalizeAsso = (asso) => {
    if (!asso) return '';
    if (typeof asso === 'string') return asso;
  };

  useEffect(() => {
    const normalized = (userAssos || []).map(normalizeAsso);
    setSelectedAssos(new Set(normalized));
  }, [userAssos]);

  const toggleAsso = (label) => {
    const updatedAssos = new Set(selectedAssos);
    if (updatedAssos.has(label)) {
      updatedAssos.delete(label);
    } else {
      updatedAssos.add(label);
    }
    setSelectedAssos(updatedAssos);
  };

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

      setStatusMessage(data?.success ?? t('Saved'));

      updateUserAssos(Array.from(selectedAssos));
      await refreshAssoCalendar();
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
            {(assoList || []).map((assoItem) => {
              const label = normalizeAsso(assoItem);
              return (
                <li key={label}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedAssos.has(label)}
                      onChange={() => toggleAsso(label)}
                    />
                    {label}
                  </label>
                </li>
              );
            })}
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
