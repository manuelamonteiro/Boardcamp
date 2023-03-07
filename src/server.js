import express from "express";
import cors from "cors";
import categoriesRouter from "./routers/categories.routers.js";
import gamesRouter from "./routers/games.routers.js";
import clientsRouter from "./routers/clients.routers.js";
import rentsRouter from "./routers/rents.routers.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(clientsRouter);
app.use(rentsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));