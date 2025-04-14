import './App.scss';
import NavBar from './components/NavBar.jsx'
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState, useEffect } from 'react';
import Settings from './components/Pages/Settings.jsx';
import Calendar from './components/Pages/Calendar.jsx';
import Associations from './components/Pages/Associations.jsx';
import About from './components/Pages/About.jsx';
import Day from './utils/Day.jsx';
import { minWidth, items, PATH_CALENDAR, PATH_ASSO } from './utils/Constants.jsx';
import RandomUtils from './utils/RandomUtils.jsx';
import { Loading } from './components/Templates.jsx'
import logo from './images/insa_logo.webp'

function App() {

  const [page, setPage] = useState("home")
  const [dataAsso, setDataAsso] = useState([])
  const [dataAgenda, setDataAgenda] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorAsso, setErrorAsso] = useState(null)
  const [errorAgenda, setErrorAgenda] = useState(null)
  const [shouldUpdate, setUpdate] = useState(true)

  function forceUpdate(){
    setUpdate(true)
  }

  let burger="menu"
  let dimensions = RandomUtils.useWindowDimensions();

  const current_date = new Date()
  let first_day = new Day(current_date)
  let day = (minWidth < dimensions.width) ? first_day.startOfWeek().getDate() : first_day.getDate()


  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      if (!shouldUpdate || page != "home") return;

      setLoading(true);
      try {
        const resultAsso = await RandomUtils.fetchData(PATH_ASSO);
        const resultAgenda = await RandomUtils.fetchData(PATH_CALENDAR + day);

        setDataAsso(resultAsso.data || []);
        setDataAgenda(resultAgenda.data || []);
        setErrorAsso(resultAsso.error);
        setErrorAgenda(resultAgenda.error);
      } catch (error) {
        console.error("Erreur de chargement des données", error);
      } finally {
        setLoading(false);
        setUpdate(false);
      }
    };

    loadData();
  }, [shouldUpdate, day, page]);

  if (errorAgenda){
    console.error(errorAgenda)
  }

  if (errorAsso){
    console.error(errorAsso)
  }

  if (loading) {
    return <Loading />;
  }

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

  function currentPage(pageName, day){
    switch (pageName){
      case "home" : return <Calendar start={day} data={dataAgenda}/>;
      case "about" : return <About />;
      case "settings" : return <Settings updateFunction={forceUpdate}/>;
      case "associations" : return <Associations start={day} data={dataAsso}/>;
    }
  }


  return (
    <div className="App">
      <img className="logo" src={logo}/>
      <div id="backmenu" className={burger} onClick={fold}></div>
      <NavBar setPage={setPage} items={items}/>
      <div className="fold" id="folder" onClick={foldToggle}>☰</div>
      <AuthProvider>
          <ProtectedRoute>{currentPage(page, day)}</ProtectedRoute>
      </AuthProvider>
    </div>
  );
}

export default App;
