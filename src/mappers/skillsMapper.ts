import { ISkillRequest } from '../types/skillTypes';
import { ICandidateSkillCreationModel } from '../models/candidateSkill';

export const toCandidateSkillModel = (
    candidateId: string,
    skill: ISkillRequest,
): ICandidateSkillCreationModel => {
    return {
        name: skill.name,
        candidate_id: candidateId,
        years_of_experience: skill.yearsOfExperience,
    };
};
