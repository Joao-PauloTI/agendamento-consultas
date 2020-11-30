import { Router } from "express";
import MedicoController from "../controllers/MedicoController";

const router = Router();

router.get("/medicos/", MedicoController.listarMedicos);

router.get("/medico/:id([0-9]+)", MedicoController.buscarMedico);

router.post("/novo-medico/", MedicoController.novoMedico);

router.post("/editar-medico/:id([0-9]+)", MedicoController.editarMedico);

router.delete("/excluir-medico/:id([0-9]+)", MedicoController.excluirMedico);

export default router;
