import TDSelection from '../TDSelection.jsx';
import RandomUtils from '../../utils/RandomUtils.jsx';
import { useEffect, useState, useRef } from 'react';
import { API_URL, minWidth, LANGUAGES } from '../../utils/Constants.jsx'
import EventCreator from '../EventCreator.jsx';
import Button from 'react-bootstrap/Button';
import DropDownCustom from '../DropDownCustom.jsx'
import './Settings.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useConfig } from '../../contexts/ConfigContext.jsx'
import { useData } from '../../contexts/DataContext.jsx'
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

    const BUNDLE = useData()
    let tds = BUNDLE.tds
    let icsLink = BUNDLE.icsLink
    let isAssos = BUNDLE.isAssos
    let allThemes = BUNDLE.allThemes
    let userTheme = BUNDLE.userTheme
    let allLanguages = BUNDLE.allLanguages
    let userLanguage = BUNDLE.userLanguage

    const [view, setView] = useState("TDs");

    const copyButtonRef = useRef(null);
    const [currentLanguage, setLanguage] = useState(userLanguage)
    const [currentTheme, setTheme] = useState(userTheme)
    const [departement, setDepartement] = useState(departementNames[0])
    const [year, setYear] = useState(departementYears[departement][0])

    const { t } = useTranslation();

    useEffect(() => {
        if (window.bootstrap && copyButtonRef.current) { //used for the copy to clipboard feature
            new window.bootstrap.Tooltip(copyButtonRef.current);
        }
    }, []);


    // Switch between dark, light or system theme
    const ThemeSwitch = () => {

        async function handleThemeChange(e){
            //post theme on backend
            try {
                const response = await fetch(API_URL+"/api/post_user_theme", {
                    method:'POST',
                    headers:{'Content-Type':'application/json', 'X-CSRFToken':RandomUtils.getCSRFToken()},
                    mode:'cors',
                    credentials:'include',
                    body:JSON.stringify(e)
                  });
                    setTheme(e);
                    document.getElementById("root").setAttribute("data-theme",e);
                    BUNDLE.changeTheme(e)
            } catch (error) {
                console.error(error)
            }
        }

        return (
            <DropDownCustom items={allThemes} id="themes" title={t('ThemeDD')} current={currentTheme} handle={handleThemeChange}/>
        )
    }

    const LanguageSwitch = () => {

        async function handleLanguageChange(e){
            //post theme on backend
            try {
                const response = await fetch(API_URL+"/api/post_user_language", {
                    method:'POST',
                    headers:{'Content-Type':'application/json', 'X-CSRFToken':RandomUtils.getCSRFToken()},
                    mode:'cors',
                    credentials:'include',
                    body:JSON.stringify(e)
                  });
                    BUNDLE.changeLanguage(e)
                    setLanguage(e);
            } catch (error) {
                console.error(error)
            }
        }

        return (
            <DropDownCustom items={allLanguages} id="languages" title={t('LanguageDD')} current={currentLanguage} handle={handleLanguageChange}/>
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

    const OtherParams = () => {
        return (
            <>
                <div className="margin2">
                    <ThemeSwitch id="theme"/>
                </div>
                <div className="margin2">
                    <LanguageSwitch id="lng"/>
                    <hr/>
                </div>
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
                    {tds.departments[departement+year] && <TDSelection departementTDs={tds.departments[departement+year]["department_tds"]} otherTDs={tds.departments[departement+year]["other_tds"]} userTDs={tds.user_tds}/>}
                </>
            );
            case "create" : return (<EventCreator/>);
            case "autre": return <OtherParams />
        }
    }

    let dimensions = RandomUtils.useWindowDimensions()

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