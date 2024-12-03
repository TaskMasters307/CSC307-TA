import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Task title is required'] 
    },
    date: { 
        type: String, 
        required: [true, 'Task date is required'] 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], // Add allowed values for priority
        default: 'low' 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User ID is required'] 
    },
}, { timestamps: true }); // Add timestamps to track creation and updates

const Task = mongoose.model('Task', TaskSchema);

export default Task;