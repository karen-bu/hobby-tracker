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
import { json } from 'stream/consumers';
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

    const params = [req.user?.userId];
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

app.delete(
  '/api/auth/hobbies/:hobbyId',
  authMiddleware,
  async (req, res, next) => {
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

app.post('/api/auth/calendar', authMiddleware, async (req, res, next) => {
  try {
    const { hobbyId, hobbyName, hoursSpent, rating, notes, entryDate } =
      req.body;

    const sqlInsertEntry = `
      insert into "entries" ("userId", "hobbyId", "hobbyName", "hoursSpent", "rating", "notes", "entryDate")
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *;
    `;

    const params = [
      req.user?.userId,
      hobbyId,
      hobbyName,
      hoursSpent,
      rating,
      notes,
      entryDate,
    ];
    const result = await db.query(sqlInsertEntry, params);
    const newEntry = result.rows[0];

    if (!newEntry) throw new ClientError(404, `Unable to add entry.`);
    res.status(201).json(newEntry);
  } catch (err) {
    next(err);
  }
});

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
      `;
      const params = [date1, date2, req.user?.userId];
      const result = await db.query(sqlSelectEntryByDate, params);
      const entriesByDate = result.rows;
      if (!entriesByDate)
        throw new ClientError(
          404,
          `Unable to fetch entries created between ${date1} and ${date2}`
        );
      res.status(201).json(entriesByDate);
    } catch (err) {
      next(err);
    }
  }
);



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
      const deletedEntry = result.rows[0];
      if (!deletedEntry)
        throw new ClientError(404, `Could not delete entry ${entryId}`);
      res.status(204).json(deletedEntry);
    } catch (err) {
      next(err);
    }
  }
);

// ~*~*~*~*~~*~**~*~ Path for updating entries ~*~*~*~*~~*~**~*~

app.put(
  '/api/auth/calendar/:entryId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const entryId = Number(req.params.entryId);
      const { hoursSpent, rating, notes } = req.body;

      const sqlUpdateEntry = `
    update "entries"
      set "hoursSpent" = $1,
          "rating" = $2,
          "notes" = $3
          where "entryId" = $4
          AND "userId" = $5
          returning *
    `;
      const params = [hoursSpent, rating, notes, entryId, req.user?.userId];
      const result = await db.query(sqlUpdateEntry, params);
      const updatedEntry = result.rows[0];
      if (!updatedEntry)
        throw new ClientError(404, `Could not update entry ${entryId}`);
      res.status(201).json(updatedEntry);
    } catch (err) {
      next(err);
    }
  }
);


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
});

// Path for getting actualHours for a specific hobby
app.get(
  '/api/auth/goals/actualHours',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { user } = req.params;
      const { hobby } = req.body;

      const sqlGetActualHours = `
      select sum("hoursSpent")
      from "entries"
      where "hobbyName" = $1
      and "userId" = $2
    `;

      const params = [hobby.hobbyName, req.user?.userId];
      const result = await db.query(sqlGetActualHours);
      const actualHours = result.rows[0];
      if (!actualHours)
        throw new ClientError(
          404,
          `Could not find actual hours spent on ${hobby.hobbyName}`
        );
      res.status(201).json(actualHours);
      console.log(actualHours);
    } catch (err) {
      next(err);
    }
  }
);


// ~*~*~*~*~~*~**~*~ Path for fetching entries from this week ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics/entriesThisWeek', authMiddleware, async(req, res, next) => {
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

// ~*~*~*~*~~*~**~*~ Path for fetching entries from 4 weeks ago ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics/entries4Weeks', authMiddleware, async(req, res, next) => {
  try {
    const { user } = req.params
    const { today } = req.body
    const date = dayjs(today).utc()
    const date1 = date.subtract(4, 'week').startOf('week').toISOString()
    const date2 = date.subtract(4, 'week').endOf('week').toISOString()

    const sqlSelectEntries4Weeks = `
      select *
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
    `

    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlSelectEntries4Weeks, params)
    const entries4Weeks = result.rows
    if (!entries4Weeks) throw new ClientError(404, `Unable to fetch entries created between ${date1} and ${date2}`)
    res.status(201).json(entries4Weeks)
  }
  catch (err) {
    next (err)
  }
})

// // ~*~*~*~*~~*~**~*~ Path for fetching entries from 3 weeks ago ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics/entries3Weeks', authMiddleware, async(req,res,next) => {
  try {
    const { user } = req.params
    const { today } = req.body
    const date = dayjs(today).utc()
    const date1 = date.subtract(3, 'week').startOf('week').toISOString()
    const date2 = date.subtract(3, 'week').endOf('week').toISOString()

   const sqlSelectEntries3Weeks = `
      select *
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
    `

    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlSelectEntries3Weeks, params)
    const entries3Weeks = result.rows
    if (!entries3Weeks) throw new ClientError(404, `Unable to fetch entries created between ${date1} and ${date2}`)
    res.status(201).json(entries3Weeks)
  }
  catch(err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for fetching entries from 2 weeks ago ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics/entries2Weeks', authMiddleware, async(req, res, next) => {
  try {
    const { user } = req.params
    const { today } = req.body
    const date = dayjs(today).utc()
    const date1 = date.subtract(2, 'week').startOf('week').toISOString()
    const date2 = date.subtract(2, 'week').endOf('week').toISOString()

    const sqlSelectEntries2Weeks = `
      select *
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
    `

    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlSelectEntries2Weeks, params)
    const entries2Weeks = result.rows
    if (!entries2Weeks) throw new ClientError(404, `Unable to fetch entries created between ${date1} and ${date2}`)
    res.status(201).json(entries2Weeks)
  }
  catch (err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for fetching entries from 1 week ago ~*~*~*~*~~*~**~*~
app.get('/api/auth/metrics/entries1Week', authMiddleware, async(req, res, next) => {
  try {
    const { user } = req.params
    const { today } = req.body
    const date = dayjs(today).utc()
    const date1 = date.subtract(1, 'week').startOf('week').toISOString()
    const date2 = date.subtract(1, 'week').endOf('week').toISOString()

    const sqlSelectEntries1Week = `
      select *
      from "entries"
      where "entryDate" between $1 and $2 AND "userId" = $3;
    `

    const params = [date1, date2, req.user?.userId]
    const result = await db.query(sqlSelectEntries1Week, params)
    const entries1Week = result.rows
    if (!entries1Week) throw new ClientError(404, `Unable to fetch entries created between ${date1} and ${date2}`)
    res.status(201).json(entries1Week)
  }
  catch (err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for getting goals ~*~*~*~*~~*~**~*~

app.get('/api/auth/goals', authMiddleware, async(req, res, next) => {
  try {
    const sqlGetGoals = `
      select *
      from "goals"
      join "hobbies" using ("hobbyId")
      where "goals"."userId" = $1;
    `
    const params = [req.user?.userId]
    const result = await db.query(sqlGetGoals, params)
    const goalsList = result.rows
    if (!goalsList) throw new ClientError(404, `Unable to fetch goals`)
    res.status(201).json(goalsList)
  }
  catch (err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for adding a new goal ~*~*~*~*~~*~**~*~

app.post('/api/auth/goals', authMiddleware, async(req, res, next) => {
  try {
    const { today, hobbyName, hobbyId, targetHours } = req.body

    const date = dayjs(today).utc()
    const date1 = date.startOf('week').toISOString()
    const date2 = date.endOf('week').toISOString()

    const sqlGetActualHours = `
      select sum("hoursSpent")
      from "entries"
      where "hobbyId" = $1
      and "entryDate" between $2 and $3
      and "userId" = $4;
      `
    const paramsActualHours = [hobbyId, date1, date2, req.user?.userId]
    const actualHoursResult = await db.query(sqlGetActualHours, paramsActualHours)
    const actualHours = actualHoursResult.rows[0]
    if (!actualHours) throw new ClientError(404, `Unable to get actual hours for ${hobbyName}`)

    const actualHoursNumber = +actualHours.sum

    const sqlAddGoal = `
      insert into "goals" ("hobbyId", "userId", "startDate", "actualHours", "targetHours")
      values ($1, $2, $3, $4, $5)
      returning *;
    `
    const paramsAddGoal = [hobbyId, req.user?.userId, date, actualHoursNumber, targetHours]
    const newGoalResult = await db.query(sqlAddGoal, paramsAddGoal)
    const newGoal = newGoalResult.rows[0]
    if (!newGoal) throw new ClientError(404, `Unable to add new goal`)
    newGoal.hobbyName = hobbyName
    res.status(201).json(newGoal)

  }
  catch(err) {
    next(err)
  }
})

// ~*~*~*~*~~*~**~*~ Path for deleting a goal ~*~*~*~*~~*~**~*~

app.delete('/api/auth/goals/:goalId', authMiddleware, async (req, res, next ) => {
  try {
    const { goalId } = req.params;
    const sqlDeleteGoal = `
    delete from "goals"
    where "goalId" = $1
    and "userId" = $2
    returning *;
    `;

    const params = [goalId, req.user?.userId]
    const result = await db.query(sqlDeleteGoal, params);
    const deletedGoal = result.rows[0]
    if (!deletedGoal) throw new ClientError(404, `Could not delete goal ${goalId}`)
      res.status(204).json(deletedGoal)
  } catch (err) {
    next (err)
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
});
