import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FormEvent } from 'react';
import { User } from '../lib';
import hobbyHorseLogo from '../assets/HobbyHorse Logo Aqua.svg';
import { AuthForm } from '../2_Components/AuthForm';
import { useUser } from '../2_Components/useUser';

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate('/');
      console.log('redirecting')
    }
  }, [user, navigate]);

  async function handleSignUpForm(event: FormEvent<HTMLFormElement>) {
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

      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }

      const user = (await res.json()) as User;
      alert(`Successfully registered ${user.username}!`);
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registring user: ${err}`);
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
            <h1 style={{ color: '#2E969A' }}>HOBBYHORSE</h1>
          </div>
          <p>"Just Horsing Around"</p>
        </div>
        <div className="authentication row-100-right">
          <Link to="/sign-in" style={{ color: '#2E969A' }}>
            <p className="p-small">Existing User? Sign In Here.</p>
          </Link>
        </div>
        <AuthForm
          handleSubmit={handleSignUpForm}
          focusColor={'#6BC188'}
          blurColor={'#2E969A'}
          buttonColor={'#6BC188'}
          buttonLabel={'Sign Up'}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
