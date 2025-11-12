import { GoalForm } from "../2_Components/GoalForm";
import { GoalChip } from "../2_Components/GoalChip";

export function Goals() {
  return (
    <div className="content-page goals">
      <div className='goals entry-wrapper'>
        <div className='goals row-100'>
          <h1>Weekly Goals</h1>
        </div>
        <div>
          <GoalChip hobbyName={'Hockey'} hours={10} />
          <GoalChip hobbyName={'Gardening'} hours={30} />
        </div>
        <div className='goals row-100'>
          <GoalForm />
        </div>
      </div>
    </div>
  );
}
