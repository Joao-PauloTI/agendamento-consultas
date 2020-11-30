import { Router } from "express";
import agendamento from "./agendamento";
import paciente from "./paciente";
import medico from "./medico";

const routes = Router();

routes.use("/agendamento-consultas", [agendamento, paciente, medico]);

export default routes;
