import {Schema,model}  from 'mongoose'

const Subject = new Schema({
    name: String,
    status_id: String,
    createdAt: Date
})

export default model('Subject',Subject)   