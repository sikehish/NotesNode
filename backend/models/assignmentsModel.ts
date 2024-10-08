import mongoose, { Document, Schema } from "mongoose";

interface Assignment extends Document {
    year: number;
    branch: string;
    semester: number;
    courseCode: string;
    heading: string;
    documentUrl: string;
    deadline: Date; 
}
  
const assignmentSchema: Schema = new Schema({
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    courseCode: { type: String, required: true },
    heading: { type: String, required: true },
    documentUrl: { type: String, required: true },
    deadline: { type: Date, required: true } 
},{
    timestamps: true
});
  
const AssignmentModel = mongoose.model<Assignment>('Assignment', assignmentSchema);

export default AssignmentModel;
