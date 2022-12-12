import connectionDB from "../database/db.js"

export async function getClients(req, res) {

    const { cpf } = req.query;

    if (cpf) {
        try {
            const clientsByCpf = await connectionDB.query(`SELECT * FROM customers WHERE cpf LIKE $1;`, [cpf + "%"]);
            return res.status(200).send(clientsByCpf.rows);
        } catch (error) {
            return res.status(500).send({message: error.message});
        }
    }

    try {
        const clients = await connectionDB.query("SELECT * FROM customers;");
        res.status(200).send(clients.rows);
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}

export async function postClient(req, res) {

    const { name, phone, cpf, birthday } = req.body;

    try {
        const client = await connectionDB.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
            [name, phone, cpf, birthday]);
            res.status(201).send({message: "Cliente adicionado com sucesso!"});
    } catch (error) {
        res.status(500).send({message: error.message});
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
        res.status(500).send({message: error.message});
    }

}

export async function updateClient(req, res) {

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const clientUpdate = await connectionDB.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;`, [name, phone, cpf, birthday, id]);
        res.status(200).send({message: "Cliente atualizado com sucesso!"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }

}