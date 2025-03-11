import { useState, useEffect } from "react";
import { API_URL } from './constants.js'

function getConfig(){
  let { data, error, loading } = LoadData("http://localhost:3000/config.json")

  if (!loading){
    if (!error){
      return data
    } else {
      return null
    }
  }
}

function max(a, b){
  return (a > b) ? a : b;
}

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

const fetchData = async (data_path) => {
  const initConfig = {
    method:'GET',
    headers:{'Content-Type':'application/json', 'Accept':'application/json'},
    mode:'cors',
    credentials:'include'
  }
  try {
    const response = await fetch(data_path, initConfig);
    if (!response.ok) {
      throw new Error("Erreur lors du fetch");
    }
    const json = await response.json();
    return { data: json, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

function LoadData(data_path){
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData(data_path);
      setData(result.data);
      setError(result.error);
      setLoading(false);
    };

    loadData();
  }, []);

  return {data, error, loading}
}

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

export { useWindowDimensions, fetchData, LoadData, TDSelection, max };