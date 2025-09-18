import Day from '../utils/Day.jsx';
import RandomUtils from '../utils/RandomUtils.jsx';
import Alert from '@mui/material/Alert';
import { createContext, useContext, useState, useEffect } from 'react';
import { Loading } from '../components/Templates.jsx';
import { useTranslation } from 'react-i18next';
import { useConfig } from './ConfigContext.jsx';
import {
  minWidth,
  PATH_USER_CALENDAR,
  PATH_ASSO_CALENDAR,
  API_URL,
} from '../utils/Constants.jsx';

const DataContext = createContext();

/**
 * Data provider component that manages application state and data fetching
 * @param {Object} props - Component props
 * @returns {JSX.Element} Data provider with context
 */
export const DataProvider = (props) => {
  const { t, i18n } = useTranslation();

  const CONFIG = useConfig();
  const departementNames = CONFIG ? CONFIG['departementNames'] : ['STPI'];
  const departementYears = CONFIG ? CONFIG['departementYears'] : { STPI: [1] };

  const [dataAsso, setDataAsso] = useState([]);
  const [dataAgenda, setDataAgenda] = useState([]);
  const [dataFriend, setDataFriend] = useState([]);
  const [isAssos, setIsAssos] = useState(false);
  const [assoName, setAssoName] = useState(null);
  const [colorsAsso, setColorsAsso] = useState([]);
  const [colorsAgenda, setColorsAgenda] = useState([]);
  const [colorsFriend, setColorsFriend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorFlag, raiseErrorFlag] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [icsLink, setIcsLink] = useState(t('messages.loadError')); // Updated translation key
  const [allLanguages, setAllLanguages] = useState(null);
  const [userLanguage, setUserLanguage] = useState(null);
  const [allThemes, setAllThemes] = useState(null);
  const [userTheme, setUserTheme] = useState(null);
  const [userProfile, setProfile] = useState(null);
  const [tds, setTds] = useState({});
  const [userAssos, setUserAssos] = useState([]);
  const [userList, setUserList] = useState([]);
  const [assoList, setAssoList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [receivedList, setReceivedList] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentFriend, setCurrentFriend] = useState('');
  const [userAutoSync, setUserAutoSync] = useState(false);
  const [departement, setDepartement] = useState(departementNames[0]);
  const [year, setYear] = useState(departementYears[departement][0]);

  // Updated day list with new translation keys
  const dayList = [
    t('date.days.sunday'),
    t('date.days.monday'),
    t('date.days.tuesday'),
    t('date.days.wednesday'),
    t('date.days.thursday'),
    t('date.days.friday'),
    t('date.days.saturday'),
  ];
  
  let dimensions = RandomUtils.useWindowDimensions();
  const currentDate = new Date();
  let firstDay = new Day(currentDate);
  const [day, setDay] = useState(
    minWidth < dimensions.width ? firstDay.startOfWeek(dayList) : firstDay
  );

  function changeTheme(theme) {
    setUserTheme(theme);
  }

  function changeLanguage(lang) {
    setUserLanguage(lang);
  }

  function changeAutoSync(enabled) {
    setUserAutoSync(enabled);
  }

  const updateUserTDs = (newTds) => {
    window.scrollTo(0, 0);
    setTds((prev) => ({
      ...prev,
      user_tds: newTds,
    }));
  };

  const updateUserAssos = (newAssos) => {
    window.scrollTo(0, 0);
    setAssoList((prev) => {
      const combined = [...prev, ...newAssos];
      return [...new Set(combined)];
    });
  };

  const refreshAssoCalendar = async () => {
    try {
      const resultAsso = await RandomUtils.fetchData(PATH_ASSO_CALENDAR);
      if (resultAsso?.data) {
        setDataAsso(resultAsso.data.events);
        setColorsAsso(resultAsso.data.colors);
      }
    } catch (err) {
      console.error('Failed to refresh asso calendar', err);
    }
  };

  const refreshUserCalendar = async () => {
    try {
      const resultAgenda = await RandomUtils.fetchData(PATH_USER_CALENDAR);
      if (resultAgenda?.data) {
        setDataAgenda(resultAgenda.data.events);
        setColorsAgenda(resultAgenda.data.colors);
      }
    } catch (err) {
      console.error('Failed to refresh user calendar', err);
    }
  };

  useEffect(() => {
    if (userTheme) {
      document.getElementById('root').setAttribute('data-theme', userTheme);
    }
  }, [userTheme]);

  useEffect(() => {
    if (userLanguage) {
      i18n.changeLanguage(userLanguage);
    }
  }, [userLanguage]);
  
  useEffect(() => {
    const loadMainData = async () => {
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
          resultAssociations,
          resultTds,
        ] = await Promise.all([
          RandomUtils.fetchData(PATH_ASSO_CALENDAR),
          RandomUtils.fetchData(PATH_USER_CALENDAR),
          RandomUtils.fetchData(API_URL + '/api/metadata/themes'),
          RandomUtils.fetchData(API_URL + '/api/user/profile'),
          RandomUtils.fetchData(API_URL + '/api/metadata/languages'),
          RandomUtils.fetchData(API_URL + '/api/metadata/users'),
          RandomUtils.fetchData(API_URL + '/api/user/friends'),
          RandomUtils.fetchData(API_URL + '/api/metadata/associations'),
          RandomUtils.fetchData(
            API_URL + '/api/metadata/td_groups/all?format=json'
          ),
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
          setIsAssos(profileData.is_asso);
          setAssoName(profileData.asso);
          setUserAutoSync(profileData.cas_autosync);
        }

        if (resultAssociations.data) {
          setUserAssos(resultAssociations.data.user_associations);
          setAssoList(resultAssociations.data.all_associations);
        }

        if (resultUsers.data) setUserList(resultUsers.data);

        if (resultFriends.data) {
          const friendsData = resultFriends.data;
          setFriendsList(friendsData.friends || []);
          setPendingList(friendsData.sent || []);
          setReceivedList(friendsData.received || []);
        }

        if (resultTds.data) {
          setTds({
            departments: resultTds.data.departments,
            user_tds: resultTds.data.user_tds,
          });
        }
      } catch (error) {
        setStatusMessage(t('messages.loadError') + ' : ' + error); // Updated translation key
        raiseErrorFlag(true);
      } finally {
        setLoading(false);
      }
    };
    loadMainData();
  }, []);

  if (loading && (dataAsso.length == 0 || dataAgenda.length == 0)) {
    return <Loading />;
  }

  return (
    <>
      <DataContext.Provider
        value={{
          isAssos,
          assoName,
          dataAsso,
          dataAgenda,
          day,
          setDay,
          changeTheme,
          changeLanguage,
          tds,
          icsLink,
          allThemes,
          userTheme,
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
          colorsFriend,
          setColorsAsso,
          setColorsAgenda,
          setColorsFriend,
          currentFriend,
          setCurrentFriend,
          userAssos,
          assoList,
          refreshAssoCalendar,
          refreshUserCalendar,
          userAutoSync,
          changeAutoSync,
          updateUserTDs,
          updateUserAssos,
          departement, 
          setDepartement,
          year, 
          setYear,
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