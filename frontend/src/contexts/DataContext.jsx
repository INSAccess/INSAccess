import { createContext, useContext, useState, useEffect } from "react";
import Day from '../utils/Day.jsx';
import { minWidth, PATH_CALENDAR, PATH_ASSO,API_URL } from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { Loading } from '../components/Templates.jsx'
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { useConfig } from './ConfigContext.jsx';

const DataContext = createContext()

export const DataProvider = (props) => {

  const CONFIG = useConfig()
  const departementNames = CONFIG ? CONFIG["departementNames"] : ["STPI"]
  const departementYears = CONFIG ? CONFIG["departementYears"] : {"STPI":[1]}

  const [dataAsso, setDataAsso] = useState([])
  const [dataAgenda, setDataAgenda] = useState([])
  const [loading, setLoading] = useState(false)
  const [shouldUpdate, setUpdate] = useState(true)
  const [errorFlag, raiseErrorFlag] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [icsLink, setIcsLink] = useState("Error when loading ics");
  const [isAssos, setIsAssos] = useState(false);
  const [allThemes, setAllThemes] = useState(null)
  const [userTheme, setUserTheme] = useState(null)
  const [tds, setTds] = useState({})

  const { t, i18n } = useTranslation();

  const dayList = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday'),];

  let dimensions = RandomUtils.useWindowDimensions();

  const currentDate = new Date()
  let firstDay = new Day(currentDate)
  let day = (minWidth < dimensions.width) ? firstDay.startOfWeek(dayList).getDate() : firstDay.getDate()

  function forceUpdate(){
    setUpdate(true)
  }

  // Load both the data of the classes and the events
  useEffect(() => {
      window.scrollTo(0, 0);
      const loadData = async () => {
        if (!shouldUpdate || props.page != "home") return;

        if (!CONFIG) {
          console.log("CONFIG pas encore disponible, on attend...");
          return;
        }
        
        setLoading(true);

        // Charger les données de base en parallèle
        const [resultAsso, resultAgenda, resultTheme, resultIcs, resultIsAssos, resultThemes] = await Promise.all([
          RandomUtils.fetchData(PATH_ASSO),
          RandomUtils.fetchData(PATH_CALENDAR + day),
          RandomUtils.fetchData(API_URL + "/api/get_user_theme"),
          RandomUtils.fetchData(API_URL + "/api/get_ics_url"),
          RandomUtils.fetchData(API_URL + "/api/is_association"),
          RandomUtils.fetchData(API_URL + "/api/get_themes")
        ]);

        // Charger les TDs pour tous les départements et années
        const tdsPromises = [];
        const departmentYearPairs = [];
        
        for (let departement of departementNames) {
          
          if (departementYears[departement]) {
            for (let year of departementYears[departement]) {
              const key = departement + year;
              const url = API_URL + "/api/get_tds/" + key + "?format=json";
              
              departmentYearPairs.push({ departement, year, key });
              tdsPromises.push(RandomUtils.fetchData(url));
            }
          } else {
            console.warn("Aucune année trouvée pour le département:", departement);
          }
        }

        // Attendre que tous les TDs soient chargés
        const tdsResults = await Promise.all(tdsPromises);

        // Construire l'objet tdsData avec les résultats
        const tdsData = {};
        tdsResults.forEach((resultTds, index) => {
          const { key, departement, year } = departmentYearPairs[index];
          
          if (resultTds.data) {
            tdsData[key] = {
              "user_tds": resultTds.data.user_tds,
              "other_tds": resultTds.data.other_tds,
              "department_tds": resultTds.data.department_tds
            };
          } else {
            console.warn(`Pas de données pour ${key}:`, resultTds.error);
          }
        });

        // Mettre à jour le state avec les données TDs
        setTds(tdsData);
        
        document.getElementById("root").setAttribute("data-theme",resultTheme.data);
        setDataAsso(resultAsso.data || []);
        setDataAgenda(resultAgenda.data || []);

        if (resultIsAssos.data){
          setIsAssos(resultIsAssos.data);
        }

        if (resultThemes.data){
          setAllThemes(resultThemes.data)
        }

        if (resultTheme.data){
          setUserTheme(resultTheme.data)
        }

        if (resultIcs.data){
          setIcsLink(resultIcs.data);
        }

        if (resultAsso.error){
          setStatusMessage(resultAsso.error)
          raiseErrorFlag(true)
        } else if (resultAgenda.error){
          setStatusMessage(resultAgenda.error)
          raiseErrorFlag(true)
        } else if (resultTheme.error){
          setStatusMessage(resultTheme.error)
          raiseErrorFlag(true)
        }

        console.log("=== FIN CHARGEMENT DONNEES ===");
        setLoading(false);
        setUpdate(false);
      };
  
      loadData();

    }, [shouldUpdate, day, props.page, CONFIG]);
  
  if (loading && (dataAsso.length == 0 || dataAgenda.length == 0)) {
    return <Loading />;
  }

  return (
    <>
      <DataContext.Provider value={{dataAsso, dataAgenda, day, forceUpdate, tds, icsLink, isAssos, allThemes, userTheme}}>
          {props.children}
      </DataContext.Provider>
      {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
    </>
  );
}

export const useData = () => useContext(DataContext);