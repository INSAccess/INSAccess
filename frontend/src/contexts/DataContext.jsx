import { createContext, useContext, useState, useEffect } from "react";
import Day from '../utils/Day.jsx';
import { minWidth, PATH_CALENDAR, PATH_ASSO, API_URL } from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { Loading } from '../components/Templates.jsx'
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { useConfig } from './ConfigContext.jsx';

const DataContext = createContext();

export const DataProvider = (props) => {
  const CONFIG = useConfig();
  const departementNames = CONFIG ? CONFIG["departementNames"] : ["STPI"];
  const departementYears = CONFIG ? CONFIG["departementYears"] : {"STPI":[1]};
  const [dataAsso, setDataAsso] = useState([]);
  const [dataAgenda, setDataAgenda] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTds, setLoadingTds] = useState(false);
  const [shouldUpdate, setUpdate] = useState(true);
  const [errorFlag, raiseErrorFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [icsLink, setIcsLink] = useState("Error when loading ics");
  const [isAssos, setIsAssos] = useState(false);
  const [allThemes, setAllThemes] = useState(null);
  const [userTheme, setUserTheme] = useState(null);
  const [tds, setTds] = useState({});
  // Ajout d'un compteur pour forcer le re-render
  const [updateCounter, setUpdateCounter] = useState(0);
  
  const { t, i18n } = useTranslation();
  const dayList = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
  let dimensions = RandomUtils.useWindowDimensions();
  const currentDate = new Date();
  let firstDay = new Day(currentDate);
  let day = (minWidth < dimensions.width) ? firstDay.startOfWeek(dayList).getDate() : firstDay.getDate();

  // Fonction forceUpdate modifiée pour utiliser un compteur
  function forceUpdate() {
    setUpdate(true);
    setUpdateCounter(prev => prev + 1); // Force le re-render même si les autres deps n'ont pas changé
  }

  // Chargement des données principales (agenda, asso, thème, etc.)
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMainData = async () => {
      // Conditions simplifiées - on charge si shouldUpdate est true ET qu'on est sur la bonne page
      if (!shouldUpdate) return;
      if (props.page !== "home") return;
      if (!CONFIG) return;

      setLoading(true);
      try {
        const [resultAsso, resultAgenda, resultTheme, resultIcs, resultIsAssos, resultThemes] = await Promise.all([
          RandomUtils.fetchData(PATH_ASSO),
          RandomUtils.fetchData(PATH_CALENDAR + day),
          RandomUtils.fetchData(API_URL + "/api/get_user_theme"),
          RandomUtils.fetchData(API_URL + "/api/get_ics_url"),
          RandomUtils.fetchData(API_URL + "/api/is_association"),
          RandomUtils.fetchData(API_URL + "/api/get_themes")
        ]);

        document.getElementById("root").setAttribute("data-theme", resultTheme.data);
        setDataAsso(resultAsso.data || []);
        setDataAgenda(resultAgenda.data || []);
        if (resultIsAssos.data !== undefined) setIsAssos(resultIsAssos.data);
        if (resultThemes.data) setAllThemes(resultThemes.data);
        if (resultTheme.data) setUserTheme(resultTheme.data);
        if (resultIcs.data) setIcsLink(resultIcs.data);

        if (resultAsso.error) {
          setStatusMessage(resultAsso.error);
          raiseErrorFlag(true);
        } else if (resultAgenda.error) {
          setStatusMessage(resultAgenda.error);
          raiseErrorFlag(true);
        } else if (resultTheme.error) {
          setStatusMessage(resultTheme.error);
          raiseErrorFlag(true);
        }
      } catch (error) {
        setStatusMessage("Error loading main data");
        raiseErrorFlag(true);
      } finally {
        setLoading(false);
      }
    };

    loadMainData();
  }, [shouldUpdate, day, props.page, CONFIG, updateCounter]); // Ajout de updateCounter dans les dépendances

  // Chargement des TDs séparément
  useEffect(() => {
    const loadAllTds = async () => {
      if (!CONFIG || !shouldUpdate) return;
      if (props.page !== "home") return;

      setLoadingTds(true);
      try {
        const url = API_URL + "/api/get_tds/all?format=json";
        const result = await RandomUtils.fetchData(url);

        if (result.data) {
          setTds(result.data.departments); // departments object from backend
        }
      } catch (error) {
        console.error("Error loading TDs:", error);
      } finally {
        setLoadingTds(false);
        setUpdate(false); // Reset shouldUpdate APRÈS avoir chargé les TDs
      }
    };

    loadAllTds();
  }, [shouldUpdate, day, props.page, CONFIG, updateCounter]); // Ajout de updateCounter ici aussi

  if (loading && (dataAsso.length == 0 || dataAgenda.length == 0)) {
    return <Loading />;
  }

  return (
    <>
      <DataContext.Provider value={{dataAsso, dataAgenda, day, forceUpdate, tds, icsLink, isAssos, allThemes, userTheme, loadingTds}}>
          {props.children}
      </DataContext.Provider>
      {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
    </>
  );
};

export const useData = () => useContext(DataContext);