import {Schema,model}  from 'mongoose'

const Contact = new Schema({
    user_id: String,
    fullName: String,
    contact:String,
    text:String,
    createdAt: Date
})

export default model('Contact',Contact)   