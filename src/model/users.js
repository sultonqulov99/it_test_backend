import {Schema,model}  from 'mongoose'

const User = new Schema({
    name:String,
    surname:String,
    email:String,
    status_id: String,
    password: String,
    email_code:Number,
    contact:String,
    img:String,
    action:String,
    createdAt: Date
})

export default model('User',User)   