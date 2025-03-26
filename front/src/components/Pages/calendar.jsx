import AllEvents from '../Events/AllEvents.jsx'

const Calendar = ({start, data}) => {

  return (
    <AllEvents start={start} data={data} asso={false}/>
  )
}

export default Calendar;