import { FaStar } from "react-icons/fa";
import { FiX, FiXCircle } from "react-icons/fi";

type GoalChipProps = {
  hours: number;
  hobbyName: string;
}

export function GoalChip({ hours, hobbyName }: GoalChipProps) {
  return (
    <div className='goals row-100 goalList'>
      <FaStar className='goalStar' size={40} />
      <p>At least {hours} hours of {hobbyName}</p>
      <div className='goals button-wrapper'>
        <button className='goals entry-plus'>
          <FiXCircle size={25} />
        </button>
      </div>


    </div>
  )
}
