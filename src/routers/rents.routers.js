import { Router } from "express";
import { getRents, postRent, endRent, deleteRent } from "../controllers/rents.controller";

const router = Router();

router.get("/rentals", getRents);
router.post("/rentals", postRent);
router.post("/rentals/:id/return", endRent);
router.delete("/rentals/:id", deleteRent);


export default router;