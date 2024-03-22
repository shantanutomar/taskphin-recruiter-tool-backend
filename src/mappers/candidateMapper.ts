import { ICandidateCreationModel, ICandidateModel } from '../models/candidate';
import { ICandidateRequest, ICandidateResponse } from '../types/candidateTypes';
import { ICandidateSkillModel } from '../models/candidateSkill';

export const toCandidateResponse = (
    candidate: ICandidateModel,
    skills: ICandidateSkillModel[],
    computedScore: number,
): ICandidateResponse => {
    return {
        id: candidate._id,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,
        expectedSalary: candidate.expected_salary,
        computedScore,
        skills: skills.map((skill) => ({
            id: skill._id as string,
            name: skill.name,
            yearsOfExperience: skill.years_of_experience,
        })),
    };
};

export const toCandidateModel = (
    candidate: ICandidateRequest,
): ICandidateCreationModel => {
    return {
        first_name: candidate.firstName,
        last_name: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,
        expected_salary: candidate.expectedSalary,
    };
};

export const toAllCandidatesResponse = (
    candidate: ICandidateModel,
    skills: ICandidateSkillModel[],
    computedScore: number,
): ICandidateResponse => {
    return {
        id: candidate._id,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        phone: candidate.phone,
        status: candidate.status,
        expectedSalary: candidate.expected_salary,
        computedScore,
        skills: skills.map((skill) => ({
            id: skill._id as string,
            name: skill.name,
            yearsOfExperience: skill.years_of_experience,
        })),
    };
};
