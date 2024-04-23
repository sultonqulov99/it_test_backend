import {Schema,model}  from 'mongoose'

const Answer_img = new Schema({
    user_id:String,
    question_img_id:String,
    chosen_answer:String,
    createdAt: Date
})

export default model('Answer_img',Answer_img)   
