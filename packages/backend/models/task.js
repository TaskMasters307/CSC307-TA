import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    points: {
      type: Number,
      required: true,
      default: function() {
        switch (this.priority) {
          case 'low':
            return 10;
          case 'medium':
            return 20;
          case 'high':
            return 30;
          default:
            return 0;
        }
      }
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;