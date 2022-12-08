import connectionDB from "../database/db.js"

export async function getClients(req, res) {

    const { cpf } = req.query;

    if (cpf) { }

    try {
        const clients = await connectionDB.query("SELECT * FROM customers;");
        res.status(200).send(clients.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function postClient(req, res) {

    const { name, phone, cpf, birthday } = req.body;

    try {
        const client = await connectionDB.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
            [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function getClientById(req, res) {

    const { id } = req.params;

    try {
        const clientById = await connectionDB.query("SELECT * FROM customers WHERE id=$1;", [id]);

        if (clientById.rows.length === 0) {
            res.sendStatus(404);
            return;
        }

        res.status(200).send(clientById.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function updateClient(req, res) {

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const clientUpdate = connectionDB.query(`UPDATE customers SET name='${name}', phone='${phone}', cpf='${cpf}', birthday='${birthday}' WHERE id=$1;`, [id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}