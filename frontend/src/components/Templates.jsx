import duck from '../images/duck.png'
import "./Templates.scss"
const Error = ({ message }) => {
    return (
        <div>
            <p>{message}</p>
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

export { Error, Loading };