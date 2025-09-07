import { createContext, useContext, useState, useEffect } from 'react';
import Day from '../utils/Day.jsx';
import {
  minWidth,
  PATH_USER_CALENDAR,
  PATH_ASSO_CALENDAR,
  API_URL,
} from '../utils/Constants.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import { Loading } from '../components/Templates.jsx';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { useConfig } from './ConfigContext.jsx';

const DataContext = createContext();

/**
 * Data provider component that manages application state and data fetching
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.page - Current page identifier
 * @returns {JSX.Element} Data provider with context
 */
export const DataProvider = (props) => {
  const CONFIG = useConfig();

  const { t, i18n } = useTranslation();

  const [dataAsso, setDataAsso] = useState([]);
  const [dataAgenda, setDataAgenda] = useState([]);
  const [dataFriend, setDataFriend] = useState([]);
  const [colorsAsso, setColorsAsso] = useState([]);
  const [colorsAgenda, setColorsAgenda] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTds, setLoadingTds] = useState(false);
  const [shouldUpdate, setUpdate] = useState(true);
  const [errorFlag, raiseErrorFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [icsLink, setIcsLink] = useState(t('LoadError'));
  const [allLanguages, setAllLanguages] = useState(null);
  const [userLanguage, setUserLanguage] = useState(null);
  const [allThemes, setAllThemes] = useState(null);
  const [userTheme, setUserTheme] = useState(null);
  const [userProfile, setProfile] = useState(null);
  const [tds, setTds] = useState({});
  const [updateCounter, setUpdateCounter] = useState(0);
  const [userList, setUserList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const dayList = [
    t('Sunday'),
    t('Monday'),
    t('Tuesday'),
    t('Wednesday'),
    t('Thursday'),
    t('Friday'),
    t('Saturday'),
  ];
  let dimensions = RandomUtils.useWindowDimensions();
  const currentDate = new Date();
  let firstDay = new Day(currentDate);
  const [day, setDay] = useState(
    minWidth < dimensions.width
      ? firstDay.startOfWeek(dayList).getDate()
      : firstDay.getDate()
  );

  function forceUpdate() {
    setUpdate(true);
    setUpdateCounter((prev) => prev + 1);
  }

  function changeTheme(theme) {
    setUserTheme(theme);
  }

  function changeLanguage(lang) {
    setUserLanguage(lang);
  }

  useEffect(() => {
    if (userLanguage) {
      i18n.changeLanguage(userLanguage);
    }
  }, [userLanguage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMainData = async () => {
      if (!shouldUpdate) return;
      if (props.page !== 'home') return;
      if (!CONFIG) return;
      setLoading(true);
      try {
        const [
          resultAsso,
          resultAgenda,
          resultThemes,
          resultProfile,
          resultLanguages,
          resultUsers,
          resultFriends,
        ] = await Promise.all([
          RandomUtils.fetchData(PATH_ASSO_CALENDAR),
          RandomUtils.fetchData(PATH_USER_CALENDAR),
          RandomUtils.fetchData(API_URL + '/api/metadata/themes'),
          RandomUtils.fetchData(API_URL + '/api/get_profile'),
          RandomUtils.fetchData(API_URL + '/api/metadata/languages'),
          RandomUtils.fetchData(API_URL + '/api/users/'),
          RandomUtils.fetchData(API_URL + '/api/friends/'),
        ]);

        if (resultAsso.data) {
          setDataAsso(resultAsso.data.events);
          setColorsAsso(resultAsso.data.colors);
        }
        if (resultAgenda.data) {
          setDataAgenda(resultAgenda.data.events);
          setColorsAgenda(resultAgenda.data.colors);
        }
        if (resultThemes.data) setAllThemes(resultThemes.data);
        if (resultLanguages.data) setAllLanguages(resultLanguages.data);
        if (resultProfile.data) {
          const profileData = resultProfile.data;
          setProfile({
            username: profileData.username,
            displayName: profileData.displayName,
          });
          setUserTheme(profileData.theme);
          setUserLanguage(profileData.language);
          setIcsLink(profileData.ics_url);
        }

        if (resultUsers.data) {
          setUserList(resultUsers.data);
        }

        if (resultFriends.data) {
          const friendsData = resultFriends.data;
          setFriendsList(friendsData.friends || []);
          setPendingList(friendsData.sent || []);
          setReceivedList(friendsData.received || []);
        }
      } catch (error) {
        setStatusMessage(t('LoadError') + ' : ' + error);
        raiseErrorFlag(true);
      } finally {
        setLoading(false);
      }
    };
    loadMainData();
  }, [shouldUpdate, day, props.page, CONFIG, updateCounter]);

  useEffect(() => {
    const loadAllTds = async () => {
      if (!CONFIG || !shouldUpdate) return;
      if (props.page !== 'home') return;

      setLoadingTds(true);
      try {
        const url = API_URL + '/api/metadata/td_groups/all?format=json';
        const result = await RandomUtils.fetchData(url);

        if (result.data)
          setTds({
            departments: result.data.departments,
            user_tds: result.data.user_tds,
          });
      } catch (error) {
        console.error(t('LoadError') + ' : ' + error);
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
      <DataContext.Provider
        value={{
          dataAsso,
          dataAgenda,
          day,
          setDay,
          forceUpdate,
          changeTheme,
          changeLanguage,
          tds,
          icsLink,
          allThemes,
          userTheme,
          loadingTds,
          userProfile,
          allLanguages,
          userLanguage,
          userList,
          friendsList,
          setFriendsList,
          pendingList,
          setPendingList,
          receivedList,
          setReceivedList,
          dataFriend,
          setDataFriend,
          showCalendar,
          setShowCalendar,
          colorsAsso,
          colorsAgenda,
          setColorsAsso,
          setColorsAgenda,
        }}
      >
        {props.children}
      </DataContext.Provider>
      {errorFlag && (
        <Alert
          severity="error"
          variant="filled"
          onClose={() => {
            raiseErrorFlag(false);
          }}
        >
          {statusMessage}
        </Alert>
      )}
    </>
  );
};

/**
 * Custom hook to access data context
 * @returns {Object} Data context value
 */
export const useData = () => useContext(DataContext);
