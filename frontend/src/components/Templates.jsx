import coincoin from '../images/coincoin.png'
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
            <img id="rotating-logo" src={coincoin} alt='image not found' ></img>
        </div>
    )
}

export { Error, Loading };