import TDSelection from '../TDSelection.jsx';
import AssoSelection from '../AssoSelection.jsx';
import RandomUtils from '../../utils/RandomUtils.jsx';
import { useEffect, useState, useRef } from 'react';
import { API_URL, minWidth } from '../../utils/Constants.jsx';
import EventCreator from '../EventCreator.jsx';
import DropDownCustom from '../DropDownCustom.jsx';
import './Settings.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
/**
 * Settings component, handling the theme, the TD selection, ICS link and event creation
 * @component
 * @returns {JSX.Element}
 */
const Settings = () => {
  const CONFIG = useConfig();
  const departementNames = CONFIG ? CONFIG['departementNames'] : ['STPI'];
  const departementYears = CONFIG ? CONFIG['departementYears'] : { STPI: [1] };

  const BUNDLE = useData();
  let icsLink = BUNDLE.icsLink;
  const { isAssos } = useData();
  let allThemes = BUNDLE.allThemes;
  let userTheme = BUNDLE.userTheme;
  let allLanguages = BUNDLE.allLanguages;
  let userLanguage = BUNDLE.userLanguage;
  const { tds, userAutoSync, changeAutoSync, updateUserTDs } = useData();

  const [view, setView] = useState('TDs');

  const copyButtonRef = useRef(null);
  const [currentLanguage, setLanguage] = useState(userLanguage);
  const [currentTheme, setTheme] = useState(userTheme);
  const [departement, setDepartement] = useState(departementNames[0]);
  const [year, setYear] = useState(departementYears[departement][0]);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (window.bootstrap && copyButtonRef.current) {
      //used for the copy to clipboard feature
      new window.bootstrap.Tooltip(copyButtonRef.current);
    }
  }, []);

  const handleCasAutoSyncChange = async (enabled) => {
    try {
      const response = await fetch(
        `${API_URL}/api/user/cas_autosync/${enabled}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': RandomUtils.getCSRFToken(),
          },
          mode: 'cors',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update autosync: ${response.status}`);
      }

      changeAutoSync(enabled);
    } catch (error) {
      console.error('Failed to update autosync', error);
    }
  };
  const handleSyncUsingCas = async () => {
    setSyncLoading(true);
    setSyncStatus(null);
    try {
      const response = await fetch(`${API_URL}/api/user/cas_sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': RandomUtils.getCSRFToken(),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to sync TDs: ${response.status}`);
      }

      const data = await response.json();

      if (data.synced_tds && Array.isArray(data.synced_tds)) {
        updateUserTDs(data.synced_tds);
      }

      setSyncStatus('success');
    } catch (error) {
      console.error('Failed to sync TDs', error);
      setSyncStatus('error');
    } finally {
      setSyncLoading(false);
      setTimeout(() => setSyncStatus(null), 3000); // Reset status after 3s
    }
  };

  const ThemeSwitch = () => {
    async function handleThemeChange(e) {
      try {
        const response = await fetch(API_URL + '/api/user/theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': RandomUtils.getCSRFToken(),
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(e),
        });
        setTheme(e);
        BUNDLE.changeTheme(e);
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <DropDownCustom
        items={allThemes}
        id="themes"
        title={t('ThemeDD')}
        current={currentTheme}
        handle={handleThemeChange}
      />
    );
  };

  const LanguageSwitch = () => {
    async function handleLanguageChange(e) {
      try {
        const response = await fetch(API_URL + '/api/user/language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': RandomUtils.getCSRFToken(),
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(e),
        });
        BUNDLE.changeLanguage(e);
        setLanguage(e);
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <DropDownCustom
        items={allLanguages}
        id="languages"
        title={t('LanguageDD')}
        current={currentLanguage}
        handle={handleLanguageChange}
      />
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(icsLink);

      let tooltip = window.bootstrap.Tooltip.getInstance(copyButtonRef.current);
      if (!tooltip) {
        tooltip = new window.bootstrap.Tooltip(copyButtonRef.current);
      }

      copyButtonRef.current.setAttribute('data-bs-original-title', 'Copied!');
      tooltip.show();

      setTimeout(() => {
        copyButtonRef.current.setAttribute(
          'data-bs-original-title',
          'Copy to clipboard'
        );
        tooltip.hide();
      }, 2000);
    } catch (err) {
      console.error('Copy failed : ', err);
    }
  };

  function handleSetDepartement(value) {
    if (!departementYears[value].includes(parseInt(year))) {
      setYear(departementYears[value][0]);
    }
    setDepartement(value);
  }

  const DropDownYear = () => {
    return (
      <DropDownCustom
        items={departementYears[departement]}
        current={year}
        id="dropdown-year"
        title={t('YearDD')}
        handle={setYear}
      />
    );
  };

  const DropDownDepart = () => {
    return (
      <DropDownCustom
        items={departementNames}
        current={departement}
        id="dropdown-depart"
        title={t('DepartmentDD')}
        handle={handleSetDepartement}
      />
    );
  };

  const OtherParams = () => {
    return (
      <div className="settings container-fluid">
        {/* Preferences Section */}
        <section className="settings-section subsection">
          <h3 className="section-title">{t('Preferences')}</h3>
          <div className="d-flex flex-wrap gap-3">
            <div className="setting-item">
              <ThemeSwitch id="theme" />
            </div>
            <div className="setting-item">
              <LanguageSwitch id="lng" />
            </div>
          </div>
        </section>

        {/* ICS Feed Section */}
        <section className="settings-section subsection">
          <h3 className="section-title">{t('ICSLink')}</h3>
          <p>{t('ICSText')}</p>

          <div className="copy-container">
            <input
              type="text"
              id="copyInput"
              className="copy-input"
              value={icsLink}
              readOnly
            />
            <button
              ref={copyButtonRef}
              className="btn btn-primary copy-button"
              onClick={handleCopy}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={t('CopyToClipboard')}
            >
              {t('ICSCopy')}
            </button>
          </div>
        </section>
      </div>
    );
  };

  function displayView(view) {
    switch (view) {
      case 'TDs':
        return (
          <>
            <div className="dropdown-container subsection">
              <div className="dropdown-item-wrap">
                <DropDownDepart />
              </div>
              <div className="dropdown-item-wrap">
                <DropDownYear />
              </div>
              <div className="dropdown-item-wrap">
                <div className="cas-autosync-wrapper">
                  <label className="cas-autosync">
                    <input
                      type="checkbox"
                      checked={userAutoSync}
                      onChange={(e) =>
                        handleCasAutoSyncChange(e.target.checked)
                      }
                    />
                    <span>{t('CasAutoSync')}</span>
                  </label>

                  <button
                    className={`btn btn-primary cas-sync-btn ${
                      syncStatus === 'success' ? 'btn-success' : ''
                    } ${syncStatus === 'error' ? 'btn-danger' : ''}`}
                    onClick={handleSyncUsingCas}
                    disabled={syncLoading}
                  >
                    {syncLoading
                      ? t('Syncing')
                      : syncStatus === 'success'
                      ? t('Synced')
                      : syncStatus === 'error'
                      ? t('Failed')
                      : t('SyncNow')}
                  </button>
                </div>
              </div>
            </div>

            {tds.departments[departement + year] && (
              <TDSelection
                departementTDs={
                  tds.departments[departement + year]['department_tds']
                }
                otherTDs={tds.departments[departement + year]['other_tds']}
                userTDs={tds.user_tds}
              />
            )}
          </>
        );
      case 'assos':
        return <AssoSelection />;
      case 'create':
        return <EventCreator />;
      case 'other':
        return <OtherParams />;
    }
  }

  let dimensions = RandomUtils.useWindowDimensions();

  return (
    <div className="settings">
      <div className="view">
        <Button
          className={`btn-view ${view == 'TDs' ? 'active' : ''}`}
          onClick={() => setView('TDs')}
        >
          {dimensions.width > minWidth ? t('TDList') : t('TDListShort')}
        </Button>
        <Button
          className={`btn-view ${view == 'assos' ? 'active' : ''}`}
          onClick={() => setView('assos')}
        >
          {dimensions.width > minWidth ? t('AssoList') : t('AssoListShort')}
        </Button>
        {isAssos && (
          <Button
            className={`btn-view ${view == 'create' ? 'active' : ''}`}
            onClick={() => setView('create')}
          >
            {dimensions.width > minWidth
              ? t('CreateEvent')
              : t('CreateEventShort')}
          </Button>
        )}
        <Button
          className={`btn-view ${view == 'other' ? 'active' : ''}`}
          onClick={() => setView('other')}
        >
          {t('OtherSettings')}
        </Button>
      </div>
      <>{displayView(view)}</>
    </div>
  );
};

export default Settings;
