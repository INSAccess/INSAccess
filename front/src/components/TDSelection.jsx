import { useState } from "react";
import { API_URL, minWidth } from '../js/constants'
import './TDSelection.scss'
import RandomUtils from '../js/RandomUtils'
import Day from '../js/Day'

function TDSelection({ allTDs, userTDs, updateFunction }) {
    const [selectedTDs, setSelectedTDs] = useState(new Set(userTDs));
    const [statusMessage, setStatusMessage] = useState(" ");

    let dimensions = RandomUtils.useWindowDimensions();
    const current_date = new Date()
    let first_day = new Day(current_date)
    let day = (minWidth < dimensions.width) ? first_day.getDate() : first_day.startOfWeek().getDate()

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
        console.error(error)
        setStatusMessage("An error occurred while saving your selection.");
    }
    };

    return (
        <div className='checkbox-list'>
            {allTDs.map(td => (
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
            <button className='button_validate' onClick={saveSelection}>Sauvegarder</button>
            <p>{statusMessage}</p>
            </div>
        </div>
    );
}

export default TDSelection;