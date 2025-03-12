import AllEvents from '../../js/EventUtils.jsx'
import { PATH_CALENDAR } from '../../js/constants.jsx'

const Calendar = ({start}) => {
  return (
    <AllEvents start={start} data_path={PATH_CALENDAR+start}/>
  )
}

export default Calendar;