import './css/App.css';
import { NavBar } from './js/navbar.js'
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from 'react';
import Settings from './components/settings.js';
import Calendar from './components/calendar.js';
import About from './components/about.js';
import Day from './js/dateUtils.js';
import constants from './js/constants.js';
import { useWindowDimensions } from './js/randomUtils.js';

function App() {
  let burger="menu"
  const current_date = new Date()
  let first_day = new Day(current_date)
  let dimensions = useWindowDimensions();

  const data = constants.API_URL+'/api/get_year/'+first_day.getDate();
  const data_asso = 'http://localhost:3000/data_asso.json'

  let day = (constants.minWidth < dimensions.width) ? first_day.getDate() : first_day.startOfWeek().getDate()
  
  let [page, setPage] = useState("")
  
  function unfold() {
    var menu = document.getElementsByClassName(burger)
    for (let i = 0; i < menu.length; i++) {
      menu.item(i).classList.add("visible")
    }
  }
  
  function fold() {
    var menu = document.getElementsByClassName(burger)
    for (let i = 0; i < menu.length; i++) {
      menu.item(i).classList.remove("visible")
    }

  }

  function currentPage(pageName, day, data, data_asso){
    switch (pageName){
      case "home" || "" : return <Calendar start={day} data_path={data}/>;
      case "about" : return <About />;
      case "settings" : return <Settings />;
      case "associations" : return <Calendar start={day} data_path={data_asso}/>;
      default: return <Calendar start={day} data_path={data}/>;
    }
  }

    return (
      <div className="App">
        <div id="backmenu" className={burger} onClick={fold}></div>
        <NavBar setPage={setPage} items={constants.items}/>
        <div className="fold" id="folder" onClick={unfold}>Menu</div>
        <AuthProvider>
            <ProtectedRoute>{currentPage(page, day, data, data_asso)}</ProtectedRoute>
        </AuthProvider>
      </div>
    );
}

export default App;
