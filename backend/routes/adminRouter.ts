import express from 'express';
import { adminLogin, upload, uploadAssignment, uploadNote } from '../controllers/adminController';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/upload-notes', upload.single('document'),uploadNote);
router.post('/upload-assignment', upload.single('document'),uploadAssignment);

export default router;