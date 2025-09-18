import { ConfigProvider } from './contexts/ConfigContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { ErrorTemplate } from './components/Templates.jsx';
import { NavBar } from './components/NavBar.jsx';
import { useState } from 'react';
import Settings from './components/Pages/Settings.jsx';
import Calendar from './components/Pages/Calendar.jsx';
import Associations from './components/Pages/Associations.jsx';
import Help from './components/Pages/Help.jsx';
import Friends from './components/Pages/Friends.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.scss';

function App() {
  const [page, setPage] = useState('home');

  function currentPage(pageName) {
    switch (pageName) {
      case 'home':
        return <Calendar />;
      case 'help':
        return <Help />;
      case 'settings':
        return <Settings />;
      case 'friends':
        return <Friends />;
      case 'associations':
        return <Associations />;
    }
  }

  try {
    return (
      <div className="App">
        <ConfigProvider>
          <DataProvider page={page}>
            <ProtectedRoute>
              <NavBar page={page} setPage={setPage} />
            </ProtectedRoute>
            <ProtectedRoute>{currentPage(page)}</ProtectedRoute>
          </DataProvider>
        </ConfigProvider>
      </div>
    );
  } catch (e) {
    return (
      <div className="App">
        <ErrorTemplate message={e} />
      </div>
    );
  }
}

export default App;
