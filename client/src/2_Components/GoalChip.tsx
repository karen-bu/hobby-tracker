import { FaStar } from "react-icons/fa";
import { FiX, FiXCircle } from "react-icons/fi";

type GoalChipProps = {
  targetHours: number;
  hobbyName: string;
  handleDelete: () => void;
}

export function GoalChip({ targetHours, hobbyName, handleDelete }: GoalChipProps) {
  return (
    <div className='goals row-100 goalList'>
      <FaStar className='goalStar' size={40} />
      <p>At least {targetHours} hours of {hobbyName}</p>
      <div className='goals button-wrapper'>
        <button className='goals entry-plus' onClick={handleDelete}>
          <FiXCircle size={25} />
        </button>
      </div>


    </div>
  )
}
