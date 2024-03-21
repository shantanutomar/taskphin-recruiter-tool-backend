import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/dbConfig';
import CandidateSkill from './candidateSkill';

export interface ICandidateModel {
    _id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    expected_salary: number;
}

export type ICandidateCreationModel = Omit<ICandidateModel, '_id'>;
class Candidate extends Model<ICandidateModel> implements ICandidateModel {
    public _id!: string;
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public phone!: string;
    public status!: string;
    public expected_salary!: number;
}

Candidate.init(
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        first_name: {
            type: new DataTypes.STRING(256),
            allowNull: false,
        },
        last_name: {
            type: new DataTypes.STRING(256),
            allowNull: false,
        },
        email: {
            type: new DataTypes.STRING(500),
            allowNull: false,
        },
        phone: {
            type: new DataTypes.STRING(50),
            allowNull: false,
        },
        status: {
            type: new DataTypes.STRING(20),
            allowNull: false,
        },
        expected_salary: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: 'candidates',
        sequelize: sequelize,
    },
);

Candidate.hasMany(CandidateSkill, { foreignKey: 'candidate_id' });
CandidateSkill.belongsTo(Candidate, { foreignKey: 'candidate_id' });

export default Candidate;
