import { useState } from "react";
import { API_URL } from '../utils/Constants'
import RandomUtils from '../utils/RandomUtils'
import { useData } from '../contexts/DataContext'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'

/**
 * Component listing the different TDs the user can "subscribe" to. 
 * @component
 * @returns {JSX.Element} 
 */
function TDSelection({ departementTDs, otherTDs, userTDs }) {
    const [selectedTDs, setSelectedTDs] = useState(new Set(userTDs));
    const [statusMessage, setStatusMessage] = useState(" ");
    const [errorFlag, raiseErrorFlag] = useState(false)

    const BUNDLE = useData()
    const updateFunction = BUNDLE.forceUpdate

    const { t, i18n } = useTranslation();

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
        const response = await fetch(API_URL+'/api/save_tds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': RandomUtils.getCSRFToken()},
            mode:"cors",
            credentials:'include',
            body: JSON.stringify({ selected_tds: Array.from(selectedTDs) }),
        });
        const data = await response.json();
        setStatusMessage(data.success);
        updateFunction()
    } catch (error) {
        
        raiseErrorFlag(true)
        setStatusMessage("Echec de la sauvegarde des TDs");
    }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Première liste - 12 colonnes sur mobile, 6 sur desktop */}
                <div className="col-12 col-md-6">
                    <div className='checkbox-list'>
                        <h1>{t('TDLikely')}</h1>
                        {departementTDs.map(td => (
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
                    <div className='checkbox-list'>
                        <h1>{t('TDNotLikely')}</h1>
                        {otherTDs.map(td => (
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
                <div className= "validate">
                    <button className='button_validate btn btn-primary' onClick={saveSelection}>{t('Save')}</button>
                    <p>{statusMessage}</p>
                </div>
            </div>
            {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
        </div>
    );
}

export default TDSelection;