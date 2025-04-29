import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import './index.scss';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

//GET THEME FETCH THEN change className of root

root.render(
    <BrowserRouter>
        <AuthProvider>
            <ProtectedRoute>{<App />}</ProtectedRoute>
        </AuthProvider>
    </BrowserRouter>
);