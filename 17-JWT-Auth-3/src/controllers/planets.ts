import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../db.js";

const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(400).json({ error: "id is not a number" });
  }

  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id = $1;`,
    Number(id)
  );
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ error: "Planet not found" });
  }
};

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const create = (req: Request, res: Response) => {
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

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatePlanet = { name };
  const validateUpdatePlanet = planetSchema.validate(updatePlanet);

  if (validateUpdatePlanet.error) {
    res
      .status(400)
      .json({ error: validateUpdatePlanet.error.details[0].message });
  }

  const updatedPlanet = await db.oneOrNone(
    `UPDATE planets SET name = $2 WHERE id = $1 RETURNING *;`,
    [id, name]
  );

  if (!updatedPlanet) {
    res.status(404).json({ error: `Planet with id ${id} does not exist` });
  }

  res.status(200).json({ msg: `updated planet with id ${id}` });
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(400).json({ error: "id is not a number" });
  }

  const deletedPlanet = await db.oneOrNone(
    `DELETE FROM planets WHERE id = $1 RETURNING *;`,
    Number(id)
  );

  if (!deletedPlanet) {
    res.status(404).json({ error: `Planet with id ${id} does not exist` });
  }

  res.status(200).json({
    msg: `The planet ${deletedPlanet.name} with id ${id} deleted successfully`,
  });
};

const createImage = async (req: Request, res: Response) => {
  console.log(req.file);
  const { id } = req.params;
  const rawPath = req.file?.path;

  if (rawPath) {
    const fileName = rawPath.replace(/\\/g, "/");

    db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
    res.status(201).json({ msg: "Planet image uploaded succesfully" });
  } else {
    res.status(400).json({ msg: "Plane image failed to upload" });
  }
};

export { getAll, getOneById, create, deleteById, updateById, createImage };
