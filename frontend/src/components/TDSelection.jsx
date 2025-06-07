import { useState } from "react";
import { API_URL } from '../utils/Constants'
import RandomUtils from '../utils/RandomUtils'
import { useData } from '../contexts/DataContext'
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
        <div style={{"display":"flex", "width":"100%"}}>
            <div className='checkbox-list' style={{"flex":"1"}}>
                <h1>Probablements vos TDs</h1>
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
                <div className= "validate">
                    <button className='button_validate btn btn-primary' onClick={saveSelection}>Sauvegarder</button>
                    <p>{statusMessage}</p>
                </div>
            </div>
            <div className='checkbox-list' style={{"flex":"1"}}>
                <h1>Probablement pas vos TDs</h1>
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
            {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
        </div>
    );
}

export default TDSelection;