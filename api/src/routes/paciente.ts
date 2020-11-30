import { Router } from "express";
import PacienteController from "../controllers/PacienteController";

const router = Router();

router.get("/pacientes/", PacienteController.listarPacientes);

router.get("/paciente/:id([0-9]+)", PacienteController.buscarPaciente);

router.post("/novo-paciente/", PacienteController.novoPaciente);

router.post("/editar-paciente/:id([0-9]+)", PacienteController.editarPaciente);

router.delete("/excluir-paciente/:id([0-9]+)", PacienteController.excluirPaciente);

export default router;
