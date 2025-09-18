import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ReactDOM from 'react-dom/client';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import App from './App.jsx';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <ProtectedRoute>{<App />}</ProtectedRoute>
    </AuthProvider>
  </BrowserRouter>
);
