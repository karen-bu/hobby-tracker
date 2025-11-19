import { PickerValue } from '@mui/x-date-pickers/internals';

export type User = {
  userId: number;
  username: string;
};

export type Hobby = {
  hobbyId: number;
  userId: number;
  hobbyName: string;
};

export type Entry = {
  hobbyName: string;
  hoursSpent: number;
  rating: number;
  entryDate: Date;
  hobbyId: number;
  notes: string;
  entryId: number;
};

export type Goal = {
  hobbyName: string;
  hobbyId: number;
  targetHours: number;
  actualHours?: number;
  goalId?: number;
};

const authKey = 'hobbyHorse.auth';

type Auth = {
  user: User;
  token: string;
};

// Functions for user management
export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

// Function for fetching list of hobbies
export async function fetchHobbies() {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const res = await fetch('/api/auth/hobbies', req);
  if (!res.ok) {
    throw new Error(`fetch error ${res.status}`);
  }
  return (await res.json()) as Hobby[];
}

// Function for adding to list of hobbies
export async function addHobby(hobby: Hobby): Promise<Hobby> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(hobby),
  };
  const res = await fetch('/api/auth/hobbies', req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Hobby;
}

// Function for deleting from list of hobbies
export async function deleteHobby(hobbyId: number) {
  const req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/auth/hobbies/${hobbyId}`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
}

// Function for adding new journal entry on a particular date
export async function addEntry(entry: Entry): Promise<Entry> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch(`/api/auth/calendar`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry;
}

// Function for fetching journal entries on a particular date
export async function getEntryByDate(date: PickerValue): Promise<Entry[]> {
  const sentDate = { entryDate: date?.toDate() };
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(sentDate),
  };

  const res = await fetch(`/api/auth/calendar/entryByDate`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry[];
}

// Function for fetching journal entries for a particular week
export async function getEntryByWeek(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/auth/metrics/entriesThisWeek', req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry[];
}

// Function for fetching journal entries from 4 weeks ago
export async function getEntry4Weeks(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/auth/metrics/entries4Weeks', req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry[];
}

// Function for fetching journal entries from 3 weeks ago
export async function getEntry3Weeks(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/auth/metrics/entries3Weeks', req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry[];
}

// Function for fetching journal entries from 2 weeks ago
export async function getEntry2Weeks(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/auth/metrics/entries2Weeks', req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry[];
}

// Function for fetching journal entries from 2 weeks ago
export async function getEntry1Week(): Promise<Entry[]> {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch('/api/auth/metrics/entries1Week', req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry[];
}

// Function for getting total hours spent on hobbies in a week
export async function getTotalHours() {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/auth/metrics`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return await res.json();
}

// Function for deleting a journal entry
export async function deleteEntry(entryId: number) {
  const req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/auth/calendar/${entryId}`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
}

// Function for editing a journal entry
export async function editEntry(entry: Entry) {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch(`/api/auth/calendar/${entry.entryId}`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Entry;
}

// Function for getting goals
export async function fetchGoals() {
  const req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/auth/goals`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`);
  return (await res.json()) as Goal[];
}

// Function for adding a new goal
export async function addGoal(goal: Goal) {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(goal),
  };
  const res = await fetch('/api/auth/goals', req);
  if (!res.ok) throw new Error(`fetchError ${res.status}`);
  return (await res.json()) as Goal;
}

// Function for deleting a goal
export async function deleteGoal(goalId: number) {
  const req = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const res = await fetch(`/api/auth/goals/${goalId}`, req);
  if (!res.ok) throw new Error(`fetchError ${res.status}`);
}
