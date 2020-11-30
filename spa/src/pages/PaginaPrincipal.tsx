import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography } from "@material-ui/core";
import { ColDef, DataGrid, ValueFormatterParams } from "@material-ui/data-grid";
import { Cancel, Schedule, Send, Delete, Edit } from "@material-ui/icons";
import moment from "moment";

export default function PaginaPrincipal() {
	const colunas: ColDef[] = [
		{ field: "id", headerName: "Código", width: 100 },
		{ field: "agendamento_dataHorario", headerName: "Data e Hora", width: 200 },
		{ field: "paciente_nome", headerName: "Paciente", width: 290 },
		{ field: "medico_nome", headerName: "Médico", width: 290 },
		{ field: "medico_especialidade", headerName: "Especialidade", width: 250 },
		{
			field: "",
			headerName: "Ações",
			renderCell: (params: ValueFormatterParams) => (
				<div>
					<IconButton onClick={() => editarAgendamento(params.data.id)} color="default" title="Editar agendamento">
						<Edit />
					</IconButton>
					<IconButton onClick={() => excluirAgendamento(params.data.id)} color="secondary" title="Excluir agendamento">
						<Delete />
					</IconButton>
				</div>
			),
		},
	];

	const [dialog, setDialog] = useState(false);

	const abrirDialog = () => {
		setDialog(true);
	};

	const fecharDialog = () => {
		setDialog(false);
	};

	const [agendamentos, setAgendamentos] = useState([]);

	const [listaPacientes, setListaPacientes] = useState([]);

	const [paciente, setPaciente] = useState("");

	const mudarPaciente = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPaciente(event.target.value);
	};

	const [listaMedicos, setListaMedicos] = useState([]);

	const [medico, setMedico] = useState("");

	const mudarMedico = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMedico(event.target.value);
	};

	const [dataHorario, setDataHorario] = useState("");

	const mudarDataHorario = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDataHorario(event.target.value);
	};

	useEffect(() => {
		Axios.get("http://localhost:3333/agendamento-consultas/agendamentos").then((response) => {
			setAgendamentos(response.data);
		});

		Axios.get("http://localhost:3333/agendamento-consultas/pacientes").then((response) => {
			setListaPacientes(response.data);
		});

		Axios.get("http://localhost:3333/agendamento-consultas/medicos").then((response) => {
			setListaMedicos(response.data);
		});
	}, []);

	const salvarAgendamento = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		Axios.post("http://localhost:3333/agendamento-consultas/novo-agendamento", {
			dataHorario: moment(dataHorario).format("DD/MM/YYYY HH:mm"),
			idPaciente: paciente,
			idMedico: medico,
		})
			.then((response) => {
				console.log(response.data);
				fecharDialog();
			})
			.catch((erro) => {
				console.log(erro);
			});
	};

	const excluirAgendamento = (id: any) => {
		Axios.delete(`http://localhost:3333/agendamento-consultas/excluir-agendamento/${id}`)
			.then((response) => {
				console.log(response.data);
			})
			.catch((erro) => {
				console.log(erro);
			});
	};

	const editarAgendamento = (id: any) => {};

	return (
		<div>
			<Container>
				<Typography variant="h4" align="center">
					Agendamento de Consultas
				</Typography>
				<br />
				<Button onClick={abrirDialog} variant="contained" color="primary" startIcon={<Schedule />}>
					Agendar consulta
				</Button>
				<br />
				<br />
				<DataGrid rows={agendamentos} columns={colunas} pageSize={10} autoHeight />
			</Container>
			<Dialog open={dialog} onClose={fecharDialog} maxWidth={"md"} fullWidth>
				<DialogTitle>Agendar consulta</DialogTitle>
				<form onSubmit={salvarAgendamento}>
					<DialogContent>
						<TextField select label="Paciente" value={paciente} required onChange={mudarPaciente} margin="dense" fullWidth variant="outlined">
							{listaPacientes.map((opcao: any) => (
								<MenuItem key={opcao.paciente_id} value={opcao.paciente_id}>
									{opcao.paciente_nome}
								</MenuItem>
							))}
						</TextField>
						<TextField select label="Médico" value={medico} required onChange={mudarMedico} margin="dense" fullWidth variant="outlined">
							{listaMedicos.map((opcao: any) => (
								<MenuItem key={opcao.medico_id} value={opcao.medico_id}>
									{opcao.medico_especialidade} | {opcao.medico_nome}
								</MenuItem>
							))}
						</TextField>
						<TextField onChange={mudarDataHorario} required label="Data e Hora" type="datetime-local" InputLabelProps={{ shrink: true }} margin="dense" fullWidth variant="outlined" />
					</DialogContent>
					<DialogActions>
						<Button onClick={fecharDialog} color="default" endIcon={<Cancel />} variant="contained">
							Cancelar
						</Button>
						<Button type="submit" color="primary" endIcon={<Send />} variant="contained">
							Salvar
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	);
}
