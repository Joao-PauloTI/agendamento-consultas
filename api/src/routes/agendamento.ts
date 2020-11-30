import { Router } from "express";
import AgendamentoController from "../controllers/AgendamentoController";

const router = Router();

router.get("/agendamentos/", AgendamentoController.listarAgendamentos);

router.get("/agendamento/:id([0-9]+)", AgendamentoController.buscarAgendamento);

router.post("/novo-agendamento/", AgendamentoController.novoAgendamento);

router.post("/editar-agendamento/:id([0-9]+)", AgendamentoController.editarAgendamento);

router.delete("/excluir-agendamento/:id([0-9]+)", AgendamentoController.excluirAgendamento);

export default router;
