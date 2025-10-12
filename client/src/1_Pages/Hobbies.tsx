import { HobbyForm } from "../2_Components/HobbyForm";

export function Hobbies() {

  function testClick(event: Event): void {
    event?.preventDefault()
    console.log('clicked')
  }

  return (
    <div className="content-page hobbies">
      <div className='list-wrapper'>
        <div className='hobbies row-100'>
          <h2>You have no saved hobbies to track. Add some now!</h2>
        </div>
        <div className='hobbies row-100'>
          <HobbyForm handleSubmit={testClick} />
        </div>
      </div>
    </div>
  );
}
