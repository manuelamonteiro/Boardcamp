import connectionDB from "../database/db.js";
import { gamesSchema } from "../schemas/games.schema.js";

export async function gameValidation(req, res, next) {

    const { categoryId, name } = req.body;

    const validationStatus = gamesSchema.validate(req.body, { abortEarly: false });

    if (validationStatus.error) {
        const error = validationStatus.error.details.map((detail) => detail.message);
        res.status(400).send(error);
        return;
    };

    try {
        const isCategoryExists = await connectionDB.query(`SELECT * FROM categories WHERE id=$1;`, [categoryId]);

        if (isCategoryExists.rows.length === 0) {
            return res.sendStatus(400);
        }

        const isNameExists = await connectionDB.query(`SELECT * FROM games WHERE name=$1;`, [name]);

        if (isNameExists.rows.length !== 0) {
            return res.sendStatus(409);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    next();

}