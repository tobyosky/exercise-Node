import express from "express";
import "express-async-errors";
import morgan from "morgan";
import { getAll, getOneById, create, deleteById, updateById, } from "./controllers/planets.js";
const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(express.json());
// GET all planets in array planets
app.get("/api/planets", getAll);
// GET planet by ID
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateById);
app.delete("/api/planets/:id", deleteById);
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
