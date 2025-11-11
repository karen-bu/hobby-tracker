import * as React from 'react';
import { FormEvent, useState } from "react"
import { useUser } from "./useUser";
import { Autocomplete, TextField } from "@mui/material";

import { FiPlusCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";

export function GoalForm() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { hobbyArray } = useUser()
  const hobbies = hobbyArray.map((hobby) => hobby.hobbyName)
  const [value, setValue] = React.useState<string | null>(hobbies[0]);

  function expandGoalForm() {
    if (isExpanded) setIsExpanded(false)
    if (!isExpanded) setIsExpanded(true)
  }


  return (
    <div className='goals row-100'>
      <form className='goals-form'>
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
              />
            </div>
            <div className='goals row-100'>
              <div className='goals row-50 left'>
                <p className='p-small'>Target Hours!</p>
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
