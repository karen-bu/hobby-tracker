import argon2 from 'argon2';
import { db } from './server';


export async function main() {
  const username = 'testaccount';
  const password = 'password1!';

  let userId: number;
  // Check if user already exists
  const { rows } = await db.query(
    'SELECT * FROM "users" WHERE username = $1',
    [username]
  );

  if (rows.length === 0) {
    const hashedPassword = await argon2.hash(password);
    const insertResult = await db.query(
      'INSERT INTO "users" (username, "hashedPassword", "createdAt") VALUES ($1, $2, NOW()) RETURNING "userId"',
      [username, hashedPassword]
    );
    console.log('Default user created.');
    userId = insertResult.rows[0].userId;
  }
  else {
    console.log('Default user already exists.');
    userId = rows[0].userId;
  }

  const hobbies = [
    { userId: userId, hobbyName: 'Drawing' },
    { userId: userId, hobbyName: 'Hockey' },
    { userId: userId, hobbyName: 'Gardening' }
  ];

  // Check if hobbies already exist for the user
  const hobbyCheck = await db.query(
    'SELECT * FROM "hobbies" WHERE "userId" = $1',
    [userId]
  );
  if (hobbyCheck.rows.length > 0) {
    console.log('Default hobbies already exist.');
    return;
  }

  // Insert default hobbies
  for (const hobby of hobbies) {
    const { userId, hobbyName } = hobby;
    const params = [userId, hobbyName];
    await db.query(
      'INSERT INTO "hobbies" ("userId", "hobbyName") VALUES ($1, $2)',
      params
    );
  }
  console.log('Default hobbies created.');

  const hobbyQuery = await db.query(
    'SELECT * FROM "hobbies" WHERE "userId" = $1',
    [userId]
  );
  const hobbyList = hobbyQuery.rows;

  const entries = [
    {
      userId: userId,
      hobbyId: hobbyList[0].hobbyId,
      hoursSpent: 3,
      rating: 4,
      notes: 'Practiced sketching landscapes. Really enjoying the process!',
      entryDate: new Date('2024-10-15')
    },
    {
      userId: userId,
      hobbyId: hobbyList[1].hobbyId,
      hoursSpent: 6,
      rating: 5,
      notes: 'Great practice session. Improved my skating speed.',
      entryDate: new Date('2024-10-16')
    },
    {
      userId: userId,
      hobbyId: hobbyList[1].hobbyId,
      hoursSpent: 2,
      rating: 3,
      notes: 'Short session due to weather. Still got some good drills in.',
      entryDate: new Date('2024-10-18')
    },
    {
      userId: userId,
      hobbyId: hobbyList[2].hobbyId,
      hoursSpent: 4,
      rating: 5,
      notes: 'Planted tomatoes and peppers. Garden is looking beautiful!',
      entryDate: new Date('2024-10-17')
    }
  ];
  // Check if entries already exist for the user
  const entryCheck = await db.query(
    'SELECT * FROM "entries" WHERE "userId" = $1',
    [userId]
  );
  if (entryCheck.rows.length > 0) {
    console.log('Default entries already exist.');
    return;
  }
  // Insert default entries
  for (const entry of entries) {
    const { userId, hobbyId, hoursSpent, rating, notes, entryDate } = entry;
    await db.query(
      'INSERT INTO "entries" ("userId", "hobbyId", "hoursSpent", "rating", "notes", "entryDate", "createdAt", "modifiedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
      [userId, hobbyId, hoursSpent, rating, notes, entryDate]
    );
  }
  console.log('Default entries created.');
  // Insert default goals
  const goals = [
    {
      userId: userId,
      hobbyId: hobbyList[0].hobbyId,
      startDate: new Date('2024-10-01'),
      actualHours: 12,
      targetHours: 20
    },
    {
      userId: userId,
      hobbyId: hobbyList[1].hobbyId,
      startDate: new Date('2024-10-01'),
      actualHours: 8,
      targetHours: 15
    },
    {
      userId: userId,
      hobbyId: hobbyList[2].hobbyId,
      startDate: new Date('2024-10-01'),
      actualHours: 10,
      targetHours: 10
    }
  ];
  // Check if goals already exist
  const goalCheck = await db.query(
    'SELECT * FROM "goals" WHERE "userId" = $1',
    [userId]
  );
  if (goalCheck.rows.length > 0) {
    console.log('Default goals already exist.');
    return;
  }
  // Insert default goals
  for (const goal of goals) {
    const { userId, hobbyId, startDate, actualHours, targetHours } = goal;
    await db.query(
      'INSERT INTO "goals" ("userId", "hobbyId", "startDate", "actualHours", "targetHours", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
      [userId, hobbyId, startDate, actualHours, targetHours]
    );
  }
  console.log('Default goals created.');
}
