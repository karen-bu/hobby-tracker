import { useState, FormEvent } from "react";
import { useUser } from "./useUser";


import { Autocomplete } from "@mui/material";
import { TextField } from '@mui/material';
import { Rating } from '@mui/material';

import { FiPlusCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";


type EntryFormProps = {
  date: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}


export function EntryForm({ date, handleSubmit }: EntryFormProps) {

  const [isBlurred, setIsBlurred] = useState(true)
  const { hobbyArray } = useUser()

  const hobbies = hobbyArray.map((hobby) => hobby.hobbyName)



  return (
    <div className='calendar input-wrapper'
      onFocus={() => setIsBlurred(false)}>
      <div className='calendar form-wrapper row-100'>

        <form
          className='calendar form' onSubmit={handleSubmit} >
          <div>
            <p>Add new entry for {date}</p>
          </div>
          <Autocomplete
            sx={{ width: '100%' }}
            disablePortal
            options={hobbies}
            renderInput={(params) => <TextField {...params} label='Select Hobby' />}
            onFocus={() => setIsBlurred(false)} />

          {isBlurred === false && (

            <div className='calendar entries row-100'>
              <div className='calendar row-100'>
                <div className='calendar row-50'>
                  <p>Hours Spent</p>
                </div>
                <div className='calendar row-50'>
                  <input className='hoursSpent' name='hoursSpent'
                    onFocus={() => setIsBlurred(false)}
                  />
                </div>
              </div>
              <div className='calendar row-100'>
                <div className='calendar row-50'>
                  <p>Progress</p>
                </div>
                <div className='calendar row-50 star-rating'
                  onFocus={() => setIsBlurred(false)}>
                  <Rating precision={1} name='starRating' />
                </div>
              </div>
              <div className='calendar entries row-100'>
                <div className='calendar row-100'>
                  <p>Notes</p>
                </div>
                <div className='calendar row-100'>
                  <textarea
                    className='calendar textarea'
                    name='entryNotes'
                    onFocus={() => setIsBlurred(false)} />
                </div>
                <div className='calendar row-100'>
                  <button className='calendar entry-plus'>
                    <FiPlusCircle size={25} style={{ color: '#17456c' }} />
                  </button>
                  <button className='calendar entry-plus' onClick={() => setIsBlurred(true)}>
                    <FiXCircle size={25} style={{ color: '#17456c' }} />
                  </button>
                </div>
              </div>
            </div>
          )
          }
        </form >
      </div>
    </div >
  )
}
