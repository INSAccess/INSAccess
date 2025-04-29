import coincoin from '../../images/coincoin.png'
import './About.scss'

const MainAbout = () => {
    return (
        <section className="py-3 py-md-5">
        <div className="container">
            <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
            <div className="col-12 col-lg-6 col-xl-5">
                <img className="img-fluid rounded" loading="lazy" src={coincoin} alt="A pu coincoin"></img>
            </div>
            <div className="col-12 col-lg-6 col-xl-7">
                <div className="row justify-content-xl-center">
                <div className="col-12 col-xl-11">
                    <h2 className="mb-3">Qui sommes nous ?</h2>
                    <p className="lead fs-4 text-secondary mb-3 text">On est deux étudiants d'ITI 3, un peu tarés sur les bords, motivés pour faire des projets utiles aux étudiants </p>
                    <p className="mb-5">Ce projet a pour ambition de faciliter l'accès des étudiants aux cours et aux événements culturels de l'INSA. Tout au long de son développement,
                                         nous avons bénéficié du soutien précieux de nombreuses personnes.
                                          Nous tenons particulièrement à remercier Michel Vespier pour ses conseils techniques avisés concernant l'interface du site,
                                           ainsi que l'INSA pour son soutien constant et pour avoir valorisé ce projet.</p>
                    <div className="row gy-4 gy-md-0 gx-xxl-5X">
                    <div className="col-12 col-md-6">
                        <div className="d-flex">
                        <div className="me-4 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" className="bi bi-database-fill" viewBox="0 0 16 16">
                        <path d="M3.904 1.777C4.978 1.289 6.427 1 8 1s3.022.289 4.096.777C13.125 2.245 14 2.993 14 4s-.875 1.755-1.904 2.223C11.022 6.711 9.573 7 8 7s-3.022-.289-4.096-.777C2.875 5.755 2 5.007 2 4s.875-1.755 1.904-2.223"/>
                        <path d="M2 6.161V7c0 1.007.875 1.755 1.904 2.223C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777C13.125 8.755 14 8.007 14 7v-.839c-.457.432-1.004.751-1.49.972C11.278 7.693 9.682 8 8 8s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972"/>
                        <path d="M2 9.161V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13s3.022-.289 4.096-.777C13.125 11.755 14 11.007 14 10v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972"/>
                        <path d="M2 12.161V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13v-.839c-.457.432-1.004.751-1.49.972-1.232.56-2.828.867-4.51.867s-3.278-.307-4.51-.867c-.486-.22-1.033-.54-1.49-.972"/>
                        </svg>
                        </div>
                        <div>
                            <h2 className="h4 mb-3">Direction des services informatiques</h2>
                            <p className="text-secondary mb-0">Pendant toute la mise en production du site, la DSI nous a aidé et conseillé sur des points techniques. L'utilisation du CAS et l'hébergement sur le domaine de l'INSA sont aussi grâce à la DSI, et en particulier M. Bonnegent et M. Vasseur.</p>
                        </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="d-flex">
                        <div className="me-4 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" className="bi bi-fire" viewBox="0 0 16 16">
                            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="h4 mb-3">Service Culture et Vie Etudiante</h2>
                            <p className="text-secondary mb-0">Tous les événements des associations sont ajoutés sur le site par le Service Culture, qui font déjà énormément de boulot pour valoriser les engagements associatifs des étudiants les plus motivés. Donc merci beaucoup à Anne Caldin et Marion Beaudesson et désolé pour les heures supp ^^</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}

const License = () => {
    return (
        <p>
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

const About = () => {
    return (
        <div className='maincontainer'>
            <MainAbout />
            <License />
        </div>

    )
}

export default About;