import { useState } from "react";
import { API_URL } from '../js/constants'
import './TDSelection.scss'

const getCSRFToken = () => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return null;
};

function TDSelection({ allTDs, userTDs }) {
    const [selectedTDs, setSelectedTDs] = useState(new Set(userTDs));
    const [statusMessage, setStatusMessage] = useState(" ");

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
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken()},
            mode:"cors",
            credentials:'include',
            body: JSON.stringify({ selected_tds: Array.from(selectedTDs) }),
        });
        const data = await response.json();
        setStatusMessage(data.success);
      } catch (error) {
        console.error(error)
          setStatusMessage("An error occurred while saving your selection.");
      }
    };

    return (
        <div>
            {allTDs.map(td => (
                <li key={td.name}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedTDs.has(td.name)}
                            onChange={() => toggleTD(td.name)}
                        />
                        {td.name}
                    </label>
                </li>
            ))}
            <div className= "validate">
            <button className='button_validate' onClick={saveSelection}>Sauvegarder</button>
            <p>{statusMessage}</p>
            </div>
        </div>
    );
}

export default TDSelection;