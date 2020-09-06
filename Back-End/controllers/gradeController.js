import { db } from "../models/index.js";
import { logger } from "../config/logger.js";
import gradeModel  from "../models/gradesModel.js";

const create = async (req, res) => {
  const { name, subject, type, value } = req.body;
  const grades = new gradeModel({
    name,
    subject,
    type,
    value,
  });
  try {
    const newGrades = await grades.save()
    res.status(404).send({ message: `Grade inserido com sucesso: ${newGrades}.`});
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Algum erro ocorreu ao salvar" });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  let condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};

  try {
    const grades = await gradeModel.findAll(condition);
    if(!grades){
      res.status(404).send({ message: `Não foram encontradas grades para esta pesquisa: ${condition}.`})
    }
    res.send({ message:`Grades correspondente ao pesquisa: ${grades}`});
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Erro ao listar todos os documentos" });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await gradeModel.findById({_id: id})
    if(!grade){
      res.status(404).send({ message:`Não foi encontrada grade correspondente a este ${id}.`})
    }
    res.send({message: `Resultado da pesquisa: ${grade}.`})
    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar o Grade id: " + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dados para atualizacao vazio",
    });
  }

  const id = req.params.id;

  try {
    const gradeUpdate = await gradeModel.findByIdAndUpdate(
      {_id : id},
      req.body,
      { new: true }
    );
    if(!gradeUpdate){
      res.status(404).send({ message:`Não foi encontrada grade correspondente a este ${id}.`})
    }
    res.send({message: `Grade atualizada com sucesso: ${gradeUpdate}.`})
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar a Grade id: " + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const gradeDelete = await gradeModel.findByIdAndRemove(
      {_id : id},
      req.body,
      { new: true }
    );
    if(!gradeUpdate){
      res.status(404).send({ message:`Não foi encontrada grade correspondente a este ${id}.`})
    }
    res.send({message: `Grade removida com sucesso.`})
    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Nao foi possivel deletar o Grade id: " + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const deleteData = await gradeModel.deleteMany();
    if(!deleteData){
      res.status(404).send({ message:`Não foi encontradados dados para excluir.`})
    }
    res.send({message: `Dados excluidor com sucesso!`})
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: "Erro ao excluir todos as Grades" });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
