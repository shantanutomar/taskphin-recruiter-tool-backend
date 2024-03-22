import { ISkillRequest, ISkillResponse } from './skillTypes';

export interface ICandidateRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    expectedSalary: number;
    skills: ISkillRequest[];
}

export interface ICandidateResponse {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    expectedSalary: number;
    computedScore: number;
    skills: ISkillResponse[];
}
