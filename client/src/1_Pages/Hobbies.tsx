import { FormEvent } from 'react';

import { HobbyForm } from '../2_Components/HobbyForm';
import { HobbyChip } from '../2_Components/HobbyChip';

export function Hobbies() {
  const hobbyArray: string[] = [
    'Drawing',
    'Writing',
    'Guitar',
    'Hockey',
    'Birdwatching',
    'Snakecharming',
    'Causing Mayhem',
    'Causing Chaos',
    'Drag Racing',
    'Gardening',
  ];

  const hobbyList = hobbyArray.map((hobby, index) => (
    <div className="hobbies chip-wrapper">
      <HobbyChip
        label={hobby}
        handleClick={() => console.log('clicked')}
        index={index}
      />
    </div>
  ));

  function testSubmit(event: FormEvent<HTMLFormElement>): void {
    event?.preventDefault();
    console.log('submitted!');
  }

  return (
    <div className="content-page hobbies">
      <div>
        <div className="hobbies input-wrapper">
          <HobbyForm handleSubmit={testSubmit} />
        </div>
        <div className="hobbies text-wrapper">
          <p className='p-heading'>You have no saved hobbies to track. Add some now!</p>
        </div>
        {hobbyList}
      </div>
    </div>
  );
}
