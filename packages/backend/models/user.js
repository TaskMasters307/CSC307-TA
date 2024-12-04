import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    
    username: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length <= 0)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length <= 0)
          throw new Error("Invalid job, must be at least 2 characters.");
      },
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }],
    statistics: {
      tasksCompleted: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      totalPoints: { type: Number, default: 0 }
    }
  },
  { collection: "users_list" }
);

const User = mongoose.model("User", UserSchema);

export default User;
