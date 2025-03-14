import AllEvents from '../Events/AllEvents.jsx'
import { PATH_ASSO } from '../../js/constants.jsx'

const Associations = ({start}) => {
  return (
    <AllEvents start={start} data_path={PATH_ASSO} asso={true}/>
  )
}

export default Associations;