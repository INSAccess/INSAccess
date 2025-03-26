import './App.scss';
import NavBar from './components/NavBar.jsx'
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState, useEffect } from 'react';
import Settings from './components/Pages/settings.jsx';
import Calendar from './components/Pages/calendar.jsx';
import Associations from './components/Pages/associations.jsx';
import About from './components/Pages/about.jsx';
import Day from './js/Day.jsx';
import { minWidth, items, PATH_CALENDAR, PATH_ASSO } from './js/constants.jsx';
import RandomUtils from './js/RandomUtils.jsx';
import { Loading } from './components/templates.jsx'

function App() {

  const [page, setPage] = useState("home");
  const [dataAsso, setDataAsso] = useState(null);
  const [dataAgenda, setDataAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorAsso, setErrorAsso] = useState(null);
  const [errorAgenda, setErrorAgenda] = useState(null);

  let burger="menu"
  let dimensions = RandomUtils.useWindowDimensions();

  const current_date = new Date()
  let first_day = new Day(current_date)
  let day = (minWidth < dimensions.width) ? first_day.getDate() : first_day.startOfWeek().getDate()

  useEffect(() => {
    const loadData = async () => {
      const resultAsso = await RandomUtils.fetchData(PATH_ASSO);
      const resultAgenda = await RandomUtils.fetchData(PATH_CALENDAR+day);
      setDataAsso(resultAsso.data);
      setDataAgenda(resultAgenda.data);
      setErrorAgenda(resultAgenda.error);
      setErrorAsso(resultAsso.error);
      setLoading(false);
    };

    loadData();
  }, []);

  if (errorAgenda){
    console.error(errorAgenda)
    setDataAgenda([])
  }

  if (errorAsso){
    console.error(errorAsso)
    setDataAsso([])
  }

  if (loading) {
    return <Loading />;
  }

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

  function currentPage(pageName, day){
    switch (pageName){
      case "home" : return <Calendar start={day} data={dataAgenda}/>;
      case "about" : return <About />;
      case "settings" : return <Settings />;
      case "associations" : return <Associations start={day} data={dataAsso}/>;
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
