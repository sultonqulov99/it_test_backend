import {Schema,model}  from 'mongoose'

const Level = new Schema({
    user_id: String,
    subject_id: String,
    level:Number,
    createdAt: Date
})

export default model('Level',Level)   