import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length } from "class-validator";

@Entity()
export class Agendamento {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	idPaciente: number;

	@Column()
	idMedico: number;

	@Column()
	@Length(1, 255)
	dataHorario: string;
}
