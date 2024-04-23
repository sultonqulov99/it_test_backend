import {Schema,model}  from 'mongoose'

const Status = new Schema({
    name: String,
    createdAt: Date
})

export default model('Status',Status)  