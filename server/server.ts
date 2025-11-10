/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import pg, { Client } from 'pg';
import express from 'express';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import argon2, { hash } from 'argon2';
import jwt from 'jsonwebtoken';
import { main } from './seed.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Authentication = {
  username: string;
  password: string;
};

type Hobby = {
  hobbyId: number;
  userId: number;
  hobbyName: string;
};

type Entry = {
  entryId: number;
  userId: number;
  hobbyId?: number;
  hoursSpent?: number;
  rating?: number;
  notes?: string;
  entryDate: Date;
  createdAt: Date;
};

export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));

// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found!');

// ~*~*~*~*~~*~**~*~ Path for signing up ~*~*~*~*~~*~**~*~

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'Username and password are required.');
    }
    const hashedPassword = await argon2.hash(password);
    if (!hashedPassword) {
      throw new ClientError(404, 'Password cannot be accepted.');
    }
    const sqlSignUp = `
    insert into "users" ("username", "hashedPassword")
    values ($1, $2)
    returning *
    `;

    const params = [username, hashedPassword];
    const result = await db.query(sqlSignUp, params);
    const newUser = result.rows[0];
    if (!newUser) {
      throw new ClientError(404, 'Cannot add new user.');
    }
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// ~*~*~*~*~~*~**~*~ Path for signing in ~*~*~*~*~~*~**~*~

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Authentication>;
    if (!username || !password) throw new ClientError(401, 'Invalid Login');

    const sqlSignIn = `
    select *
    from "users"
    where "username" = $1
    `;

    const params = [username];
    const result = await db.query(sqlSignIn, params);
    if (!result) throw new ClientError(401, 'Invalid Login');

    const user = result.rows[0];
    const hashKey = process.env.TOKEN_SECRET;
    if (!hashKey) throw new Error(`TOKEN_SECRET not found in .env`);

    if (!(await argon2.verify(user.hashedPassword, password))) {
      throw new ClientError(401, 'Invalid Login');
    }

    const { userId } = user;
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.status(201).json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// ~*~*~*~*~~*~**~*~ Path for getting hobbies ~*~*~*~*~~*~**~*~

