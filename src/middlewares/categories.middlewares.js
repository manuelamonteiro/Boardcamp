import connection from "../database/db.js";
import { categoriesSchema } from "../schemas/categories.schema.js";

export async function isNameOfCategoryOk(req, res, next) {

    const { name } = req.body;

    const validationStatus = categoriesSchema.validate(req.body, { abortEarly: false });

    if (validationStatus.error) {
        const error = validationStatus.error.details.map((detail) => detail.message);
        res.status(422).send(error);
        return;
    };

    try{
        const isNameExists = connection.query(`SELECT * FROM categories WHERE name=$1`, [name]);

        if(isNameExists.rows){
            return res.sendStatus(409);
        }
    } catch (error){
        res.status(500).send(error.message);
    }

    next();

}