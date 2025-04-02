import TDSelection from '../TDSelection.jsx';
import RandomUtils from '../../js/RandomUtils.jsx';
import { useEffect, useState } from 'react';
import { API_URL, departementNames, departementYears } from '../../js/constants.jsx'
import { Loading } from '../templates.jsx'
import EventCreator from '../EventCreator.jsx';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './settings.scss'

const Settings = ({updateFunction}) => {
    const [user_tds, setUserTD] = useState(null);
    const [all_tds, setAllTD] = useState(null);
    const [view, setView] = useState("TDs");
    const [departement, setDepartement] = useState(departementNames[0])
    const [year, setYear] = useState(departementYears[departement][0])
    //const [semester, setSemester] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
            setUserTD(result.data.user_tds)
            setAllTD(result.data.department_tds)
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
    }, [departement, year]);

    if (loading) {
        return (
            <Loading />
        );
    }

    function handleSetDepartement(value){
        if (!(departementYears[value].includes(parseInt(year)))){
            setYear(departementYears[value][0])
        }
        setDepartement(value)
    }

    const DropDownSelect = ({title, items, fonction}) => {
        return (
            <div style={dropdown_style}>
                <DropdownButton id="dropdown-item-button" title={title} onSelect={(eventKey) => fonction(eventKey)} className="dropdown-select">
                    {items}
                </DropdownButton>
            </div>
        )
    }

    const DropDownYear = () => {
        let button_list = []
        for (let i = 0; i < departementYears[departement].length; i++){
            if (year == departementYears[departement][i]){
                button_list.push(
                    <Dropdown.Item key={i} eventKey={departementYears[departement][i]} as="button" active>{departementYears[departement][i]}</Dropdown.Item>
                )
            } else {
                button_list.push(
                    <Dropdown.Item key={i} eventKey={departementYears[departement][i]} as="button">{departementYears[departement][i]}</Dropdown.Item>
                )
            }
        }
        return (
            <DropDownSelect title={"Année : "+year} items={button_list} fonction={setYear}/>
        )
    }

    const DropDownDepart = () => {

        let button_list = []
        for (let i = 0; i < departementNames.length; i++){
            if (departement == departementNames[i]){
                button_list.push(
                    <Dropdown.Item key={i} eventKey={departementNames[i]} as="button" href="" active>{departementNames[i]}</Dropdown.Item>
                )
            } else {
                button_list.push(
                    <Dropdown.Item key={i} eventKey={departementNames[i]} as="button" href="">{departementNames[i]}</Dropdown.Item>
                )
            }
        }

        return (
            <DropDownSelect title={"Département : "+departement} items={button_list} fonction={handleSetDepartement}/>
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
                <div style={view_style}>
                    <Button onClick={() => {setView("TDs")}}>TD List</Button>
                    <Button onClick={() => {setView("create")}}>Create Event</Button>
                </div>
                <>{displayView(view)}</>
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