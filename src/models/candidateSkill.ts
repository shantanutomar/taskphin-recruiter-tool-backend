import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/dbConfig';

export interface ICandidateSkillModel {
    _id?: string;
    candidate_id: string;
    name: string;
    years_of_experience: number;
}

export type ICandidateSkillCreationModel = Omit<ICandidateSkillModel, '_id'>;

class CandidateSkill
    extends Model<ICandidateSkillModel>
    implements ICandidateSkillModel
{
    public _id!: string;
    public candidate_id!: string;
    public name!: string;
    public years_of_experience!: number;
}

CandidateSkill.init(
    {
        _id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        candidate_id: {
            type: DataTypes.UUID,
            references: { model: 'candidates', key: '_id' },
            allowNull: false,
        },
        name: {
            type: new DataTypes.STRING(256),
            allowNull: false,
        },
        years_of_experience: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: 'candidate_skills',
        sequelize: sequelize,
    },
);

export default CandidateSkill; //
