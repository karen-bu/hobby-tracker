import { useNavigate, Outlet } from "react-router-dom"
import { useState } from "react";
import { FormEvent } from "react";
import { User } from '../lib'

import hobbyHorseLogo from '../assets/HobbyHorse Logo Aqua.svg';
import { AuthForm } from "../2_Components/AuthForm";


export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();


  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setIsLoading(true)
      const formData = new FormData(event.currentTarget)
      const userData = Object.fromEntries(formData)
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }

      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`)
      }

      const user = (await res.json()) as User;
      alert(`Successfully registered ${user.username}!`)
      navigate('/sign-in')
    }
    catch (err) {
      alert(`Error registring user: ${err}`)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='authentication-page'>
      <div>
        <div>
          <img src={hobbyHorseLogo} alt='HobbyHorse Logo' />
          <h1>HOBBYHORSE</h1>
          <p>"Just Horsing Around"</p>
        </div>
        <div className='authentication row-100-right'>
          <p className='p-small'>Existing User? Sign In Here.</p>
        </div>
        <AuthForm handleSubmit={handleSignUp}
          focusColor={'#6BC188'} blurColor={'#2E969A'}
          isLoading={isLoading}
        />
      </div>
      <Outlet />
    </div >
  )
}
