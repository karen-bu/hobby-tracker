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
    'Video Games',
    'Cooking',
    'Watching Youtube',
    'Reading',
    'Wine Tasting',
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
    'Video Games',
    'Cooking',
    'Watching Youtube',
    'Reading',
    'Wine Tasting',
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
    'Video Games',
    'Cooking',
    'Watching Youtube',
    'Reading',
    'Wine Tasting',
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
    'Video Games',
    'Cooking',
    'Watching Youtube',
    'Reading',
    'Wine Tasting',
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
    'Video Games',
    'Cooking',
    'Watching Youtube',
    'Reading',
    'Wine Tasting',
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
    'Video Games',
    'Cooking',
    'Watching Youtube',
    'Reading',
    'Wine Tasting',
    'Blah!',
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
      <div className="list-wrapper">
        <div className="hobbies row-100">
          <h2>You have no saved hobbies to track. Add some now!</h2>
        </div>
        <div className="hobbies row-100">
          <HobbyForm handleSubmit={testSubmit} />
        </div>

        {hobbyList}
      </div>
    </div>
  );
}
