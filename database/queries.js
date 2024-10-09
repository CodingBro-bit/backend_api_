import dotenv from 'dotenv'
dotenv.config();

export const tables = `
CREATE TABLE IF NOT EXISTS modular_users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL
);       
`
export const post_table = `
    CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES modular_users(id) ON DELETE CASCADE
);`
export const searchbyusername = `
SELECT id,username,password FROM modular_users WHERE username=$1
`

export const insert_to_database = `INSERT INTO modular_users (username,password) 
VALUES ($1,$2) RETURNING * `

export const insert_to_database_posts = `
    INSERT INTO posts (user_id, content, createdAt) 
    VALUES ($1, $2, $3) 
    RETURNING *
`;

export const search_by_id = `SELECT * FROM posts WHERE user_id=$1`

export const search_by_id_post = `SELECT * FROM posts WHERE id=$1`

export const url = process.env.CONNECTION;