import express from 'express';
import { downloadFile, getAssignments, getNotes, getNotifications } from '../controllers/userController';

const router = express.Router();

router.get('/notes', getNotes);
router.get('/assignments', getAssignments);
router.get('/download/:filename', downloadFile);
router.get('/notifications', getNotifications);

export default router;