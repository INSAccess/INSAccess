import { useState } from "react";

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
            headers: { 'Content-Type': 'application/json' },
            mode:"cors",
            credentials:'include',
            body: JSON.stringify({ selected_tds: Array.from(selectedTDs) }),
        });
        const data = await response.json();
        setStatusMessage(data.message);
      } catch (error) {
          setStatusMessage("An error occurred while saving your selection.");
      }
    };

    return (
        <div>
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