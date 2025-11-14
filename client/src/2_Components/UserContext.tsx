import { ReactNode, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, saveAuth, removeAuth, readToken, readUser, fetchGoals } from '../lib';
import { Goal, Hobby, fetchHobbies, Entry, getEntryByDate } from '../lib';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
  hobbyArray: Hobby[];
  setHobbyArray: (hobbyArray: Hobby[]) => void;
  date: PickerValue;
  entryArray: Entry[];
  setEntryArray: (entryArray: Entry[]) => void;
  setDate: (date: PickerValue) => void;
  goalArray: Goal[],
  setGoalArray: (goalArray: Goal[]) => void;
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
  setHobbyArray: () => useState<Hobby[]>([]),
  date: dayjs(),
  entryArray: [],
  setEntryArray: () => useState<Entry[]>([]),
  setDate: () => useState<PickerValue>(dayjs()),
  goalArray: [],
  setGoalArray: () => useState<Goal[]>([])

});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [hobbyArray, setHobbyArray] = useState<Hobby[]>([])
  const [date, setDate] = useState<PickerValue>(dayjs());
  const [entryArray, setEntryArray] = useState<Entry[]>([])
  const [goalArray, setGoalArray] = useState<Goal[]>([])


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

  useEffect(() => {
    if (!date) return;
    let mounted = true;
    (async () => {
      try {
        const entryArray = await getEntryByDate(date);
        if (mounted) setEntryArray(entryArray);
      } catch (error) {
        console.error(error);
      }
    }
    )
      ();
    return () => {
      mounted = false;
    };
  }, [date]);

  useEffect(() => {
    async function getGoals() {
      try {
        const newGoalArray = await fetchGoals();
        setGoalArray(newGoalArray)
      }
      catch (err) {
        alert(`Error fetching goals: ${err}`)
      }
    }
    if (user) {
      getGoals();
    }
  }, [user]
  )

  const contextValues = { user, token, hobbyArray, setHobbyArray, handleSignIn, handleSignOut, date, entryArray, setEntryArray, setDate, goalArray, setGoalArray };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
}
