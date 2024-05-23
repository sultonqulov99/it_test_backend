import {Schema,model}  from 'mongoose'

const Admin = new Schema({
    contact: String,
    password: String,
    role:String,
    img:String,
    username:String,
    createdAt: Date
})

export default model('Admin',Admin)   