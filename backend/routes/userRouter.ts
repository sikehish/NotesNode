import express from 'express';
import {getAssignments, getNotes } from '../controllers/adminController';
import { downloadFile } from '../controllers/userController';

const router = express.Router();

router.get('/notes', getNotes);
router.get('/assignments', getAssignments);
router.get('/download/:filename', downloadFile);

export default router;