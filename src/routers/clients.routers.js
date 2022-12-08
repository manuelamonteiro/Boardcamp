import { Router } from "express";
import { getClients, getClientById, postClient, updateClient } from "../controllers/clients.controller";

const router = Router();

router.get("/customers", getClients);
router.get("/customers/:id", getClientById);
router.post("/customers", postClient);
router.put("/customers/:id", updateClient);

export default router;