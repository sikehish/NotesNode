import express from 'express';
import { adminLogin, getAssignments, getNotes, upload, uploadAssignment, uploadNote } from '../controllers/adminController';
import { checkAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/upload-notes', checkAuth, upload.single('document'),uploadNote);
router.post('/upload-assignments',checkAuth,  upload.single('document'),uploadAssignment);

export default router;