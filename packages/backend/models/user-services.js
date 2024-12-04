import mongoose from "mongoose";
import userModel from "./user.js";
import taskModel from "./task.js";
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

function createTask(userId, task){
  const newTask = new taskModel({
    user: userId,
    ...task
  });
  return newTask.save().then((savedTask) => {
    return userModel.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } }, { new: true });
  });

}

function getUserTasks(userId) {
  return userModel.findById(userId).populate('tasks');
}

function updateTask(taskId, updatedTask) {
  return taskModel.findByIdAndUpdate(taskId, updatedTask, { new: true });
}

function deleteTask(taskId) {
  return taskModel.findByIdAndDelete(taskId);
}

function updateUserStatistics(userId, statistics) {
  return userModel.findByIdAndUpdate(userId, { $set: { statistics } }, { new: true });
}

function getUserStatistics(username) {
  return userModel.findOne({ username: username }, 'statistics');
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUser,
  findOneAccount,
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  updateUserStatistics,
  getUserStatistics
};
