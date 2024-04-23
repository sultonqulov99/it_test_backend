import {Schema,model}  from 'mongoose'

const Question_test = new Schema({
    level:String,
    test_text:String,
    subject_id:String,
    correct_answer:String,
    additive_answer:[String],
    createdAt: Date
})

export default model('Question_test',Question_test)   
