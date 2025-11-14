import { FaStar } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";

type GoalChipProps = {
  targetHours: number;
  hobbyName: string;
  handleDelete: () => void;
  color: string;
}

export function GoalChip({ targetHours, hobbyName, handleDelete, color }: GoalChipProps) {
  return (
    <div className='goals row-100 goalList goalChip'>
      <FaStar className='goalStar' size={40} style={{ color: color }} />
      <p style={{ color: color }}>At least {targetHours} hours of {hobbyName}</p>
      <div className='goals button-wrapper'>
        <button className='goals entry-plus' onClick={handleDelete}>
          <FiXCircle size={25} style={{ color: color }} />
        </button>
      </div>
    </div>
  )
}
