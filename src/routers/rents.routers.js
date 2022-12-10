import { Router } from "express";
import { getRents, postRent, endRent, deleteRent } from "../controllers/rents.controller.js";
import { rentValidation } from "../middlewares/rents.middlewares.js";

const router = Router();

router.get("/rentals", getRents);
router.post("/rentals", rentValidation, postRent);
router.post("/rentals/:id/return", endRent);
router.delete("/rentals/:id", deleteRent);


export default router;