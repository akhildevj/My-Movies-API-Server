export const createUserQuery = `
    INSERT INTO users(name, email) 
    VALUES($1, $2) RETURNING *
;`;

export const findUserQuery = `
    SELECT name FROM users
    WHERE email = $1
;`;
