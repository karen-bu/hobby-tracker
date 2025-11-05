
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
}

const authKey = 'hobbyHorse.auth';

type Auth = {
  user: User;
  token: string;
};


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

export async function addEntry(entry: Entry): Promise<Entry> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(entry)
  }
  const res = await fetch (`/api/auth/calendar`, req);
  if (!res.ok) throw new Error(`fetch error ${res.status}`)
    return (await res.json()) as Entry
}
