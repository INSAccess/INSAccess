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

  const { t, i18n } = useTranslation();

  const [dataAsso, setDataAsso] = useState([]);
  const [dataAgenda, setDataAgenda] = useState([]);
  const [dataFriend, setDataFriend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTds, setLoadingTds] = useState(false);
  const [shouldUpdate, setUpdate] = useState(true);
  const [errorFlag, raiseErrorFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [icsLink, setIcsLink] = useState(t("LoadError"));
  const [isAssos, setIsAssos] = useState(false);
  const [assoName, setAssoName] = useState(null);
  const [allLanguages, setAllLanguages] = useState(null);
  const [userLanguage, setUserLanguage] = useState(null);
  const [allThemes, setAllThemes] = useState(null);
  const [userTheme, setUserTheme] = useState(null);
  const [userProfile, setProfile] = useState(null);
  const [tds, setTds] = useState({});
  const [updateCounter, setUpdateCounter] = useState(0);
  const [userList, setUserList] = useState(["tes", "alice", "bob", "dav", "carole"]);
  const [friendsList, setFriendsList] = useState(["alice", "bob"]);
  const [pendingList, setPendingList] = useState(["dav"]);
  const [receivedList, setReceivedList] = useState(["tes"]);

  const dayList = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
  let dimensions = RandomUtils.useWindowDimensions();
  const currentDate = new Date();
  let firstDay = new Day(currentDate);
  const [day, setDay] = useState((minWidth < dimensions.width) ? firstDay.startOfWeek(dayList).getDate() : firstDay.getDate());

  function forceUpdate() {
    setUpdate(true);
    setUpdateCounter(prev => prev + 1);
  }

  function changeTheme(theme) {
    setUserTheme(theme)
  }

  function changeLanguage(lang) {
    setUserLanguage(lang)
  }

  useEffect(() => {
    if (userLanguage) {
      i18n.changeLanguage(userLanguage);
    }
  }, [userLanguage]);

  // Chargement des données principales (agenda, asso, thème, etc.)
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMainData = async () => {
      if (!shouldUpdate) return;
      if (props.page !== "home") return;
      if (!CONFIG) return;
      setLoading(true);
      try {
        const [
          resultAsso,
          resultAgenda,
          resultTheme,
          resultIcs,
          resultIsAssos,
          resultThemes,
          resultProfile,
          resultLanguages,
          resultLanguage,
          resultUsers,
          resultFriends,
        ] = await Promise.all([
          RandomUtils.fetchData(PATH_ASSO),
          RandomUtils.fetchData(PATH_CALENDAR + day),
          RandomUtils.fetchData(API_URL + "/api/get_user_theme"),
          RandomUtils.fetchData(API_URL + "/api/get_ics_url"),
          RandomUtils.fetchData(API_URL + "/api/is_association"),
          RandomUtils.fetchData(API_URL + "/api/get_themes"),
          RandomUtils.fetchData(API_URL + "/api/get_profile"),
          RandomUtils.fetchData(API_URL + "/api/get_languages"),
          RandomUtils.fetchData(API_URL + "/api/get_user_language"),
          RandomUtils.fetchData(API_URL + "/api/users"),
          RandomUtils.fetchData(API_URL + "/api/friends"),
        ]);
  
        // Gestion des données existantes...
        document.getElementById("root").setAttribute("data-theme", resultTheme.data);
        if (resultAsso.data) setDataAsso(resultAsso.data);
        if (resultAgenda.data) setDataAgenda(resultAgenda.data);
        if (resultThemes.data) setAllThemes(resultThemes.data);
        if (resultTheme.data) setUserTheme(resultTheme.data);
        if (resultIcs.data) setIcsLink(resultIcs.data);
        if (resultProfile.data) setProfile(resultProfile.data);
        if (resultLanguages.data) setAllLanguages(resultLanguages.data);
        if (resultLanguage.data) setUserLanguage(resultLanguage.data);
        if (resultIsAssos.data) {
          setIsAssos(resultIsAssos.data.is_asso);
          setAssoName(resultIsAssos.data.asso);
        }
  
        // Gestion de userList
        if (resultUsers.data) {
          setUserList(resultUsers.data);
        }
  
        // Gestion des amis/pendings/received
        if (resultFriends.data) {
          const friendsData = resultFriends.data;
          setFriendsList(friendsData.friends || []);
          setPendingList(friendsData.sent || []);
          setReceivedList(friendsData.received || []);
        }
  
      } catch (error) {
        setStatusMessage(t("LoadError") + " : " + error);
        raiseErrorFlag(true);
      } finally {
        setLoading(false);
      }
    };
    loadMainData();
  }, [shouldUpdate, day, props.page, CONFIG, updateCounter]);

  // Chargement des TDs séparément
  useEffect(() => {
    const loadAllTds = async () => {
      if (!CONFIG || !shouldUpdate) return;
      if (props.page !== "home") return;

      setLoadingTds(true);
      try {
        const url = API_URL + "/api/get_tds/all?format=json";
        const result = await RandomUtils.fetchData(url);

        if (result.data) setTds({departments: result.data.departments, user_tds:result.data.user_tds});

      } catch (error) {
        console.error(t("LoadError") + " : " + error);
      } finally {
        setLoadingTds(false);
        setUpdate(false);
      }
    };

    loadAllTds();
  }, [shouldUpdate, props.page, CONFIG, updateCounter]);

  if (loading && (dataAsso.length == 0 || dataAgenda.length == 0)) {
    return <Loading />;
  }

  return (
    <>
      <DataContext.Provider value={{dataAsso, dataAgenda, day, setDay, forceUpdate, changeTheme, changeLanguage, tds, icsLink, isAssos,
         allThemes, userTheme, loadingTds, userProfile, allLanguages, userLanguage, assoName, userList, friendsList, setFriendsList, pendingList, 
         setPendingList, receivedList, setReceivedList, dataFriend, setDataFriend}}>
          {props.children}
      </DataContext.Provider>
      {errorFlag && <Alert severity="error" variant="filled" onClose={() => {raiseErrorFlag(false)}}>{statusMessage}</Alert>}
    </>
  );
};

export const useData = () => useContext(DataContext);