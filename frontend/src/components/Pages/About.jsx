import duck from '../../images/duck.png'
import './About.scss'
import { useTranslation } from 'react-i18next';
import RandomUtils from "../../utils/RandomUtils";
import { minWidth } from "../../utils/Constants";

const MainAbout = () => {

    const { t } = useTranslation();

    let dimensions = RandomUtils.useWindowDimensions();

    return (
        <section className="py-3 py-md-5">
            <div className="container">
                <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
                    {(minWidth >= dimensions.width) ? <></> : <div className="col-12 col-lg-6 col-xl-5">
                        <img className="img-fluid rounded" loading="lazy" src={duck} alt={t("ImageLoadingError")}></img>
                    </div>}
                    <div className="col-12 col-lg-6 col-xl-7">
                        <div className="row justify-content-xl-center">
                            <div className="col-12 col-xl-11">
                                <h2 className="mb-3">{t('AboutTitle')}</h2>
                                <p className="mb-5">{t('AboutContent')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * License component
 * @component
 * @returns {JSX.Element}
 */
const License = () => {
    return (
        <p id="license">
            <a href="https://github.com/INSAccess/INSAccess" property="dct:title" rel="cc:attributionURL">INSAccess</a> by
            <span property="cc:attributionName">&nbsp;Raphaël Senellart and Jules Galhardo&nbsp;</span>
            is licensed under&nbsp;
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style={{ display: "inline-block" }} >
                CC BY-NC-SA 4.0
                <img style={{ height: "22px", marginLeft: "3px", verticalAlign: "text-bottom" }} src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt="" />
                <img style={{ height: "22px", marginLeft: "3px", verticalAlign: "text-bottom" }} src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt="" />
                <img style={{ height: "22px", marginLeft: "3px", verticalAlign: "text-bottom" }} src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt="" />
                <img style={{ height: "22px", marginLeft: "3px", verticalAlign: "text-bottom" }} src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt="" />
            </a>
        </p>
    )
}

/**
 * Component to display the about page and the licence of the website
 * @component
 * @returns {JSX.Element}
 */
const About = () => {
    return (
        <div className='maincontainer'>
            <MainAbout />
            <License />
        </div>

    )
}

export default About;