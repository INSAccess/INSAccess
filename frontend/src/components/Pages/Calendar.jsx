import AllEvents from '../Events/AllEvents.jsx'

/**
 * Wrapper component for better readability (semantic)
 * @component
 * @returns {JSX.Element} 
 */
const Calendar = () => {
  return <AllEvents dataOrigin="user"/>
}

export default Calendar;