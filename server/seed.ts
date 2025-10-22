import argon2 from 'argon2';
import { db } from './server'

export async function main() {
    const username = 'testaccount';
    const password = 'password1!';
    const createdAt = new Date('2025-10-21');


    let userId: number;

    // Check if user already exists
    const { rows } = await db.query(
        'SELECT * FROM "users" WHERE username = $1',
        [username]
    );

    if (rows.length === 0) {
        const hashedPassword = await argon2.hash(password);
        const insertResult = await db.query(
            'INSERT INTO "users" (username, "hashedPassword", "createdAt") VALUES ($1, $2, $3) RETURNING "userId"',
            [username, hashedPassword, createdAt]
        );
        console.log('Default user created.');
        userId = insertResult.rows[0].userId;
    } else {
        console.log('Default user already exists.');
        userId = rows[0].userId;
    }

    const hobbies = [
      { userId: userId, hobbyName: "Drawing" },
      { userId: userId, hobbyName: "Hockey" },
      { userId: userId, hobbyName: "Gardening" }
    ]

    // Check if hobbies already exist for the user
    const hobbyCheck = await db.query(
        'SELECT * FROM "hobbies" WHERE "userId" = $1',
        [userId]
    );

    if (hobbyCheck.rows.length > 0) {
        console.log('Default hobbies already exist.');
    } else {
        for (const hobby of hobbies) {
          const { userId, hobbyName } = hobby;
          const params = [ userId, hobbyName ];
          await db.query(
              'INSERT INTO "hobbies" ("userId", "hobbyName") VALUES ($1, $2)',
              params
          );
      }
      console.log('Default hobbies created.');
    }

    const hobbyQuery = await db.query(
      'SELECT * FROM "hobbies" where "userId" = $1', [userId]
    )

    const hobbyList = hobbyQuery.rows

    const entries = [
        {
            userId: userId,
            hobbyId: hobbyList[0].hobbyId,
            hoursSpent: 4,
            rating: 5,
            notes: 'Finished 3 pages of a comic today, though my goal was 4 pages.',
            entryDate: new Date('2025-10-15')
        },
        {
            userId: userId,
            hobbyId: hobbyList[1].hobbyId,
            hoursSpent: 6,
            rating: 5,
            notes: 'Worked on defensive skating and scored a goal in the scrimmage!',
            entryDate: new Date('2025-10-16')
        },
        {
            userId: userId,
            hobbyId: hobbyList[1].hobbyId,
            hoursSpent: 2,
            rating: 1,
            notes: 'All my plants died despite my best efforts. RIP.',
            entryDate: new Date('2025-10-17')
        },

    ];

// Insert default entries
    const entryCheck = await db.query(
        'SELECT * FROM "entries" WHERE "userId" = $1',
        [userId]
    );

    if (entryCheck.rows.length > 0) {
        console.log('Default entries already exist.');
    } else {
          for (const entry of entries) {
          const { userId, hobbyId, hoursSpent, rating, notes, entryDate } = entry;
          await db.query(
              'INSERT INTO "entries" ("userId", "hobbyId", "hoursSpent", "rating", "notes", "entryDate") VALUES ($1, $2, $3, $4, $5, $6)',
              [userId, hobbyId, hoursSpent, rating, notes, entryDate]
          );
    }
      console.log('Default entries created.');
    }

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
  }

  else {
    for (const goal of goals) {
        const { userId, hobbyId, startDate, actualHours, targetHours } = goal;
        await db.query(
        'INSERT INTO "goals" ("userId", "hobbyId", "startDate", "actualHours", "targetHours", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
        [userId, hobbyId, startDate, actualHours, targetHours]
      );
    }
    console.log('Default goals created.');
  }

}
