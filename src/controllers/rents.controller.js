import connectionDB from "../database/db.js";
import dayjs from "dayjs";

export async function getRents(req, res) {

    const {customerId, gameId} = req.query;

    if (customerId) {
        try {
            const rentals = await connectionDB.query(`SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId"=$1`, [customerId]);
            return res.status(200).send(rentals.rows);
        } catch (error) {
            return res.status(500).send({message: error.message});
        }
    }

    if (gameId) {
        try {
            const rentals = await connectionDB.query(`SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId"=$1`, [gameId]);
            return res.status(200).send(rentals.rows);
        } catch (error) {
            return res.status(500).send({message: error.message});
        }
    }

    try {
        const rentals = await connectionDB.query(`SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS customer, JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`);
        res.status(200).send(rentals.rows);
    } catch (error) {
        res.status(500).send({message: error.message});
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

        res.status(201).send({message: "Aluguel realizado com sucesso!"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}

export async function endRent(req, res) {

    const id = req.params.id;
    const returnDate = dayjs().format("YYYY-M-D");
    let delayFee;

    try {
        const rent = await connectionDB.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        const game = await connectionDB.query(`SELECT * FROM games WHERE id=$1;`, [rent.rows[0].gameId]);

        const numberDaysRented = (Date.now() - rent.rows[0].rentDate) / (1000 * 60 * 60 * 24);
        if (numberDaysRented <= rent.rows[0].daysRented) {
            delayFee = 0;
        }
        else {
            delayFee = (Math.floor(numberDaysRented) - parseInt(rent.rows[0].daysRented)) * game.rows[0].pricePerDay;
        }

        const rentUpdate = await connectionDB.query(`UPDATE rentals SET "returnDate"=$1, "delayFee" =$2  WHERE id=$3;`, [returnDate, delayFee, id]);

        const newStock = Number(game.rows[0].stockTotal) + 1;
        const updateStock = await connectionDB.query(`UPDATE games SET "stockTotal"=$1 WHERE id=$2;`, [newStock, game.rows[0].id]);

        res.status(200).send({message: "Aluguel finalizado com sucesso!"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

export async function deleteRent(req, res) {

    const id = req.params.id;

    try {
        const deleteRent = await connectionDB.query("DELETE FROM rentals WHERE id=$1;", [id]);
        res.status(200).send({message: "Aluguel deletado com sucesso!"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}