import connectionDB from "../database/db.js";
import dayjs from "dayjs";

export async function getRents(req, res) {

    try {
        const rentals = await connectionDB.query("SELECT * FROM rentals;");
        res.status(200).send(rentals.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function postRent(req, res) {

    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format("YYYY-M-D");

    try {
        const game = await connectionDB.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        const originalPrice = daysRented * game.rows[0].pricePerDay;

        const rent = await connectionDB.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

        const newStock = Number(game.rows[0].stockTotal) - 1;
        const updateStock = await connectionDB.query(`UPDATE games SET "stockTotal"=$1 WHERE id=$2;`, [newStock, gameId]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function endRent(req, res) {
}

export async function deleteRent(req, res) {
}