import { useTranslation } from 'react-i18next';
import '../utils/Dictionnary.jsx';
import { useState } from 'react';
import './NavBar.scss';
import { API_LOGOUT } from '../utils/Constants.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { CustomDatePicker } from './DatePicker.jsx'

export const NavBar = ({ page, setPage }) => {
  const BUNDLE = useData();

  const { t } = useTranslation();
  const items = [
    { name: t('Calendar'), href: 'home' },
    { name: t('Events'), href: 'associations' },
    { name: t('Friends'), href: 'friends' },
    { name: t('Settings'), href: 'settings' },
    { name: t('Help'), href: 'help' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.replace(API_LOGOUT);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (href) => {
    setPage(href);
    closeMenu();
  };

  const displayName = BUNDLE?.userProfile?.displayName || '';

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary custom-navbar d-none d-lg-block">
        <div className="container-fluid">
          <div className="navbar-left">
            <div className="logo-insa"></div>

            <div className="navbar-nav">
              {items.map((item) => (
                <a
                  key={item.href}
                  className={`nav-link ${page === item.href ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(item.href);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="navbar-right">
            <CustomDatePicker isMobile={false}/>
            <div id="welcome">
              {t('Welcome') + ' ' + displayName}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </div>
            <button
              id="logout"
              className="btn btn-primary"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                ></path>
                <path
                  fillRule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <button
        className="custom-burger d-lg-none"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span>☰</span>
      </button>

      <div className={`mobile-sidebar ${isMenuOpen ? 'show' : ''}`}>
        <div className="mobile-backdrop" onClick={closeMenu}></div>
        <div className="sidebar-content">
          <ul className="navbar-nav">
            <li className="nav-item welcome-mobile">
              <div id="welcome-mobile">
                {t('Welcome') + ' ' + displayName}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
              </div>
            </li>
            {items.map((item) => (
              <li key={item.href} className="nav-item">
                <a
                  className={`nav-link ${page === item.href ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <button
                id="logout-mobile"
                className="btn btn-primary"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-box-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                  ></path>
                  <path
                    fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  ></path>
                </svg>
                {t('Logout')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
