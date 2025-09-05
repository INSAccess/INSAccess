import { createContext, useContext, useState, useEffect } from "react";
import RandomUtils from '../utils/RandomUtils.jsx'
import { API_URL } from '../utils/Constants.jsx'
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {

    const { t } = useTranslation();

    const [CONFIG, setConfig] = useState(null)
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [statusMessage, setStatusMessage] = useState("")
    const [error, setError] = useState(false)
    const [errorFlag, raiseErrorFlag] = useState(false)

    // Load the config
    useEffect(() => {
        const loadData = async () => {
            const result = await RandomUtils.fetchData(API_URL+"/api/get_config");
            if (result.data){
                setData(result.data);
            }
        
            if (result.error){
                setStatusMessage(t("ConfigError"))
                setError(true)
                raiseErrorFlag(true)
                setData({})
            }

            setLoading(false);
        };
    
        loadData();
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
        <>
            <ConfigContext.Provider value={CONFIG}>
                {children}
            </ConfigContext.Provider>
            {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
        </>
    );
}

export const useConfig = () => useContext(ConfigContext);