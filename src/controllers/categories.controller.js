import connectionDB from "../database/db.js"

export async function getCategories(req, res) {

    try {
        const categories = await connectionDB.query("SELECT * FROM categories;");
        res.status(200).send(categories.rows);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}

export async function postCategory(req, res) {

    const { name } = req.body;

    try {
        await connectionDB.query("INSERT INTO categories (name) VALUES ($1);", [name]);
        res.status(201).send({ message: "Categoria adicionada com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

}