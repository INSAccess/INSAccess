import TDSelection from '../TDSelection.jsx';
import RandomUtils from '../../utils/RandomUtils.jsx';
import { useEffect, useState, useRef } from 'react';
import { API_URL, API_LOGOUT, minWidth, LANGUAGES } from '../../utils/Constants.jsx'
import { Loading } from '../Templates.jsx'
import EventCreator from '../EventCreator.jsx';
import Button from 'react-bootstrap/Button';
import DropDownCustom from '../DropDownCustom.jsx'
import './Settings.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useConfig } from '../../contexts/ConfigContext.jsx'
import { useTranslation } from 'react-i18next';

/**
 * Settings component, handling the theme, the TD selection, ICS link and event creation
 * @component
 * @returns {JSX.Element} 
 */
const Settings = () => {

    const CONFIG = useConfig()
    const departementNames = CONFIG ? CONFIG["departementNames"] : ["STPI"]
    const departementYears = CONFIG ? CONFIG["departementYears"] : {"STPI":[1]}  

    const [userTds, setUserTD] = useState(null);
    const [departementTds, setDepartTD] = useState(null);
    const [otherTds, setOtherTD] = useState(null);
    const [view, setView] = useState("TDs");
    const [departement, setDepartement] = useState(departementNames[0])
    const [year, setYear] = useState(departementYears[departement][0])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const copyButtonRef = useRef(null);
    const [icsLink, setIcsLink] = useState("Error when loading ics");
    const [isAssos, setIsAssos] = useState(false);
    const [currentTheme, setTheme] = useState("")
    const [allThemes, setAllThemes] = useState(null)
    const [language, setLanguage] = useState("fr")

    const { t, i18n } = useTranslation();

    const handleSetLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/get_tds/"+departement+year+"?format=json");
          if (result.data){
            setUserTD(result.data.user_tds);
            setDepartTD(result.data.department_tds);
            setOtherTD(result.data.other_tds);
          }

          const resultIcs = await RandomUtils.fetchData(API_URL+"/api/get_ics_url");
          if (resultIcs.data){
              setIcsLink(resultIcs.data);
          }

          const result_isAssos = await RandomUtils.fetchData(API_URL+"/api/is_association");
          if (result_isAssos.data){
            setIsAssos(result_isAssos.data);
          }

          const resultThemes = await RandomUtils.fetchData(API_URL+"/api/get_themes")
          if (resultThemes.data){
            setAllThemes(resultThemes.data)
          }

          const resultUserTheme = await RandomUtils.fetchData(API_URL+"/api/get_user_theme")
          if (resultUserTheme.data){
            setTheme(resultUserTheme.data)
          }

          setError(result.error);
          setLoading(false);
        };


        if (error){
            console.error("Erreur lors du fetch des TDs")
            setUserTD([])
            setDepartTD([])
            setOtherTD([])
        }

    
        loadData();

        if (window.bootstrap && copyButtonRef.current) { //used for the copy to clipboard feature
            new window.bootstrap.Tooltip(copyButtonRef.current);
        }
    }, [departement, year]);


    // Switch between dark, light or system theme 
    const ThemeSwitch = () => {

        async function handleThemeChange(e){
            document.getElementById("root").setAttribute("data-theme",e);
            setTheme(e);
            //post theme on backend
            try {
                const response = await fetch(API_URL+"/api/post_theme", {
                    method:'POST',
                    headers:{'Content-Type':'application/json', 'X-CSRFToken':RandomUtils.getCSRFToken()},
                    mode:'cors',
                    credentials:'include',
                    body:JSON.stringify(e)
                  });
            } catch (error) {
                console.error(error)
            }
        }
    
        return (
            <DropDownCustom items={allThemes} id="themes" title={t('ThemeDD')} current={currentTheme} handle={handleThemeChange}/>
        )
    }

    const handleLogout = () => {
        window.location.replace(API_LOGOUT)
    }

    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(icsLink);
        
          // Get the tooltip instance (or create it if needed)
          let tooltip = window.bootstrap.Tooltip.getInstance(copyButtonRef.current);
          if (!tooltip) {
              tooltip = new window.bootstrap.Tooltip(copyButtonRef.current);
          }
        
          // Update the tooltip text by changing the attribute
          copyButtonRef.current.setAttribute("data-bs-original-title", "Copied!");
          tooltip.show();
        
          // Reset the tooltip text after 2 seconds
          setTimeout(() => {
            copyButtonRef.current.setAttribute("data-bs-original-title", "Copy to clipboard");
            tooltip.hide();
          }, 2000);
        
        } catch (err) {
          console.error("Copy failed : ", err);
        }
      };

    function handleSetDepartement(value){
        if (!(departementYears[value].includes(parseInt(year)))){
            setYear(departementYears[value][0])
        }
        setDepartement(value)
    }

    const DropDownYear = () => {
        return (
            <DropDownCustom items={departementYears[departement]} current={year} id="dropdown-year" title={t('YearDD')} handle={setYear}/>
        ) 
    }

    const DropDownDepart = () => {
        return (
            <DropDownCustom items={departementNames} current={departement} id="dropdown-depart" title={t('DepartmentDD')} handle={handleSetDepartement}/>
        )
    }

    const DropDownLng = () => {
        return (
            <DropDownCustom items={LANGUAGES} id="languages" title={t('LanguageDD')} current={language} handle={handleSetLanguage}/>
        )
    }

    const OtherParams = () => {
        return (
            <>
                <div className="margin2">
                    <h4>{t('ICSLink')}</h4>
                    <p>{t('ICSText')}</p>
                </div>
                <div className="copy-container">
                    <input type="text" id="copyInput" className="copy-input" value={icsLink} readOnly></input>
                    <button
                            ref={copyButtonRef}
                            className="btn btn-primary copy-button"
                            style={{margin:"4px"}}
                            onClick={handleCopy}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Copy to clipboard">
                            {t('ICSCopy')}
                    </button>
                </div>
                <div className="selectContainer">
                    <div className="margin2">
                        <h4>{t('ThemeChange')}</h4>
                        <ThemeSwitch />
                    </div>
                    <div className="margin2">
                        <h4>{t('LanguageChange')}</h4>
                        <DropDownLng />
                    </div>
                </div>
                <div class="logout">
                    <button className="btn btn-primary" onClick={handleLogout}>
                        {t('Logout')}
                    </button>
                </div>
            </>
        )
    }


    function displayView(view){
        switch (view){
            case "TDs" : return (
                <>
                    <div className="dropdown_container">
                        <DropDownDepart />
                        <DropDownYear />
                    </div>
                    {departementTds && otherTds && userTds && <TDSelection departementTDs={departementTds} otherTDs={otherTds} userTDs={userTds}/>}
                </>
            );
            case "create" : return (<EventCreator/>);
            case "autre": return <OtherParams />
        }
    }

    let dimensions = RandomUtils.useWindowDimensions()

    if (loading){
        return <Loading />
    }

    return (
        <div className="settings">
            <div className="view">
                <Button className="btn_view" style={{"flex":(view == "TDs") ? "2" : "1"}} onClick={() => {setView("TDs")}}>{(dimensions.width > minWidth) ? t('TDList') : t('TDListShort')}</Button>
                {isAssos && (
                <Button
                    className="btn_view"
                    style={{ flex: view === "create" ? "2" : "1" }}
                    onClick={() => setView("create")}
                >
                    {dimensions.width > minWidth ? t('CreateEvent') : t('CreateEventShort')}
                </Button>)}
                <Button className="btn_view" style={{"flex":(view == "autre") ? "2" : "1"}} onClick={() => {setView("autre")}}>{t('OtherSettings')}</Button>
            </div>
            <>{displayView(view)}</>
        </div>
    ); 

}

export default Settings;