import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length <= 0)
                    throw new Error(
                        'Invalid job, must be at least 2 characters.'
                    )
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                if (value.length <= 0)
                    throw new Error(
                        'Invalid job, must be at least 2 characters.'
                    )
            },
        },
    },
    { collection: 'users_list' }
)

const User = mongoose.model('User', UserSchema)

export default User
