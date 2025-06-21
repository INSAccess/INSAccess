import './App.scss';
import NavBar from './components/NavBar.jsx'
import { ConfigProvider } from './contexts/ConfigContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState } from 'react';
import Settings from './components/Pages/Settings.jsx';
import Calendar from './components/Pages/Calendar.jsx';
import Associations from './components/Pages/Associations.jsx';
import About from './components/Pages/About.jsx';
import { ErrorTemplate, WorkInProgressTemplate } from './components/Templates.jsx'
import logo from './images/Logo_INSA_blanc.svg'
import './utils/Dictionnary'
import { useTranslation } from 'react-i18next';

function App() {

  const { t, i18n } = useTranslation();
  const [page, setPage] = useState("home")

  const items = [
    {
      name: t("Calendar"),
      color: "#777777",
      href: "home" },
    
    {
      name: t("Events"),
      color: "#666666",
      href: "associations" },
    
    {
      name: t("Settings"),
      color: "#555555",
      href: "settings" },
    
    {
        name: t("Friends"),
        color: "#444444",
        href: "friends" },
    
    {
      name: t("About"),
      color: "#333333",
      href: "about" }
  ];

  let burger="menu"

  var isFolded = true;

  function unfold() {
    isFolded = false;
    var menu = document.getElementsByClassName(burger)
    for (let i = 0; i < menu.length; i++) {
      menu.item(i).classList.add("visible")
    }
  }
  
  function fold() {
    isFolded = true;
    var menu = document.getElementsByClassName(burger)
    for (let i = 0; i < menu.length; i++) {
      menu.item(i).classList.remove("visible")
    }
  }

  function foldToggle() {
    if (isFolded){
      unfold();
    }
    else {
      fold();
    }
  }

  function currentPage(pageName){
    switch (pageName){
      case "home" : return <Calendar/>;
      case "about" : return <About />;
      case "settings" : return <Settings/>;
      case "friends" : return <WorkInProgressTemplate />;
      case "associations" : return <Associations/>;
    }
  }

  try {
    return (
        <div className="App">
          <img className="logo" src={logo}/>
          <div id="backmenu" className={burger} onClick={fold}></div>
          <NavBar setPage={setPage} items={items}/>
          <div className="fold" id="folder" onClick={foldToggle}>☰</div>
            <AuthProvider><ConfigProvider><DataProvider page={page}>
                <ProtectedRoute>{currentPage(page)}</ProtectedRoute>
            </DataProvider></ConfigProvider></AuthProvider>
        </div>
    );
  } catch (e){
    return (
    <div className="App">
      <img className="logo" src={logo}/>
      <ErrorTemplate message={e}/>
    </div>
    )
  }
}

export default App;
