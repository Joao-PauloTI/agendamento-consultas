import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { Paciente } from "../entities/Paciente";

class PacienteController {
	static listarPacientes = async (req: Request, res: Response) => {
		const pacientes = await createQueryBuilder(Paciente, "paciente")
			.orderBy("paciente.nome", "ASC")
			.getRawMany();

		res.send(pacientes);
	};

	static buscarPaciente = async (req: Request, res: Response) => {
		try {
			const paciente = await createQueryBuilder(Paciente, "paciente")
				.where("paciente.id = id", { id: req.params.id })
				.getRawOne();
			
			res.send(paciente);
		} catch (error) {
			res.status(404).send("Paciente não encontrado!");
		}
	};

	static novoPaciente = async (req: Request, res: Response) => {
		let paciente = new Paciente();

		let { nome } = req.body;
		paciente.nome = nome;

		const pacienteRepository = getRepository(Paciente);
		try {
			await pacienteRepository.save(paciente);
		} catch (e) {
			res.status(409).send(e);
			return;
		}

		res.status(200).send("Paciente criado!");
	};

	static editarPaciente = async (req: Request, res: Response) => {
		const pacienteRepository = getRepository(Paciente);
		let { nome } = req.body;
		try {
			let paciente = await pacienteRepository.findOneOrFail(req.params.id);
			paciente.nome = nome;
			await pacienteRepository.save(paciente);
		} catch (error) {
			res.status(404).send("Paciente não encontrado!");
			return;
		}

		res.status(200).send("Paciente editado!");
	};

	static excluirPaciente = async (req: Request, res: Response) => {
		const pacienteRepository = getRepository(Paciente);
		let paciente: Paciente;
		try {
			paciente = await pacienteRepository.findOneOrFail(req.params.id);
		} catch (error) {
			res.status(404).send("Paciente não encontrado!");
			return;
		}

		pacienteRepository.delete(req.params.id);

		res.status(200).send("Paciente excluído!");
	};
}

export default PacienteController;
