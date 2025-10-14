import { FormEvent } from "react";

import { HobbyForm } from "../2_Components/HobbyForm";
import { HobbyChip } from "../2_Components/HobbyChip";

export function Hobbies() {

  function testSubmit(event: FormEvent<HTMLFormElement>): void {
    event?.preventDefault()
    console.log('submitted')
  }

  return (
    <div className="content-page hobbies">
      <div className='list-wrapper'>
        <div className='hobbies row-100'>
          <h2>You have no saved hobbies to track. Add some now!</h2>
        </div>
        <div className='hobbies row-100'>
          <HobbyForm handleSubmit={testSubmit} />
        </div>
        <div className='hobbies row-100'>
          <HobbyChip label={'Drawing'} handleClick={() => console.log('clicked')} />
        </div>
      </div>
    </div>
  );
}
