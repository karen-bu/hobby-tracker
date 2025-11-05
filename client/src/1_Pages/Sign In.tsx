import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../lib';
import { useUser } from '../2_Components/useUser';
import { AuthForm } from '../2_Components/AuthForm';

import hobbyHorseLogo from '../assets/HobbyHorse Logo Green.svg';

type AuthData = {
  user: User;
  token: string;
};

export function SignInPage() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  async function handleSignInForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };

      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }

      const { user, token } = (await res.json()) as AuthData;
      handleSignIn(user, token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="authentication-page">
      <div>
        <div>
          <div className="authentication row-100">
            <img src={hobbyHorseLogo} alt="HobbyHorse Logo" />
          </div>
          <div>
            <h1 style={{ color: '#6BC188' }}>HOBBYHORSE</h1>
          </div>
          <p>"Just Horsing Around"</p>
        </div>
        <div className="authentication row-100-right">
          <Link to="/sign-up" style={{ color: '#8FD481' }}>
            <p className="p-small">New User? Sign Up Here.</p>
          </Link>
        </div>
        <AuthForm
          handleSubmit={handleSignInForm}
          focusColor={'#8FD481'}
          blurColor={'#D4EA87'}
          buttonColor={'#ACE081'}
          buttonLabel={'Sign In'}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
