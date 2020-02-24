const express = require("express");
const server = express();
const cors = require("cors");
const { Technology } = require("../models");

server.use(express.json());
server.use(express.static(__dirname + "/../public"));
server.use(cors());

server.get("/api/technologies", async (req, res) => {
  try {
    let technologies = await Technology.find();
    technologies = technologies.map(technology => {
      technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
      return technology;
    });
    return res.send({ error: false, data: technologies });
  } catch (error) {
    return res.send({ error: true, data: "Este ID no existe" });
  }
});

server.get("/api/technologies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let technology = await Technology.findById(id);
    technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;

    return res.send({ error: false, data: technology });
  } catch (error) {
    if (error["path"] === "_id")
      return res.send({
        error: false,
        data: "Este ID no exite intente con otro nuevamente."
      });
    return res.send({
      error: false,
      data: "Ha sucedido un error inesperado, intente más tarde."
    });
  }
});

server.get("/api/technologies/search/:name", async (req, res) => {
  const { name } = req.params;
  let technologies = await Technology.find({
    name: { $regex: new RegExp(name, "i") }
  });
  technologies = technologies.map(technology => {
    technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
    return technology;
  });
  return res.send({ error: false, data: technologies });
});

module.exports = server;
