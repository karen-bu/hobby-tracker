import { useState } from "react";

// import { Autocomplete } from "@mui/material";
import { Rating } from '@mui/material';

// import { TextField } from '@mui/material';

import { FiPlusCircle } from "react-icons/fi";


export function EntryForm() {

  const [content, setContent] = useState('');
  const [isBlurred, setIsBlurred] = useState(false)

  return (

    <div>
      <form
        onFocus={() => setIsBlurred(false)}
      >
        <input
          className='hobbies input'
          name='add-new-hobby'
          type='text'
          placeholder="Add New Entry"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        {content !== '' && (
          <button className="hobbies input-plus">
            <FiPlusCircle size={25} style={{ color: '#196A95' }} />
          </button>
        )}

        {isBlurred === false && (
          <div className=''>
            <div className='calendar row-100'>
              <p>Hours Spent</p>
              <input name='hours-spent'
                onFocus={() => setIsBlurred(false)}
                onBlur={() => setIsBlurred(true)} />
            </div>
            <div className='calendar row-100'>
              <p>Progress</p>
              <Rating precision={1} />
            </div>
            <div className='calendar row-100'>
              <p>Notes</p>
              <textarea name='entry-notes'
                onFocus={() => setIsBlurred(false)}
                onBlur={() => setIsBlurred(true)} />
            </div>

          </div>
        )
        }
      </form >

    </div >

  )
}
