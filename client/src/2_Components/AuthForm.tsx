import { FiEye } from 'react-icons/fi';
import { FiEyeOff } from 'react-icons/fi';

import { useState } from 'react';
import { FormEvent } from 'react';

type AuthFormProps = {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  focusColor: string;
  blurColor: string;
  buttonColor: string;
  buttonLabel: string;
  isLoading: boolean;
};

export function AuthForm({
  handleSubmit,
  focusColor,
  blurColor,
  buttonColor,
  buttonLabel,
  isLoading,
}: AuthFormProps) {
  const [content, setContent] = useState('');
  const [inputType, setInputType] = useState('password');
  const [usernameFocus, setUsernameFocus] = useState(blurColor);
  const [passwordFocus, setPasswordFocus] = useState(blurColor);

  function showHidePassword() {
    if (inputType === 'password') {
      setInputType('text');
    } else if (inputType === 'text') {
      setInputType('password');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="authentication row-100">
        <input
          className="authentication input"
          required
          type="text"
          name="username"
          placeholder="Username"
          onFocus={() => setUsernameFocus(focusColor)}
          onBlur={() => setUsernameFocus(blurColor)}
          style={{
            border: 'solid 2px',
            borderColor: `${usernameFocus}`,
            outline: `${usernameFocus}`,
          }}
        />
      </div>

      <div className="authentication row-password">
        <input
          className="authentication input password"
          required
          type={inputType}
          name="password"
          placeholder="Password"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onFocus={() => setPasswordFocus(focusColor)}
          onBlur={() => setPasswordFocus(blurColor)}
          style={{
            border: 'solid 2px',
            borderColor: `${passwordFocus}`,
            outline: `${passwordFocus}`,
          }}></input>
        {content && (
          <button
            className="authentication button"
            type="button"
            onClick={showHidePassword}>
            {inputType === 'password' ? (
              <FiEye size={20} style={{ color: passwordFocus }} />
            ) : (
              <FiEyeOff size={20} style={{ color: passwordFocus }} />
            )}
          </button>
        )}
      </div>

      <div className="authentication row-100-right">
        <button
          className="authentication sign-up"
          style={{ backgroundColor: buttonColor }}
          disabled={isLoading}>
          <p className="p-button">{buttonLabel}</p>
        </button>
      </div>
    </form>
  );
}
