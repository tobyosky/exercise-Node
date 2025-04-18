import express from "express";
import "express-async-errors";
import morgan from "morgan";
import { getAll, getOneById, create, deleteById, updateById, createImage, } from "./controllers/planets.js";
import { login, signup } from "./controllers/users.js";
import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(express.json());
// GET all planets in array planets
app.get("/api/planets", getAll);
// GET planet by ID
app.get("/api/planets/:id", getOneById);
//POST planet in DB
app.post("/api/planets", create);
//PUT planet in DB
app.put("/api/planets/:id", updateById);
//DELETE planet in DB
app.delete("/api/planets/:id", deleteById);
app.post("/api/planets/:id/image", upload.single("image"), createImage);
app.post("/api/users/login", login);
app.post("/api/users/signup", signup);
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
