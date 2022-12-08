import { Router } from "express";
import { getCategories, postCategory } from "../controllers/categories.controller.js";
import { isNameOfCategoryOk } from "../middlewares/categories.middlewares.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", isNameOfCategoryOk, postCategory);

export default router;