import { FormEvent } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

type FormProps = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: (string: string) => void;
};

export function HobbyForm({ handleSubmit, content, setContent }: FormProps) {


  return (
    <form onSubmit={handleSubmit}>
      <input
        className="hobbies input"
        name="hobbyName"
        type="text"
        placeholder="Add New Hobby"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      {content !== '' && (
        <button className="hobbies input-plus">
          <FiPlusCircle size={25} style={{ color: '#17456C' }} />
        </button>
      )}
    </form>
  );
}
