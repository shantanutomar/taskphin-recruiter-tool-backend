import express from 'express';
import {
    addCandidate,
    deleteCandidate,
    getAllCandidates,
    getCandidateDetails,
    updateCandidate,
} from '../controllers/candidateController';

const router = express.Router();

router.get('/list', getAllCandidates);
router.post('/create', addCandidate);
router.get('/:id', getCandidateDetails);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

export default router;
