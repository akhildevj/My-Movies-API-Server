export const findAllMoviesQuery = `
    SELECT id, name, year, rating 
    FROM movie
    ORDER BY id DESC
;`;

export const addMovieQuery = `
    INSERT INTO movie(name, year, rating) 
    VALUES($1, $2, $3)
    ON CONFLICT(name) DO NOTHING
    RETURNING *
;`;
