import { createContext, useContext, useState, useEffect } from "react";
import Day from '../utils/Day.jsx';
import { minWidth, PATH_CALENDAR, PATH_ASSO,API_URL } from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { Loading } from '../components/Templates.jsx'

const DataContext = createContext()

export const DataProvider = (props) => {
  const [dataAsso, setDataAsso] = useState([])
  const [dataAgenda, setDataAgenda] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorAsso, setErrorAsso] = useState(null)
  const [errorAgenda, setErrorAgenda] = useState(null)
  const [shouldUpdate, setUpdate] = useState(true)

  let dimensions = RandomUtils.useWindowDimensions();

  const current_date = new Date()
  let first_day = new Day(current_date)
  let day = (minWidth < dimensions.width) ? first_day.startOfWeek().getDate() : first_day.getDate()

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
          console.error("Erreur de chargement des données", error);
        } finally {
          setLoading(false);
          setUpdate(false);
        }
      };
  
      loadData();
    }, [shouldUpdate, day, props.page]);

  if (errorAgenda){
    console.error(errorAgenda)
  }

  if (errorAsso){
    console.error(errorAsso)
  }

  if (loading) {
    return <Loading />;
  }

  return (
      <DataContext.Provider value={{dataAsso, dataAgenda, day, forceUpdate}}>
          {props.children}
      </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);