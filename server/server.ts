/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
import argon2, { hash } from 'argon2';
import jwt from 'jsonwebtoken';
import { main } from './seed.js';


type User = {
  userId: number;
  username: string;
  hashedPassword: string;
}

type Hobby = {
  hobbyId: number;
  userId: number;
  hobbyName: string;
}

type Entry = {
  entryId: number;
  userId: number;
  hobbyId: number;
  hoursSpent?: number;
  rating?: number;
  notes?: number;
  entryDate: Date;
  createdAt: Date;
}

type Goal = {}

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

// User Management


const hashKey = process.env.TOKEN_SECRET
if (!hashKey) throw new Error('TOKEN_SECRET not found!')

// Path for signing up

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const {username, password} = req.body;
      if (!username || !password) {
        throw new ClientError(400, 'Username and password are required.')
      }
    const hashedPassword = await argon2.hash(password)
      if (!hashedPassword) {
        throw new ClientError(404, 'Password cannot be accepted.')
      }
    const sqlSignUp = `
    insert into "users" ("username", "hashedPassword")
    values ($1, $2)
    returning *
    `;

    const params = [username, hashedPassword]
    const result = await db.query(sqlSignUp, params);
    const newUser = result.rows[0]
      if (!newUser) {
        throw new ClientError(404, 'Cannot add new user.')
      }
    res.status(201).json(newUser)
  }
  catch (err) {
    next(err)
  }
})


// Path for signing in






// Path for getting hobbies

app.get('/api/auth/hobbies', async (req, res, next) => {
  try {
    const sqlGetHobbies = `
    select *
      from "hobbies"
    `;

    const result = await db.query<Hobby>(sqlGetHobbies)
    if (!result ) {
      throw new ClientError(404, 'Cannot fetch list of hobbies')
    }

    res.status(200).json(result.rows);
  }
  catch (err) {
    next (err)
  }
})





app.post('/api/auth/hobbies', async (req, res, next) => {
  try {
    const { hobby } = req.body

    const sqlNewHobby = `
    inser into "hobbies"
    `





  }
  catch (err){
    next (err)
  }
}


)




/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, async () => {
  console.log('Listening on port', process.env.PORT);
  main()
});
