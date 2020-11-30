import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { Agendamento } from "../entities/Agendamento";
import { Medico } from "../entities/Medico";
import { Paciente } from "../entities/Paciente";

class AgendamentoController {
	static listarAgendamentos = async (req: Request, res: Response) => {
		const agendamentos = await createQueryBuilder(Agendamento, "agendamento")
			.leftJoinAndSelect(Paciente, "paciente", "agendamento.idPaciente = paciente.id")
			.leftJoinAndSelect(Medico, "medico", "agendamento.idMedico = medico.id")
			.orderBy("agendamento.id", "DESC")
			.select(["agendamento.id as id", "agendamento.dataHorario", "paciente.id", "paciente.nome", "medico.id", "medico.nome", "medico.especialidade"])
			.getRawMany();

		res.send(agendamentos);
	};

	static buscarAgendamento = async (req: Request, res: Response) => {
		try {
			const agendamento = await createQueryBuilder(Agendamento, "agendamento")
				.leftJoinAndSelect(Paciente, "paciente", "agendamento.idPaciente = paciente.id")
				.leftJoinAndSelect(Medico, "medico", "agendamento.idMedico = medico.id")
				.where("agendamento.id = :id", { id: req.params.id })
				.getRawOne();

			res.send(agendamento);
		} catch (error) {
			res.status(404).send("Agendamento não encontrado!");
		}
	};

	static novoAgendamento = async (req: Request, res: Response) => {
		let agendamento = new Agendamento();

		let { idPaciente, idMedico, dataHorario } = req.body;
		agendamento.idPaciente = idPaciente;
		agendamento.idMedico = idMedico;
		agendamento.dataHorario = dataHorario;

		const agendamentoRepository = getRepository(Agendamento);
		try {
			await agendamentoRepository.save(agendamento);
		} catch (e) {
			res.status(409).send(e);
			return;
		}

		res.status(200).send("Agendamento criado!");
	};

	static editarAgendamento = async (req: Request, res: Response) => {
		const agendamentoRepository = getRepository(Agendamento);
		let { idPaciente, idMedico, dataHorario } = req.body;
		try {
			let agendamento = await agendamentoRepository.findOneOrFail(req.params.id);
			agendamento.idPaciente = idPaciente;
			agendamento.idMedico = idMedico;
			agendamento.dataHorario = dataHorario;
			await agendamentoRepository.save(agendamento);
		} catch (error) {
			res.status(404).send("Agendamento não encontrado!");
			return;
		}

		res.status(200).send("Agendamento editado!");
	};

	static excluirAgendamento = async (req: Request, res: Response) => {
		const agendamentoRepository = getRepository(Agendamento);
		let agendamento: Agendamento;
		try {
			agendamento = await agendamentoRepository.findOneOrFail(req.params.id);
		} catch (error) {
			res.status(404).send("Agendamento não encontrado!");
			return;
		}

		agendamentoRepository.delete(req.params.id);

		res.status(200).send("Agendamento excluído!");
	};
}

export default AgendamentoController;
