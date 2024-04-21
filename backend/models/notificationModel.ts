import mongoose, { Schema, Document } from 'mongoose';

interface Notification extends Document {
  year: number;
  semester: number;
  branch:string;
  message: string
}


const notificationSchema: Schema = new Schema({
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  message: { type: String, required: true },
},{
  timestamps: true
});


const NotificationModel = mongoose.model<Notification>('Notification', notificationSchema);

export default NotificationModel
