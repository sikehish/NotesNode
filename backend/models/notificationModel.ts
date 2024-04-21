import mongoose, { Schema, Document } from 'mongoose';

interface Notification extends Document {
  year: number;
  semester: number;
  branch:string;
  message: string
}


const notificationSchema: Schema = new Schema({
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  courseCode: { type: String, required: true },
  heading: { type: String, required: true },
  documentUrl: { type: String, required: true }
},{
  timestamps: true
});


const NotificationModel = mongoose.model<Notification>('Note', notificationSchema);

export default NotificationModel
