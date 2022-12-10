import connectionDB from "../database/db.js";
import { rentsSchema } from "../schemas/rents.schema.js";

export async function rentValidation(req, res, next) {

    const { customerId, gameId } = req.body;

    const validationStatus = rentsSchema.validate(req.body, { abortEarly: false });

    if (validationStatus.error) {
        const error = validationStatus.error.details.map((detail) => detail.message);
        res.status(400).send(error);
        return;
    };

    try {
        const isCustomerIdExists = await connectionDB.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);

        if (isCustomerIdExists.rows.length === 0) {
            return res.sendStatus(400);
        }

        const isGameIdExists = await connectionDB.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);

        if (isGameIdExists.rows.length === 0) {
            return res.sendStatus(400);
        }

        if (isGameIdExists.rows[0].stockTotal === 0) {
            return res.sendStatus(400);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    next();

}

export async function deleteRentValidation(req, res, next) {

    const id = req.params.id;

    try {
        const isRentExists = await connectionDB.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

        if(isRentExists.rows.length === 0){
            return res.sendStatus(404);
        }

        if(isRentExists.rows[0].returnDate === null){
            return res.sendStatus(400);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function endRentValidation(req, res, next) {

    const id = req.params.id;

    try {
        const isRentExists = await connectionDB.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

        if(isRentExists.rows.length === 0){
            return res.sendStatus(404);
        }

        if(isRentExists.rows[0].returnDate !== null){
            return res.sendStatus(400);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}