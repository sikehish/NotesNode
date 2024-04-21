import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Notes from '../models/notesModel';
import Assignments from '../models/assignmentsModel';
import Notifications from '../models/notificationModel';
import multer, { StorageEngine } from 'multer';
import  fs from "fs"


const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PW;
const jwtSecret = process.env.JWT_KEY || '';

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("IN ADMIN LOGIN")
  console.log(email, password, adminEmail, adminPassword)

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, jwtSecret);

  res.status(200).json({ message: 'Login successful', data:{email: adminEmail, token} });
};

export const uploadNote = async (req: Request, res: Response): Promise<void> => {
  const { year, semester, courseCode, heading, branch } = req.body;
  // console.log(year, semester, courseCode, heading, req.file)
  const documentUrl=req.file?.filename
  if (!year || !semester || !courseCode || !heading.trim() || !documentUrl || !branch) {
    res.status(400).json({ status: 'fail', message: 'All fields are required' });
    return
  }
  try {
    const newNote = await Notes.create({ year, semester, courseCode, heading: heading.trim(), documentUrl, branch });
    res.status(201).json({ status: 'success', data: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const uploadAssignment = async (req: Request, res: Response): Promise<void> => {
  console.log("hhshshsh")
  const { year, semester, courseCode, heading, branch, deadline } = req.body;
  const documentUrl=req.file?.filename
  if (!year || !semester || !courseCode || !heading.trim() || !documentUrl || !branch || !deadline) {
       res.status(400).json({ status: 'fail', message: 'All fields are required' });
       return
  }
  try {
      const newAssignment = await Assignments.create({ year, semester, courseCode, heading: heading.trim(), documentUrl, branch, deadline });
      res.status(201).json({ status: 'success', data: newAssignment });
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const deleteNotes = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const note = await Notes.findById(id);
    if (!note) {
      res.status(404).json({ status: 'fail', message: 'Note not found' });
      return;
    }
    const filePath = `uploads/${note.documentUrl}`;
    fs.unlinkSync(filePath);

    await Notes.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const assignment = await Assignments.findById(id);
    if (!assignment) {
      res.status(404).json({ status: 'fail', message: 'Assignment not found' });
      return;
    }
    const filePath = `uploads/${assignment.documentUrl}`;
    fs.unlinkSync(filePath);

    await Assignments.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};



export const editNote = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { heading, courseCode } = req.body;
  if (!heading.trim() && !courseCode.trim()) {
    res.status(400).json({ status: 'fail', message: 'Heading or course code is required for update' });
    return;
  }

  try {
    const updateFields: any = {};
    if (heading.trim()) updateFields['heading'] = heading.trim();
    if (courseCode) updateFields['courseCode'] = courseCode.trim();

    const updatedNote = await Notes.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedNote) {
      res.status(404).json({ status: 'fail', message: 'Note not found' });
      return;
    }

    res.status(200).json({ status: 'success', message: 'Note updated successfully', data: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const editAssignment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { heading, courseCode, deadline } = req.body;
  // console.log(deadline, heading, courseCode)
  if (!heading.trim() && !courseCode.trim() && !deadline) {
    res.status(400).json({ status: 'fail', message: 'Heading or course code is required for update' });
    return;
  }

  try {
    const updateFields: any = {};
    if (heading.trim()) updateFields['heading'] = heading.trim();
    if (courseCode) updateFields['courseCode'] = courseCode.trim();
    if (deadline) updateFields['deadline'] = deadline

    const updatedAssignment = await Assignments.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedAssignment) {
      res.status(404).json({ status: 'fail', message: 'Assignment not found' });
      return;
    }

    res.status(200).json({ status: 'success', message: 'Assignment updated successfully', data: updatedAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};


export const uploadNotification = async (req: Request, res: Response): Promise<void> => {
  const branchCodes=["CS","IS","ME","CV","CSBS","BT","PST","CTM","ECE","EE","EI"]
  const { semester, branch, message } = req.body;
  if ( !semester || !message.trim() || !branch) {
       res.status(400).json({ status: 'fail', message: 'All fields are required' });
       return
  }
  try {
      const newNotification = await Notifications.create({ semester, branch, message: message.trim() });
      res.status(201).json({ status: 'success', data: newNotification });
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const notification = await Notifications.findById(id);
    if (!notification) {
      res.status(404).json({ status: 'fail', message: 'Notification not found' });
      return;
    }
;

    await Notifications.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};