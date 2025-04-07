import express from "express";
import "express-async-errors";
import morgan from "morgan";
const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(express.json());
let planets = [
    {
        id: 1,
        name: "Earth",
    },
    {
        id: 2,
        name: "Mars",
    },
];
// GET all planets in array planets
app.get("/api/planets", (req, res) => {
    res.status(200).json(planets);
});
// GET planet by ID
app.get("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    const planet = planets.find((planet) => planet.id === Number(id));
    res.status(200).json(planet);
});
app.post("/api/planets", (req, res) => {
    const { id, name } = req.body;
    const newPlanet = { id, name };
    planets = [...planets, newPlanet];
    res.status(201).json({
        msg: `planet ${newPlanet.name} whit id ${newPlanet.id} created successfully`,
    });
});
app.put("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    planets = planets.map((planet) => planet.id === Number(id) ? Object.assign(Object.assign({}, planet), { name }) : planet);
    res.status(200).json({ msg: `updated planet with id ${id}` });
});
app.delete("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    const deletedPlanet = planets.find((planet) => planet.id === Number(id));
    planets = planets.filter((planet) => planet.id !== Number(id));
    res
        .status(200)
        .json({
        msg: `The planet ${deletedPlanet === null || deletedPlanet === void 0 ? void 0 : deletedPlanet.name} with id ${id} deleted successfully`,
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
