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
    totalPoints: {
      type: Number,
      default: 0, // Users start with 0 points
    },
  },
  { collection: "users_list" }
);

// Method to update points based on task priority
UserSchema.methods.addPoints = async function (priority) {
  let points = 0;

  switch (priority) {
    case "low":
      points = 10;
      break;
    case "medium":
      points = 20;
      break;
    case "high":
      points = 30;
      break;
    default:
      throw new Error("Invalid priority");
  }

  this.totalPoints += points;
  await this.save(); // Save the updated user document to the database
};

const User = mongoose.model("User", UserSchema);

export default User;
