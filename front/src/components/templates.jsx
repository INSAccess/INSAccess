import coincoin from '../images/coincoin.png'

const Error = ({ message }) => {
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

const Loading = () => {
    const style = {
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center center",
        "height":"100%"
    }
    return (
        <div style={style}>
            <img id="rotating-logo" src={coincoin} alt={'image not found'} style={{"width":"30vh", "alignSelf":"center"}}></img>
        </div>
    )
}

export { Error, Loading };