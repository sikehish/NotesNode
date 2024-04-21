import express from 'express';
import { adminLogin, deleteAssignment, deleteNotes, deleteNotification, editAssignment, editNote, upload, uploadAssignment, uploadNote, uploadNotification } from '../controllers/adminController';
import { checkAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/upload-notes', checkAuth, upload.single('document'),uploadNote);
router.post('/upload-assignments',checkAuth,  upload.single('document'),uploadAssignment);
router.delete('/delete-assignments/:id',checkAuth, deleteAssignment);
router.delete('/delete-notes/:id',checkAuth, deleteNotes);
router.patch('/edit-notes/:id', editNote)
router.patch('/edit-assignments/:id', editAssignment)
router.post('/create-notification',checkAuth, uploadNotification);
router.delete('/delete-notification/:id', deleteNotification)


export default router;