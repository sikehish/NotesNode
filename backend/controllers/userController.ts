import { Request, Response } from 'express';
import Notes from '../models/notesModel';
import Assignments from '../models/assignmentsModel';
import path from "path"

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  const { year, semester, branch } = req.query
  try {
    const notes = await Notes.find({ year, semester, branch }); 
    res.status(200).json({ status: 'success', data: notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  const { year, semester, branch } = req.query;
  try {
    const assignments = await Assignments.find({ year, semester, branch }); 
    res.status(200).json({ status: 'success', data: assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
};

export const downloadFile = (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ status: 'fail', message: 'Failed to download file' });
    }
  });
};

