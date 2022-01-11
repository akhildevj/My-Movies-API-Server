export const addMovieQuery = `
    INSERT INTO movies(title, overview, release_date, vote_average, poster_path) 
    VALUES($1, $2, $3, $4, $5)
    ON CONFLICT(title) DO NOTHING
    RETURNING *
;`;
