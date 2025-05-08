import mongoose, { Schema, Document, model, models } from "mongoose";

export interface HabitDocument extends Document {
  title: string;
  completed: boolean;
  userId: string;
}

const HabitSchema = new Schema<HabitDocument>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
});

export default models.Habit || model<HabitDocument>("Habit", HabitSchema);
