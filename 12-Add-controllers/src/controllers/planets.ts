import { Request, Response } from "express";
import Joi from "joi";

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};

const getOneById = (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(400).json({ error: "id is not a number" });
  }

  const planet = planets.find((planet) => planet.id === Number(id));
  console.log(planet);
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ error: "Planet not found" });
  }
};

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const create = (req: Request, res: Response) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    res.status(400).json({ error: validateNewPlanet.error.details[0].message });
  }

  planets = [...planets, newPlanet];

  res.status(201).json({
    msg: `planet ${newPlanet.name} whit id ${newPlanet.id} created successfully`,
  });
};

const updateById = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  planets = planets.map((planet) =>
    planet.id === Number(id) ? { ...planet, name } : planet
  );

  res.status(200).json({ msg: `updated planet with id ${id}` });
};

const deleteById = (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedPlanet = planets.find((planet) => planet.id === Number(id));
  planets = planets.filter((planet) => planet.id !== Number(id));

  res.status(200).json({
    msg: `The planet ${deletedPlanet?.name} with id ${id} deleted successfully`,
  });
};

export { getAll, getOneById, create, updateById, deleteById };
