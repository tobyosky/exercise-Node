var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Joi from "joi";
import pgPromise from "pg-promise";
const db = pgPromise()("postgres://postgres:12345@localhost:5432/exercise");
const setupDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT 
    );
    `);
    yield db.none(`INSERT INTO planets (name) VALUES ('Earth'), ('Mars')`);
    const planets = yield db.many(`SELECT * FROM planets`);
    console.log(planets);
});
setupDb();
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planets = yield db.many(`SELECT * FROM planets;`);
    res.status(200).json(planets);
});
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: "id is not a number" });
    }
    const planet = yield db.oneOrNone(`SELECT * FROM planets WHERE id = $1;`, Number(id));
    if (planet) {
        res.status(200).json(planet);
    }
    else {
        res.status(404).json({ error: "Planet not found" });
    }
});
const planetSchema = Joi.object({
    name: Joi.string().required(),
});
const create = (req, res) => {
    const { name } = req.body;
    const newPlanet = { name };
    const validateNewPlanet = planetSchema.validate(newPlanet);
    if (validateNewPlanet.error) {
        res.status(400).json({ error: validateNewPlanet.error.details[0].message });
    }
    db.none(`INSERT INTO planets (name) VALUES ($1);`, name);
    res.status(201).json({
        msg: `planet ${newPlanet.name} created successfully`,
    });
};
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const updatePlanet = { name };
    const validateUpdatePlanet = planetSchema.validate(updatePlanet);
    if (validateUpdatePlanet.error) {
        res
            .status(400)
            .json({ error: validateUpdatePlanet.error.details[0].message });
    }
    const updatedPlanet = yield db.oneOrNone(`UPDATE planets SET name = $2 WHERE id = $1 RETURNING *;`, [id, name]);
    if (!updatedPlanet) {
        res.status(404).json({ error: `Planet with id ${id} does not exist` });
    }
    res.status(200).json({ msg: `updated planet with id ${id}` });
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        res.status(400).json({ error: "id is not a number" });
    }
    const deletedPlanet = yield db.oneOrNone(`DELETE FROM planets WHERE id = $1 RETURNING *;`, Number(id));
    if (!deletedPlanet) {
        res.status(404).json({ error: `Planet with id ${id} does not exist` });
    }
    res.status(200).json({
        msg: `The planet ${deletedPlanet.name} with id ${id} deleted successfully`,
    });
});
const createImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.file);
    const { id } = req.params;
    const rawPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (rawPath) {
        const fileName = rawPath.replace(/\\/g, "/");
        db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
        res.status(201).json({ msg: "Planet image uploaded succesfully" });
    }
    else {
        res.status(400).json({ msg: "Plane image failed to upload" });
    }
});
export { getAll, getOneById, create, deleteById, updateById, createImage };
