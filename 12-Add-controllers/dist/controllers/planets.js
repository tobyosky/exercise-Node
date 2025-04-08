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
const getAll = (req, res) => {
    res.status(200).json(planets);
};
const getOneById = (req, res) => {
    const { id } = req.params;
    const planet = planets.find((planet) => planet.id === Number(id));
    res.status(200).json(planet);
};
const create = (req, res) => {
    const { id, name } = req.body;
    const newPlanet = { id, name };
    planets = [...planets, newPlanet];
    res.status(201).json({
        msg: `planet ${newPlanet.name} whit id ${newPlanet.id} created successfully`,
    });
};
const updateById = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    planets = planets.map((planet) => planet.id === Number(id) ? Object.assign(Object.assign({}, planet), { name }) : planet);
    res.status(200).json({ msg: `updated planet with id ${id}` });
};
const deleteById = (req, res) => {
    const { id } = req.params;
    const deletedPlanet = planets.find((planet) => planet.id === Number(id));
    planets = planets.filter((planet) => planet.id !== Number(id));
    res.status(200).json({
        msg: `The planet ${deletedPlanet === null || deletedPlanet === void 0 ? void 0 : deletedPlanet.name} with id ${id} deleted successfully`,
    });
};
export { getAll, getOneById, create, updateById, deleteById };
