import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { Medico } from "../entities/Medico";

class MedicoController {
	static listarMedicos = async (req: Request, res: Response) => {
		const medicos = await createQueryBuilder(Medico, "medico")
			.orderBy("medico.nome", "ASC")
			.getRawMany();

		res.send(medicos);
	};

	static buscarMedico = async (req: Request, res: Response) => {
		try {
			const medico = await createQueryBuilder(Medico, "medico")
				.where("medico.id = id", { id: req.params.id })
				.getRawOne();
			
			res.send(medico);
		} catch (error) {
			res.status(404).send("Medico não encontrado!");
		}
	};

	static novoMedico = async (req: Request, res: Response) => {
		let medico = new Medico();

		let { nome, especialidade } = req.body;
		medico.nome = nome;
		medico.especialidade = especialidade;

		const medicoRepository = getRepository(Medico);
		try {
			await medicoRepository.save(medico);
		} catch (e) {
			res.status(409).send(e);
			return;
		}

		res.status(200).send("Medico criado!");
	};

	static editarMedico = async (req: Request, res: Response) => {
		const medicoRepository = getRepository(Medico);
		let { nome, especialidade } = req.body;
		try {
			let medico = await medicoRepository.findOneOrFail(req.params.id);
			medico.nome = nome;
			medico.especialidade = especialidade;
			await medicoRepository.save(medico);
		} catch (error) {
			res.status(404).send("Medico não encontrado!");
			return;
		}

		res.status(200).send("Medico editado!");
	};

	static excluirMedico = async (req: Request, res: Response) => {
		const medicoRepository = getRepository(Medico);
		let medico: Medico;
		try {
			medico = await medicoRepository.findOneOrFail(req.params.id);
		} catch (error) {
			res.status(404).send("Medico não encontrado!");
			return;
		}

		medicoRepository.delete(req.params.id);

		res.status(200).send("Medico excluído!");
	};
}

export default MedicoController;
