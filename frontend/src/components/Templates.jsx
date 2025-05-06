import duck from '../images/duck.png'
import "./Templates.scss"

const ErrorTemplate = ({ message }) => {
    console.error(message)
    return (
        <div>
            <p>Il y a eu une erreur</p>
        </div>
    );
}

const Loading = () => {
    return (
        <div className='loadingBackground'>
            <img id="rotating-logo" src={duck} alt='image not found' ></img>
        </div>
    )
}

export { ErrorTemplate, Loading };