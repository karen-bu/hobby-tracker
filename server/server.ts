/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import pg, { Client } from 'pg';
import express from 'express';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import argon2, { hash } from 'argon2';
import jwt from 'jsonwebtoken';
import { main } from './seed.js';

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
  hobbyId: number;
  hoursSpent?: number;
  rating?: number;
  notes?: number;
  entryDate: Date;
  createdAt: Date;
};

// type Goal = {}

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

// USER MANAGEMENT

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found!');

// Path for signing up

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

// Path for signing in

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

// HOBBIES PAGE

// Path for getting hobbies

app.get('/api/auth/hobbies', authMiddleware, async (req, res, next) => {
  try {
    const sqlGetHobbies = `
    select *
      from "hobbies"
    `;
    const result = await db.query<Hobby>(sqlGetHobbies);
    if (!result) {
      throw new ClientError(404, 'Cannot fetch list of hobbies');
    }
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Path for adding hobbies

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

// Path for deleting hobbies

app.delete(
  '/api/auth/hobbies/:hobbyId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { hobbyId } = req.params;

      const sqlDeleteHobby = `
  delete from "hobbies"
  where "hobbyId" = $1
  returning *;
  `;

      const params = [hobbyId];
      const result = await db.query(sqlDeleteHobby, params);
      const deletedEntry = result.rows[0];
      if (!deletedEntry) {
        throw new ClientError(404, `could not find hobby ${hobbyId}`);
      }
      res.status(204).json(deletedEntry);
    } catch (err) {
      next(err);
    }
  }
);

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
