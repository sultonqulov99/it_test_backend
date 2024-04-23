import {Schema,model}  from 'mongoose'

const Answer_test = new Schema({
    user_id:String,
    question_test_id:String,
    chosen_answer:String,
    createdAt: Date
}) 
export default model('Answer_test',Answer_test)   