app.get('/api/auth/hobbies', authMiddleware, async (req, res, next) => {
  try {
    const sqlGetHobbies = `
    select *
      from "hobbies"
      where "userId" = $1;
    `;
    const params = [req.user?.userId]
    const result = await db.query<Hobby>(sqlGetHobbies, params);
    if (!result) {
      throw new ClientError(404, 'Cannot fetch list of hobbies');
    }
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// ~*~*~*~*~~*~**~*~ Path for adding hobbies ~*~*~*~*~~*~**~*~

app.post('/api/auth/hobbies', authMiddleware, async (req, res, next) => {
  try {
    const { hobbyName } = req.body;

    const sqlNewHobby = `
    insert into "hobbies" ("userId", "hobbyName")
    values ($1, $2)
    returning *;
    `;

    const params = [req.user?.userId, hobbyName];
    const result = await db.query(sqlNewHobby, params);

    const hobbies = result.rows[0];
    if (!hobbies) {
      throw new ClientError(404, 'Unable to add new hobby.');
    }

    res.status(201).json(hobbies);
  } catch (err) {
    next(err);
  }
});

// ~*~*~*~*~~*~**~*~ Path for deleting hobbies ~*~*~*~*~~*~**~*~

app.delete('/api/auth/hobbies/:hobbyId', authMiddleware, async (req, res, next) => {
    try {
      const { hobbyId } = req.params;
      const sqlDeleteHobby = `
          delete from "hobbies"
          where "hobbyId" = $1
          and "userId" = $2
          returning *;
          `;
      const params = [hobbyId, req.user?.userId];
      const result = await db.query(sqlDeleteHobby, params);
      const deletedEntry = result.rows[0];
      if (!deletedEntry) {
        throw new ClientError(404, `Could not find hobby ${hobbyId}.`);
      }
      res.status(204).json(deletedEntry);
    } catch (err) {
      next(err);
    }
  }
);

// ~*~*~*~*~~*~**~*~ Path for adding a new entry ~*~*~*~*~~*~**~*~

app.post('/api/auth/calendar', authMiddleware, async(req, res, next) => {
  try {
    const { hobbyId, hobbyName, hoursSpent, rating, notes, entryDate } = req.body

    const sqlInsertEntry = `
      insert into "entries" ("userId", "hobbyId", "hobbyName", "hoursSpent", "rating", "notes", "entryDate")
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *;
    `;

    const params = [req.user?.userId, hobbyId, hobbyName, hoursSpent, rating, notes, entryDate]
    const result = await db.query(sqlInsertEntry, params)
    const newEntry = result.rows[0]

    if (!newEntry) throw new ClientError(404, `Unable to add entry.`)
    res.status(201).json(newEntry)

  }
  catch (err) {
    next(err)
  }
}
);

// ~*~*~*~*~~*~**~*~ Path for fetching entries on a date ~*~*~*~*~~*~**~*~
app.post('/api/auth/calendar/entryByDate', authMiddleware, async(req, res, next) => {
  try {
    const { entryDate } = req.body
    const date = dayjs(entryDate).utc()
    const date1 = date.startOf('day').toISOString()
    const date2 = date.endOf('day').toISOString()

    const sqlSelectEntryByDate = `
      select *
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
      `
    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlSelectEntryByDate, params)
    const entriesByDate = result.rows
    if (!entriesByDate) throw new ClientError(404, `Unable to fetch entries created between ${date1} and ${date2}`)
    res.status(201).json(entriesByDate)
  }
  catch(err) {
    next(err)
  }
})



// ~*~*~*~*~~*~**~*~ Path for deleting entries ~*~*~*~*~~*~**~*~
app.delete('/api/auth/calendar/:entryId', authMiddleware, async (req, res, next) => {
  try {
    const { entryId } = req.params
    const sqlDeleteEntry = `
    delete from "entries"
    where "entryId" = $1 AND "userId" = $2
    returning *;
    `;
    const params = [entryId, req.user?.userId];
    const result = await db.query(sqlDeleteEntry, params);
    const deletedEntry = result.rows[0]
    if (!deletedEntry) throw new ClientError(404, `Could not delete entry ${entryId}`)
    res.status(204).json(deletedEntry);
  }
  catch (err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for updating entries ~*~*~*~*~~*~**~*~

app.put('/api/auth/calendar/:entryId', authMiddleware, async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId)
    const { hoursSpent, rating, notes } = req.body

    const sqlUpdateEntry = `
    update "entries"
      set "hoursSpent" = $1,
          "rating" = $2,
          "notes" = $3
          where "entryId" = $4
          AND "userId" = $5
          returning *
    `
    const params = [hoursSpent, rating, notes, entryId, req.user?.userId]
    const result = await db.query(sqlUpdateEntry, params)
    const updatedEntry = result.rows[0]
    if (!updatedEntry) throw new ClientError(404, `Could not update entry ${entryId}`)
    res.status(201).json(updatedEntry)
  }
  catch(err) {
    next(err)
  }
})


// ~*~*~*~*~~*~**~*~ Path for getting total hours spent on hobbies in a week ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics', authMiddleware, async (req, res, next) => {
  try {
    const { user } = req.params
    const { today } = req.body
    const date = dayjs(today).utc()
    const date1 = date.startOf('week').toISOString()
    const date2 = date.endOf('week').toISOString()

    const sqlGetHours = `
      select sum("hoursSpent")
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
    `
    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlGetHours, params)
    const totalHours = result.rows[0]
    if (!totalHours) throw new ClientError(404, `Could not find total hours spent on hobbies between ${date1} and ${date2}`)
    res.status(201).json(totalHours)
  }
  catch(err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for fetching entries in a week ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics/entriesByWeek', authMiddleware, async(req, res, next) => {
  try {
    const { user } = req.params
    const { today } = req.body
    const date = dayjs(today).utc()
    const date1 = date.startOf('week').toISOString()
    const date2 = date.endOf('week').toISOString()

    const sqlSelectEntriesByWeek = `
      select *
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
      `
    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlSelectEntriesByWeek, params)
    const entriesByWeek = result.rows
    if (!entriesByWeek) throw new ClientError(404, `Unable to fetch entries created between ${date1} and ${date2}`)
    res.status(201).json(entriesByWeek)
  }
  catch (err) {
    next(err)
  }
})



// OTHER PATHS

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, async () => {
  console.log('Listening on port', process.env.PORT);
  main();
});
