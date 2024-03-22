import { Request, Response } from 'express';
import pool from '../database/dbConfig';
import Candidate, { ICandidateModel } from '../models/candidate';
import CandidateSkill, {
    ICandidateSkillCreationModel,
    ICandidateSkillModel,
} from '../models/candidateSkill';
import { ICandidateRequest, ICandidateResponse } from '../types/candidateTypes';
import {
    toCandidateModel,
    toCandidateResponse,
} from '../mappers/candidateMapper';
import { ISkillRequest } from '../types/skillTypes';
import { toCandidateSkillModel } from '../mappers/skillsMapper';
import sequelize from '../database/dbConfig';
import Sequelize from 'sequelize';

export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const allCandidates: ICandidateResponse[] = [];
        const candidates: ICandidateModel[] = await Candidate.findAll({
            order: [
                ['last_name', 'ASC'],
                ['first_name', 'ASC'],
            ],
        });

        for (const candidate of candidates) {
            const candidateSkills: ICandidateSkillModel[] =
                await CandidateSkill.findAll({
                    where: { candidate_id: candidate._id },
                });
            const computedScore = getComputedScore(candidateSkills);
            allCandidates.push(
                toCandidateResponse(candidate, candidateSkills, computedScore),
            );
        }

        return res.status(200).json(allCandidates);
    } catch (error) {
        console.error(error);
        res.status(500).send(
            `Error occurred while getting all candidates: ${error}`,
        );
    }
};

export const getCandidateDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const candidate: ICandidateModel | null = await Candidate.findByPk(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        const candidateSkills: ICandidateSkillModel[] =
            await CandidateSkill.findAll({ where: { candidate_id: id } });
        const computedScore = getComputedScore(candidateSkills);

        return res
            .status(200)
            .json(
                toCandidateResponse(candidate, candidateSkills, computedScore),
            );
    } catch (error) {
        console.error(error);
        res.status(500).send(
            `Error occurred while getting candidate details: ${error}`,
        );
    }
};

export const addCandidate = async (req: Request, res: Response) => {
    const candidateDetailsToAdd: ICandidateRequest = req.body;
    const transaction = await sequelize.transaction();
    try {
        const createdCandidate = await Candidate.create(
            toCandidateModel(candidateDetailsToAdd),
        );
        const candidateSkills: ICandidateSkillCreationModel[] =
            candidateDetailsToAdd.skills.map((skill: ISkillRequest) => {
                return toCandidateSkillModel(createdCandidate._id, skill);
            });
        const createdCandidateSkills: CandidateSkill[] =
            await CandidateSkill.bulkCreate(candidateSkills);
        await transaction.commit();

        const computedScore = getComputedScore(createdCandidateSkills);

        return res
            .status(200)
            .json(
                toCandidateResponse(
                    createdCandidate,
                    createdCandidateSkills,
                    computedScore,
                ),
            );
    } catch (error) {
        await transaction.rollback();
        return res
            .status(500)
            .json({ error: `Error occurred while adding candidate: ${error}` });
    }
};

export const updateCandidate = async (req: Request, res: Response) => {
    const { id } = req.params;
    const candidateDetailsToUpdate: ICandidateRequest = req.body;
    const transaction = await sequelize.transaction();
    try {
        const candidate = await Candidate.findByPk(id, { transaction });
        if (!candidate) {
            return res.status(404).send('Candidate not found');
        }
        await Candidate.update(toCandidateModel(candidateDetailsToUpdate), {
            where: { _id: id },
        });

        const skillsToUpdateOrAdd = candidateDetailsToUpdate.skills.map(
            (s) => s.id || '',
        );
        await CandidateSkill.destroy({
            where: {
                candidate_id: id,
                _id: { [Sequelize.Op.notIn]: skillsToUpdateOrAdd || [] },
            },
            transaction,
        });

        for (const skill of candidateDetailsToUpdate.skills) {
            if (skill.id) {
                await CandidateSkill.update(
                    { ...toCandidateSkillModel(candidate._id, skill) },
                    { where: { _id: skill.id, candidate_id: id }, transaction },
                );
            } else {
                await CandidateSkill.create(
                    { ...toCandidateSkillModel(candidate._id, skill) },
                    { transaction },
                );
            }
        }
        await transaction.commit();

        const updatedCandidateDetails = await Candidate.findByPk(candidate._id);
        const updatedCandidateSkills: ICandidateSkillModel[] =
            await CandidateSkill.findAll({ where: { candidate_id: id } });

        if (updatedCandidateDetails) {
            return res
                .status(200)
                .json(
                    toCandidateResponse(
                        updatedCandidateDetails,
                        updatedCandidateSkills,
                        getComputedScore(updatedCandidateSkills),
                    ),
                );
        }
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({
            error: `Error occurred while updating candidate: ${error}`,
        });
    }
};

export const deleteCandidate = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        await CandidateSkill.destroy({
            where: { candidate_id: id },
            transaction,
        });

        const isDeleted = await Candidate.destroy({
            where: { _id: id },
            transaction,
        });

        if (!isDeleted) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Candidate not found' });
        }
        await transaction.commit();

        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
        res.status(500).send(
            `Error occurred while deleting candidate: ${error}`,
        );
    }
};

const getComputedScore = (skills: ICandidateSkillModel[]): number => {
    let score = 0;
    skills.forEach((skill) => {
        if (skill.name.toLowerCase() === 'nodejs') {
            score +=
                skill.years_of_experience > 2
                    ? 3
                    : skill.years_of_experience >= 1
                      ? 2
                      : 1;
        } else if (skill.name.toLowerCase() === 'reactjs') {
            score +=
                skill.years_of_experience > 2
                    ? 3
                    : skill.years_of_experience >= 1
                      ? 2
                      : 1;
        }
    });

    return score;
};
