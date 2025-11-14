import { GoalForm } from "../2_Components/GoalForm";
import { GoalChip } from "../2_Components/GoalChip";
import { useUser } from "../2_Components/useUser";
import { Goal, deleteGoal } from "../lib";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Goals() {
  const { user, goalArray, setGoalArray } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  async function handleDeleteGoal(goal: Goal) {
    try {
      const deletedGoalIndex = goalArray.findIndex(
        (obj) => obj.goalId === goal.goalId
      )
      const newGoalArray = [...goalArray];
      newGoalArray.splice(deletedGoalIndex, 1)
      setGoalArray(newGoalArray)
      if (goal.goalId) deleteGoal(goal.goalId)
    } catch (err) {
      console.error(err)
      alert(`Error deleting goal for ${goal.hobbyName}`)
    }
  }

  const goals = goalArray.map((goal: Goal) => {
    if (!goal.actualHours || goal.actualHours < goal.targetHours) {
      return (<div key={goal.goalId} >
        <GoalChip handleDelete={() => handleDeleteGoal(goal)}
          targetHours={goal.targetHours} hobbyName={goal.hobbyName} color={'#d9d9d9'} />
      </div>)
    } else if (goal.actualHours < goal.targetHours) {
      return (<div key={goal.goalId} >
        <GoalChip handleDelete={() => handleDeleteGoal(goal)}
          targetHours={goal.targetHours} hobbyName={goal.hobbyName} color={'#d9d9d9'} />
      </div>)
    } else
      return (<div key={goal.goalId} >
        <GoalChip handleDelete={() => handleDeleteGoal(goal)}
          targetHours={goal.targetHours} hobbyName={goal.hobbyName} color={'#17456c'} />
      </div>)
  }
  )

  return (
    <div className="content-page goals">
      <div className='goals entry-wrapper'>
        <div className='goals row-100'>
          <h1>Weekly Goals</h1>
        </div>
        <div className='goalChip-wrapper'>
          {goals}
        </div>
        <div className='goals row-100'>
          <GoalForm />
        </div>
      </div>
    </div>
  );
}
