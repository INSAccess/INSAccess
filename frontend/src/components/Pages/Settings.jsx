import TDSelection from '../TDSelection.jsx';
import RandomUtils from '../../utils/RandomUtils.jsx';
import { useEffect, useState, useRef } from 'react';
import { API_URL, departementNames, departementYears, minWidth } from '../../utils/Constants.jsx'
import { Loading } from '../Templates.jsx'
import EventCreator from '../EventCreator.jsx';
import Button from 'react-bootstrap/Button';
import DropDownCustom from '../DropDownCustom.jsx'
import './Settings.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Settings = ({updateFunction}) => {
    const [user_tds, setUserTD] = useState(null);
    const [all_tds, setAllTD] = useState(null);
    const [view, setView] = useState("TDs");
    const [departement, setDepartement] = useState(departementNames[0])
    const [year, setYear] = useState(departementYears[departement][0])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const copyButtonRef = useRef(null);
    const [icsLink, setIcsLink] = useState("Error when loading ics");
    const [current_theme, setTheme] = useState("")
    const [all_themes, setAllThemes] = useState(null)
        

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/get_tds/"+departement+year+"?format=json");
          if (result.data){
            setUserTD(result.data.user_tds);
            setAllTD(result.data.department_tds);
          }

          const result_ics = await RandomUtils.fetchData(API_URL+"/api/get_ics_url");
          if (result_ics.data){
              setIcsLink(result_ics.data);
          }

          const result_themes = await RandomUtils.fetchData(API_URL+"/api/get_themes")
          if (result_themes.data){
            setAllThemes(result_themes.data)
          }

          const result_user_theme = await RandomUtils.fetchData(API_URL+"/api/get_user_theme")
          if (result_user_theme.data){
            setTheme(result_user_theme.data)
          }

          setError(result.error);
          setLoading(false);
        };


        if (error){
            console.error("Erreur lors du fetch des TDs")
            setUserTD([])
            setAllTD([])
        }

    
        loadData();

        if (window.bootstrap && copyButtonRef.current) { //used for the copy to clipboard feature
            new window.bootstrap.Tooltip(copyButtonRef.current);
        }
    }, [departement, year]);

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
            <DropDownCustom items={all_themes} id="themes" title="Theme : " current={current_theme} handle={handleThemeChange}/>
        )
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
          console.error("Copy failed:", err);
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
            <DropDownCustom items={departementYears[departement]} current={year} id="dropdown-year" title="Année : " handle={setYear}/>
        ) 
    }
    

    const DropDownDepart = () => {
        return (
            <DropDownCustom items={departementNames} current={departement} id="dropdown-depart" title="Département : " handle={handleSetDepartement}/>
        )
    }

    const OtherParams = () => {
        return (
            <>
                <div style={{"margin":"2%"}}>
                    <h4>Le lien pour votre calendrier ics</h4>
                    <p>
                        Vous pouvez copier ce lien dans Google Agenda pour visualiser vos cours et vos événements personnels
                        dans le même agenda
                    </p>
                </div>
                <div className="copy-container">
                    <input type="text" id="copyInput" className="copy-input" value={icsLink} readOnly></input>
                    <button
                            ref={copyButtonRef}
                            className="btn btn-primary"
                            style={{margin:"4px"}}
                            onClick={handleCopy}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Copy to clipboard">
                            Copier
                    </button>
                </div>
                <div style={{"margin":"2%"}}>
                    <h4>Changer le theme</h4>
                </div>                
                <ThemeSwitch />
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
                    <TDSelection allTDs={all_tds} userTDs={user_tds} updateFunction={updateFunction}/>
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

    if (user_tds && all_tds){

        return (
            <div className="settings">
                <div className="view">
                    <Button className="btn_view" style={{"flex":(view == "TDs") ? "2" : "1"}} onClick={() => {setView("TDs")}}>{(dimensions.width > minWidth) ? "Liste des TD" : "TD"}</Button>
                    <Button className="btn_view" style={{"flex":(view == "create") ? "2" : "1"}} onClick={() => {setView("create")}}>{(dimensions.width > minWidth) ? "Créer un événement" : "Evénement"}</Button>
                    <Button className="btn_view" style={{"flex":(view == "autre") ? "2" : "1"}} onClick={() => {setView("autre")}}>Autre</Button>
                </div>
                <>{displayView(view)}</>
            </div>
        ); 
    } else {
        return (
            <div>
                <h1>Paramètres</h1>
            </div>
        )
    }

}

export default Settings;