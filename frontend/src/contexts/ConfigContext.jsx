import { createContext, useContext, useState, useEffect } from "react";
import RandomUtils from '../utils/RandomUtils.jsx'
import { API_URL } from '../utils/Constants.jsx'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
    const [CONFIG, setConfig] = useState({})
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load the config
    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/get_config");
          if (result.data){
            setData(result.data);
          }

          setError(result.error);
          setLoading(false);
        };
    
        loadData();

        if (error){
            console.error("Erreur lors du fetch de la configuration")
            setData({})
        }
    }, []);

    // Format the config
    useEffect(() => {
        if (!loading && !error){
            let departementYears = {}
            let departementNames = data["department_list"]

            for (let depart of data["department_list"]){
                departementYears[depart] = data["years_for_department"]
            }
            for (let prepa of data["prepa_name"]){
                departementYears[prepa] = data["years_for_prepa"]
                departementNames.push(prepa)
            }

            setConfig({"departementYears":departementYears, "departementNames":departementNames})
        }
    }, [loading, error])

    return (
        <ConfigContext.Provider value={CONFIG}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => useContext(ConfigContext);