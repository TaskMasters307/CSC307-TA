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

      // Get all users sorted by points to calculate rank
      const allUsers = await userModel
            .find({})
            .sort({ 'statistics.totalPoints': -1 });

        // Calculate rank (add 1 because array index starts at 0)
      const userRank = allUsers.findIndex(u => 
         u._id.toString() === userId.toString()
      ) + 1;
    return {
      username: user.username,
      ...user.statistics,
      rank: userRank
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

async function getLeaderboard() {
  return userModel.find({}, { username: 1, "statistics.totalPoints": 1 })
      .sort({ "statistics.totalPoints": -1 })
      .limit(10); // Fetch top 10 users
}

async function getUserRank(userId) {
  try {
      // Get all users sorted by points
      const users = await userModel.find({})
          .sort({ 'statistics.totalPoints': -1 });
      
      // Find the index of our user
      const userIndex = users.findIndex(user => user._id.toString() === userId);
      
      // Return rank (index + 1) if found, otherwise return null
      return userIndex !== -1 ? userIndex + 1 : null;
  } catch (error) {
      console.error('Error getting user rank:', error);
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
  getUserStats,
  getLeaderboard,
  getUserRank
};
