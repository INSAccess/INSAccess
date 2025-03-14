import './css/App.css';
import NavBar from './components/NavBar.jsx'
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState } from 'react';
import Settings from './components/Pages/settings.jsx';
import Calendar from './components/Pages/calendar.jsx';
import Associations from './components/Pages/associations.jsx';
import About from './components/Pages/about.jsx';
import Day from './js/Day.jsx';
import { minWidth, items } from './js/constants.jsx';
import RandomUtils from './js/RandomUtils.jsx';

function App() {
  let burger="menu"
  const current_date = new Date()
  let first_day = new Day(current_date)
  let dimensions = RandomUtils.useWindowDimensions();

  let day = (minWidth < dimensions.width) ? first_day.getDate() : first_day.startOfWeek().getDate()
  
  const [page, setPage] = useState("home")
  
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
      case "home" : return <Calendar start={day} data_path={data}/>;
      case "about" : return <About />;
      case "settings" : return <Settings />;
      case "associations" : return <Associations start={day} data_path={data_asso}/>;
    }
  }

  return (
    <div className="App">
      <div id="backmenu" className={burger} onClick={fold}></div>
      <NavBar setPage={setPage} items={items}/>
      <div className="fold" id="folder" onClick={unfold}>Menu</div>
      <AuthProvider>
          <ProtectedRoute>{currentPage(page, day)}</ProtectedRoute>
      </AuthProvider>
    </div>
  );
}

export default App;
