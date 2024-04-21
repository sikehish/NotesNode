import express from 'express';
import { adminLogin, deleteAssignment, deleteNotes, editAssignment, editNote, upload, uploadAssignment, uploadNote, uploadNotification } from '../controllers/adminController';
import { checkAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/upload-notes', checkAuth, upload.single('document'),uploadNote);
router.post('/upload-assignments',checkAuth,  upload.single('document'),uploadAssignment);
router.post('/upload-notifications',checkAuth, uploadNotification);
router.delete('/delete-assignments/:id',checkAuth, deleteAssignment);
router.delete('/delete-notes/:id',checkAuth, deleteNotes);
router.patch('/edit-notes/:id', editNote)
router.patch('/edit-assignments/:id', editAssignment)


export default router;