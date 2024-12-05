import mongoose from "mongoose";
import userModel from "./user.js"
import 'dotenv/config';


mongoose.set("debug", true);

mongoose
  .connect("mongodb+srv://csc-307-ta:csc307ta@csc-307-ta.j0i3u.mongodb.net/hashPassword?retryWrites=true&w=majority&appName=CSC-307-TA", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .catch((error) => console.log("cant connect to mongodb\nERROR say:\n" , error));


function getUsers(username, password) {
  let promise;
  if (username === undefined && password === undefined) {
    promise = userModel.find();
  } else if (username && !password) {
    promise = findUserByName(username);
  } else if (password && !username) {
    promise = findUserByJob(password);
  }
  else if (password && username) {
    promise = findUserNameAndJob(username, password);
  }
  return promise;
}

function findOneAccount(username, password) {

  if (username === undefined || password === undefined) {
    return null;
  }
  else {
    return userModel.findOne({"username" : username, "password" : password} );
  }

}

function findUserNameAndJob(name, job) {
  return userModel.findOne({name: name , job: job});
}
function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  console.log("adding user: ", user)
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(username) {
  return userModel.findOne({ "username": username });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUser(id) {
  return userModel.findByIdAndDelete(id);
}

async function updateUserStats(userId, updates) {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update statistics
    user.statistics = {
      ...user.statistics,
      ...updates
    };

    // Save and return updated user
    return await user.save();
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

async function getUserStats(userId) {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      username: user.username,
      ...user.statistics
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUser,
  findOneAccount,
  updateUserStats,
  getUserStats
};
