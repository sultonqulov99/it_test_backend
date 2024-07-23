import {Schema,model}  from 'mongoose'

const User = new Schema({
    name:String,
    surname:String,
    region : String,
    status_id: String,
    password: String,
    contact:String,
    img:String,
    createdAt: Date
})

export default model('User',User)   