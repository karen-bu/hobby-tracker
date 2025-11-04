import { ReactNode, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, saveAuth, removeAuth, readToken, readUser } from '../lib';
import { Hobby, fetchHobbies } from '../lib';

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
  hobbyArray: Hobby[];
  setHobbyArray: (hobbyArray: Hobby[]) => void;
};

export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => {
    throw new Error('No UserProvider');
  },
  handleSignOut: () => {
    throw new Error('No UserProvider');
  },
  hobbyArray: [],
  setHobbyArray: () => useState<Hobby[]>([])
});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [hobbyArray, setHobbyArray] = useState<Hobby[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
  }, []);

  function handleSignIn(user: User, token: string): void {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  useEffect(() => {
    async function loadHobbies() {
      try {
        const hobbyArray = await fetchHobbies();
        setHobbyArray(hobbyArray);
      } catch (err) {
        alert(`Error fetching hobbies: ${err}`);
      }
    }
    if (user) {
      loadHobbies();
    }
  }, [user, navigate]);

  const contextValues = { user, token, hobbyArray, setHobbyArray, handleSignIn, handleSignOut };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
}
