import AllEvents from '../js/eventUtils.js'
import { PATH_ASSO } from '../js/constants.js'

const Associations = ({start}) => {
  return (
    <AllEvents start={start} data_path={PATH_ASSO}/>
  )
}

export default Associations;