import AllEvents from '../Events/AllEvents.jsx'

/**
 * Wrapper component for better readability (semantic)
 * @component
 * @returns {JSX.Element} 
 */
const Rooms = () => {
  return <AllEvents dataOrigin="room"/>
}

export default Rooms;