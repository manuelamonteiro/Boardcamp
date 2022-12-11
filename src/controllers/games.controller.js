import connectionDB from "../database/db.js"

export async function getGames(req, res) {

    const { name } = req.query;

    if (name) { 
        const nameLower = name.toLowerCase();

        try{
            const gamesByName = await connectionDB.query(`SELECT * FROM games WHERE LOWER (name) LIKE $1;`, [nameLower + "%"]);
            return res.status(200).send(gamesByName.rows);
        } catch (error){
            return res.status(500).send(error.message);
        }
    }

    try {
        const games = await connectionDB.query("SELECT * FROM games;");
        res.status(200).send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function postGame(req, res) {

    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const game = await connectionDB.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
            [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }

}