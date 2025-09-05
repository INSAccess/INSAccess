import duck from '../images/duck.png'
import "./Templates.scss"
import { useTranslation } from 'react-i18next';

/**
 * Custom Error handling component
 * @component
 * @returns {JSX.Element} 
 */
const ErrorTemplate = ({ message }) => {
    console.error(message)
    return (
        <div>
            <p>There has been an error</p>
        </div>
    );
}

/**
 * Custom Loading component
 * @component
 * @returns {JSX.Element} 
 */
const Loading = () => {
    return (
        <div className='loadingBackground'>
            <img id="rotating-logo" src={duck} alt='image not found' ></img>
        </div>
    )
}

/**
 * Custom WIP component
 * @component
 * @returns {JSX.Element}
 */
const WorkInProgressTemplate = () => {

    const { t } = useTranslation();

    return (
    <div className="WIP">
        <h1>{t('WIP')}</h1>
    </div>
    )
}

export { ErrorTemplate, Loading, WorkInProgressTemplate };