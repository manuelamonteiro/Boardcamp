import connectionDB from "../database/db.js";
import { clientsSchema } from "../schemas/clients.schema.js";

export async function clientValidation(req, res, next) {

    const { cpf } = req.body;

    const validationStatus = clientsSchema.validate(req.body, { abortEarly: false });

    if (validationStatus.error) {
        const error = validationStatus.error.details.map((detail) => detail.message);
        res.status(400).send(error);
        return;
    };

    try {
        const isCpfExists = await connectionDB.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);

        if (isCpfExists.rows.length !== 0) {
            return res.sendStatus(409);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }

    next();
}

export async function isClientExists(req, res, next) {

    const { id } = req.params;

    try {
        const isIdExists = await connectionDB.query(`SELECT * FROM customers WHERE id=$1`, [id]);

        if (isIdExists.rows.length === 0) {
            return res.sendStatus(404);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}