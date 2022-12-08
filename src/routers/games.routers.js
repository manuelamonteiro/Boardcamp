import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { gameValidation } from "../middlewares/games.middlewares.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", gameValidation, postGame);

export default router;