import mongoose, { Schema, Document } from 'mongoose';

interface Note extends Document {
  year: number;
  semester: number;
  courseCode: string;
  heading: string;
  documentUrl: string;
}


const noteSchema: Schema = new Schema({
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  courseCode: { type: String, required: true },
  heading: { type: String, required: true },
  documentUrl: { type: String, required: true }
},{
  timestamps: true
});


const NoteModel = mongoose.model<Note>('Note', noteSchema);

export default NoteModel
