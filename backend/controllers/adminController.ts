import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Notes from '../models/notesModel';
import Assignments from '../models/assignmentsModel';
import multer, { StorageEngine } from 'multer';


const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PW;
const jwtSecret = process.env.JWT_SECRET || '';

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password, adminEmail, adminPassword)

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', data:{email: adminEmail, token} });
};

export const uploadNote = async (req: Request, res: Response): Promise<void> => {
  const { year, semester, courseCode, heading } = req.body;
  console.log(year, semester, courseCode, heading, req.file)
  const documentUrl=req.file?.filename
  if (!year || !semester || !courseCode || !heading || !documentUrl) {
    res.status(400).json({ status: 'fail', message: 'All fields are required' });
    return
  }
  try {
    const newNote = await Notes.create({ year, semester, courseCode, heading, documentUrl });
    res.status(201).json({ status: 'success', data: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

// Controller to upload a new assignment
export const uploadAssignment = async (req: Request, res: Response): Promise<void> => {
  console.log("hhshshsh")
  const { year, semester, courseCode, heading } = req.body;
  const documentUrl=req.file?.filename
  if (!year || !semester || !courseCode || !heading || !documentUrl) {
       res.status(400).json({ status: 'fail', message: 'All fields are required' });
       return
  }
  try {
      const newAssignment = await Assignments.create({ year, semester, courseCode, heading, documentUrl });
      res.status(201).json({ status: 'success', data: newAssignment });
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};
