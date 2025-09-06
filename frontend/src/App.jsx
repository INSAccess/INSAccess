import './App.scss';
import { ConfigProvider } from './contexts/ConfigContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useState } from 'react';
import Settings from './components/Pages/Settings.jsx';
import Calendar from './components/Pages/Calendar.jsx';
import Associations from './components/Pages/Associations.jsx';
import About from './components/Pages/About.jsx';
import Friends from './components/Pages/Friends.jsx' ;
import { ErrorTemplate } from './components/Templates.jsx';
import logo from './images/Logo_INSA_blanc.svg';
import { NavBar } from './components/NavBar.jsx';

function App() {
  const [page, setPage] = useState("home");

  function currentPage(pageName) {
    switch (pageName) {
      case "home": return <Calendar/>;
      case "about": return <About />;
      case "settings": return <Settings/>;
      case "friends": return <Friends />;
      case "associations": return <Associations/>;
    }
  }

  try {
    return (
      <div className="App">
        <AuthProvider>
          <ConfigProvider>
            <DataProvider page={page}>
              <ProtectedRoute><NavBar page={page} setPage={setPage}/></ProtectedRoute>
              <ProtectedRoute>{currentPage(page)}</ProtectedRoute>
            </DataProvider>
          </ConfigProvider>
        </AuthProvider>
      </div>
    );
  } catch (e) {
    return (
      <div className="App">
        <img className="logo" src={logo}/>
        <ErrorTemplate message={e}/>
      </div>
    );
  }
}

export default App;