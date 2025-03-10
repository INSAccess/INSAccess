const { useState } = React;

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
            const response = await fetch('/param/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            <div class= "validate">
            <button class='button_validate' onClick={saveSelection}>Sauvegarder</button>
            <p1>{statusMessage}</p1>
            </div>
        </div>
    );
}

// Render the React component in the DOM
ReactDOM.render(
    <TDSelection allTDs={allTDs} userTDs={userTDs} />,
    document.getElementById('app')
);
