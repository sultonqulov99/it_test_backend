import {Schema,model}  from 'mongoose'

const Key_ball = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    subject_id:String,
    key: Number,
    ball:Number,
    attempts:Number,
    createdAt: Date
})

export default model('Key_ball',Key_ball)   