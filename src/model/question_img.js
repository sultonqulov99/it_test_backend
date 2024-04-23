import {Schema,model}  from 'mongoose'

const Question_img = new Schema({
    img: String,
    level:String,
    subject_id:String,
    question_text: String,
    correct_answer:String,
    createdAt: Date
})

export default model('Question_img',Question_img)   
