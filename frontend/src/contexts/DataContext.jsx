import { createContext, useContext, useState, useEffect } from "react";
import Day from '../utils/Day.jsx';
import { minWidth, PATH_CALENDAR, PATH_ASSO,API_URL } from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { Loading } from '../components/Templates.jsx'
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

const DataContext = createContext()

export const DataProvider = (props) => {
  const [dataAsso, setDataAsso] = useState([])
  const [dataAgenda, setDataAgenda] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorAsso, setErrorAsso] = useState(null)
  const [errorAgenda, setErrorAgenda] = useState(null)
  const [shouldUpdate, setUpdate] = useState(true)
  const [errorFlag, raiseErrorFlag] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

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
        setLoading(true);

        try {
          const resultAsso = await RandomUtils.fetchData(PATH_ASSO);
          const resultAgenda = await RandomUtils.fetchData(PATH_CALENDAR + day);
          const resultTheme = await RandomUtils.fetchData(API_URL + "/api/get_user_theme");
          document.getElementById("root").setAttribute("data-theme",resultTheme.data);
          setDataAsso(resultAsso.data || []);
          setDataAgenda(resultAgenda.data || []);
          setErrorAsso(resultAsso.error);
          setErrorAgenda(resultAgenda.error);
        } catch (error) {
          setStatusMessage("Echec du chargement des données")
          raiseErrorFlag(true)
        } finally {
          setLoading(false);
          setUpdate(false);
        }
      };
  
      loadData();

      if (errorAgenda){
        setStatusMessage("Echec du chargement des cours")
        raiseErrorFlag(true)
      }
    
      if (errorAsso){
        setStatusMessage("Echec du chargement des événements")
        raiseErrorFlag(true)
      }
    }, [shouldUpdate, day, props.page]);
  
  if (loading && (dataAsso.length == 0 || dataAgenda.length == 0)) {
    return <Loading />;
  }

  return (
    <>
      <DataContext.Provider value={{dataAsso, dataAgenda, day, forceUpdate}}>
          {props.children}
      </DataContext.Provider>
      {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
    </>
  );
}

export const useData = () => useContext(DataContext);