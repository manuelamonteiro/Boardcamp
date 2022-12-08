import { Router } from "express";
import { getClients, getClientById, postClient, updateClient } from "../controllers/clients.controller.js";
import { clientValidation, isClientExists } from "../middlewares/clients.middlewares.js";

const router = Router();

router.get("/customers", getClients);
router.get("/customers/:id", getClientById);
router.post("/customers", clientValidation, postClient);
router.put("/customers/:id", isClientExists, clientValidation, updateClient);

export default router;