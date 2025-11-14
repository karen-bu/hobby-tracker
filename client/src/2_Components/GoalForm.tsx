import * as React from 'react';
import { FormEvent, useState } from "react"
import { useUser } from "./useUser";

import { Autocomplete, TextField } from "@mui/material";

import { FiPlusCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";

import { addGoal, Goal } from '../lib';

export function GoalForm() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { hobbyArray, goalArray, setGoalArray } = useUser()
  const hobbies = hobbyArray.map((hobby) => hobby.hobbyName)
  const goalHobbies = goalArray.map((goal) => goal.hobbyName)
  const [value, setValue] = React.useState<string | null>(hobbies[0]);

  function expandGoalForm() {
    if (isExpanded) setIsExpanded(false)
    if (!isExpanded) setIsExpanded(true)
  }

  async function handleGoalFormSubmit(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    try {
      const foundHobby = hobbyArray.find((obj) => obj.hobbyName === value)
      const formData = new FormData(event.currentTarget)
      const newGoal = Object.fromEntries(formData.entries()) as unknown as Goal
      if (value) newGoal.hobbyName = value
      if (foundHobby) newGoal.hobbyId = foundHobby?.hobbyId
      const addedGoal = await addGoal(newGoal)
      setGoalArray([...goalArray, addedGoal])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='goals form-wrapper'>
      <form className='goals form' onSubmit={handleGoalFormSubmit}>
        <div className='goals row-100' onClick={expandGoalForm}>
          <p className='p-small'>Add New Weekly Goal</p>
        </div>
        {isExpanded && (
          <div className='goals-form-pt2'>
            <div className='goals row-100'>
              <Autocomplete
                className='goals-autoComplete'
                sx={{ width: '100%' }}
                disablePortal
                options={hobbies}
                renderInput={(params) => <TextField {...params} label='Select Hobby' />}
                value={value || null}
                onChange={(event: any, newValue: string | null) => setValue(newValue)}
                getOptionDisabled={(option) => goalHobbies.includes(option)}
              />
            </div>
            <div className='goals row-100'>
              <div className='goals row-50 left'>
                <p className='p-small'>Target Hours</p>
              </div>
              <div className='goals row-50 right'>
                <input className='targetHours' type='text' name='targetHours'></input>
              </div>
            </div>
            <div className='goals row-100 right'>
              <button className="goals entry-plus">
                <FiPlusCircle size={25} style={{ color: '#17456c' }} />
              </button>
              <button className="goals entry-plus" onClick={expandGoalForm}>
                <FiXCircle size={25} style={{ color: '#17456c' }} />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
