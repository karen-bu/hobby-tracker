import { GoalForm } from "../2_Components/GoalForm";

export function Goals() {
  return (
    <div className="content-page goals">
      <div className='goals entry-wrapper'>
        <div className='goals row-100'>
          <h1>Weekly Goals</h1>
        </div>
        <div className='goals row-100'>
          <GoalForm />
        </div>
      </div>
    </div>
  );
}
