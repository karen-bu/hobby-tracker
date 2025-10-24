import { useState } from "react";

import { Autocomplete } from "@mui/material";
import { TextField } from '@mui/material';
import { Rating } from '@mui/material';

import { FiPlusCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";



export function EntryForm() {

  const [isBlurred, setIsBlurred] = useState(true)
  const hobbies = ['Drawing', 'Hockey', 'Learning Russian', 'Reading', 'Causing Chaos']

  return (
    <div className='calendar input-wrapper'
      onFocus={() => setIsBlurred(false)}>
      <div className='calendar form-wrapper row-100'>
        <form
          className='calendar form' >
          <Autocomplete
            sx={{ width: '100%' }}
            disablePortal
            options={hobbies}
            renderInput={(params) => <TextField {...params} label='Add New Entry' />}
            onFocus={() => setIsBlurred(false)} />

          {isBlurred === false && (

            <div className='calendar entries row-100'>
              <div className='calendar row-100'>
                <div className='calendar row-50'>
                  <p>Hours Spent</p>
                </div>
                <div className='calendar row-50'>
                  <input name='hours-spent'
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
                  <Rating precision={1} />
                </div>
              </div>
              <div className='calendar entries row-100'>
                <div className='calendar row-100'>
                  <p>Notes</p>
                </div>
                <div className='calendar row-100'>
                  <textarea
                    className='calendar textarea'
                    name='entry-notes'
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
