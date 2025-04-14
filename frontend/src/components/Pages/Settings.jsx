import TDSelection from '../TDSelection.jsx';
import RandomUtils from '../../utils/RandomUtils.jsx';
import { useEffect, useState, useRef } from 'react';
import { API_URL, departementNames, departementYears } from '../../utils/Constants.jsx'
import { Loading } from '../Templates.jsx'
import EventCreator from '../EventCreator.jsx';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './settings.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Settings = ({updateFunction}) => {
    const [user_tds, setUserTD] = useState(null);
    const [all_tds, setAllTD] = useState(null);
    const [view, setView] = useState("TDs");
    const [departement, setDepartement] = useState(departementNames[0])
    const [year, setYear] = useState(departementYears[departement][0])
    //const [semester, setSemester] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const copyButtonRef = useRef(null);
    const [icsLink, setIcsLink] = useState("Error when loading ics");


    const dropdown_style = {
        "marginLeft":"5px",
        "marginRight":"5px"
    }

    const view_style = {
        "display": "block",
        "position": "relative",
        "left": "50%",
        "transform": "translateX(-50%)"
    }

    const dropdown_container = {
        "display":"flex",
        "margin":"2%",
        "flexWrap": "wrap"
    }

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_URL+"/api/get_tds/ITI3?format=json");
          //const result = await RandomUtils.fetchData(API_URL+"/api/get_tds/"+departement+year+"?format=json");
          if (result.data){
            setUserTD(result.data.user_tds);
            setAllTD(result.data.department_tds);
          }

          const result_ics = await RandomUtils.fetchData(API_URL+"/api/get_ics_url");
          if (result_ics.data){
              setIcsLink(result_ics.data);
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

    const DropDownSelect = ({ id, title, items, fonction }) => {
        return (
            <div style={dropdown_style}>
                <DropdownButton 
                    id={id} 
                    title={title} 
                    onSelect={(eventKey) => fonction(eventKey)} 
                    className="dropdown-select"
                >
                    {items}
                </DropdownButton>
            </div>
        )
    }

    const DropDownYear = () => {
        let button_list = [];
        for (let i = 0; i < departementYears[departement].length; i++){
            button_list.push(
                <Dropdown.Item 
                    key={i} 
                    eventKey={departementYears[departement][i]} 
                    as="button"
                    active={year == departementYears[departement][i]}
                >
                    {departementYears[departement][i]}
                </Dropdown.Item>
            );
        }
        return (
            <DropDownSelect 
              id="dropdown-year" 
              title={"Année : " + year} 
              items={button_list} 
              fonction={setYear}
            />
        )
    }
    

    const DropDownDepart = () => {
        let button_list = [];
        for (let i = 0; i < departementNames.length; i++){
            button_list.push(
                <Dropdown.Item 
                    key={i} 
                    eventKey={departementNames[i]} 
                    as="button" 
                    href=""
                    active={departement == departementNames[i]}
                >
                    {departementNames[i]}
                </Dropdown.Item>
            );
        }

        return (
            <DropDownSelect 
            id="dropdown-depart" 
            title={"Département : " + departement} 
            items={button_list} 
            fonction={handleSetDepartement}
            />
        )
    }


    function displayView(view){
        switch (view){
            case "TDs" : return (
                <>
                    <div style={dropdown_container}>
                        <DropDownDepart />
                        <DropDownYear />
                    </div>
                    <TDSelection allTDs={all_tds} userTDs={user_tds} updateFunction={updateFunction}/>
                </>
            );
            case "create" : return (<EventCreator/>);
        }
    }

    if (user_tds && all_tds){
        return (
            <div>
                <h1>Settings</h1>
                <div className="main_container">
                    <div>
                        <div style={view_style}>
                            <Button onClick={() => {setView("TDs")}}>TD List</Button>
                            <Button onClick={() => {setView("create")}}>Create Event</Button>
                        </div>
                        <>{displayView(view)}</>
                    </div>

                    <div>
                        <h4>Le lien pour votre calendrier ics</h4>
                        <div className="copy-container">
                            <input type="text" id="copyInput" className="copy-input" value={icsLink} readOnly></input>
                            <button
                                    ref={copyButtonRef}
                                    className="btn btn-primary ms-2 "
                                    onClick={handleCopy}
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Copy to clipboard">
                                    Copier
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        ); 
    } else {
        return (
            <div>
                <h1>Settings</h1>
            </div>
        )
    }

}

export default Settings;