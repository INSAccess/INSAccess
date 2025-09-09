import duck from '../../images/duck.png';
import { useTranslation } from 'react-i18next';
import RandomUtils from '../../utils/RandomUtils';
import { minWidth } from '../../utils/Constants';
import './About.scss';

const MainAbout = () => {
  const { t } = useTranslation();

  let dimensions = RandomUtils.useWindowDimensions();

  return (
    <section className="about-section py-3 py-md-5">
      <div className="container">
        <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
          {minWidth >= dimensions.width ? (
            <></>
          ) : (
            <div className="col-12 col-lg-6 col-xl-5 about-image">
              <img
                className="img-fluid rounded"
                loading="lazy"
                src={duck}
                alt={t('ImageLoadingError')}
              />
            </div>
          )}
          <div className="col-12 col-lg-6 col-xl-7">
            <div className="row justify-content-xl-center">
              <div className="col-12 col-xl-11 about-content">
                <h2 className="mb-3">{t('AboutTitle')}</h2>
                <p className="mb-5">{t('AboutContent')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * FAQ Component with Bootstrap Accordion
 * @component
 * @returns {JSX.Element}
 */
const FAQ = () => {
  const { t } = useTranslation();

  const faqItems = [
    {
      id: 'faq1',
      question: t('FAQ_TdNotFound_Question'),
      answer: t('FAQ_TdNotFound_Answer')
    },
    {
      id: 'faq2',
      question: t('FAQ_AssoPublisher_Question'),
      answer: t('FAQ_AssoPublisherAnswer')
    },
    {
      id: 'faq3',
      question: t('FAQ_Webview_Question'),
      answer: t('FAQ_Webview_Answer')
    },
    {
      id: 'faq4',
      question: t('FAQ_FriendNotFound_Question'),
      answer: t('FAQ_FriendNotFound_Answer')
    },
    {
      id: 'faq5',
      question: t('FAQ_WhyDuck_Question'),
      answer: t('FAQ_WhyDuck_Answer')
    }
  ];

  return (
    <section className="py-3 py-md-5 faq-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4 text-center">{t('FAQ_Title')}</h2>
            <div className="accordion custom-accordion" id="faqAccordion">
              {faqItems.map((item, index) => (
                <div className="accordion-item custom-accordion-item" key={item.id}>
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button custom-accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${item.id}`}
                      aria-expanded={index === 0 ? 'true' : 'false'}
                      aria-controls={item.id}
                    >
                      {item.question}
                    </button>
                  </h3>
                  <div
                    id={item.id}
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body custom-accordion-body">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Manual/Guide Component with Bootstrap Cards
 * @component
 * @returns {JSX.Element}
 */
const Manual = () => {
  const { t } = useTranslation();
  const manualSections = [
    {
      id: 'choose-classes',
      title: t('Manual_ChooseClasses'),
      content: t('Manual_ChooseClassesContent'),
    },
    {
      id: 'ics',
      title: t('Manual_ICS'),
      content: t('Manual_ICSContent'),
    },
    {
      id: 'friends',
      title: t('Manual_Friends'),
      content: t('Manual_FriendsContent'),
    },
    {
      id: 'personnalize',
      title: t('Manual_Personnalize'),
      content: t('Manual_PersonnalizeContent'),
    }
  ];

  return (
    <section className="py-3 py-md-5 manual-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4 text-center">{t('Manual_Title')}</h2>
          </div>
        </div>
        <div className="row g-4">
          {manualSections.map((section) => (
            <div className="col-12 col-md-6 col-lg-4" key={section.id}>
              <div className="card h-100 custom-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <h5 className="card-title mb-0">{section.title}</h5>
                  </div>
                  <p className="card-text manual-card-text mb-3" style={{whiteSpace: "pre-wrap"}}>{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * License component
 * @component
 * @returns {JSX.Element}
 */
const License = () => {
  return (
    <div className="license-section py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p id="license" className="text-center mb-0 license-text">
              <a
                href="https://github.com/INSAccess/INSAccess"
                property="dct:title"
                rel="cc:attributionURL"
                className="license-link"
              >
                INSAccess
              </a>{' '}
              by
              <span property="cc:attributionName">
                &nbsp;Raphaël Senellart and Jules Galhardo&nbsp;
              </span>
              is licensed under&nbsp;
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                target="_blank"
                rel="license noopener noreferrer"
                style={{ display: 'inline-block' }}
                className="license-link"
              >
                CC BY-NC-SA 4.0
                <img
                  style={{
                    height: '22px',
                    marginLeft: '3px',
                    verticalAlign: 'text-bottom',
                  }}
                  src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                  alt=""
                />
                <img
                  style={{
                    height: '22px',
                    marginLeft: '3px',
                    verticalAlign: 'text-bottom',
                  }}
                  src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                  alt=""
                />
                <img
                  style={{
                    height: '22px',
                    marginLeft: '3px',
                    verticalAlign: 'text-bottom',
                  }}
                  src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
                  alt=""
                />
                <img
                  style={{
                    height: '22px',
                    marginLeft: '3px',
                    verticalAlign: 'text-bottom',
                  }}
                  src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
                  alt=""
                />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Component to display the about page, FAQ, manual, and the licence of the website
 * @component
 * @returns {JSX.Element}
 */
const About = () => {
  return (
    <div className="maincontainer">
      <FAQ />
      <Manual />
      <MainAbout />
      <License />
    </div>
  );
};

export default About;