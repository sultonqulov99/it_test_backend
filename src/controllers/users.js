import nodemailer from 'nodemailer'
import {InternalServerError} from "../utils/errors.js"
import JWT from 'jsonwebtoken'
import sha256 from 'sha256'
import User from '../model/users.js'
import Key_ball from '../model/key_ball.js'
import Subject from '../model/subjects.js'
import Status from '../model/status.js'
import Level from '../model/level.js'
import path from "path"

function emailSender(userEmail,email_code){
  let res = true
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        
        auth: {
          user: 'omonov2006omonov@gmail.com', 
          pass: 'wkocegbefwfizukv'
        }
      });
    const mailOptions = {
        from: 'omonov2006omonov@gmail.com', 
        to: userEmail,
        subject: 'Tasdiqlash kodi',
        text: `Sizning tasdiqlash kod: ${email_code}`
      };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res = false
        } else {
          console.log('Xabar yuborildi: ' + info.response);
          res = true
        }
      });
    return res
}


const POST = async(req,res,next) => {
    try {
        let key = 0
        let ball = 0
        let attempts = 0
        let contact = "+998 --- -- --"
        let img = "itLive.jpg"
        const email_code = Math.floor(Math.random() * 10000);
        let {name,surname,status_id,password,email} = req.body
        password = sha256(password)
    
        let login = await User.findOne({email}).lean()
        if(login){
          return res.status(409).json({
            status:409,
            massage: "User already exists"
          })
        }
        if(emailSender(email,email_code)){
          let newUser = new User({
            name,
            surname,
            status_id,
            password,
            email,
            email_code,
            contact,
            img
          })
  
          await newUser.save()

          let newKey_ball = new Key_ball({
            user_id:newUser._id,
            subject_id:null,
            key,
            ball,
            attempts
          })
  
          await newKey_ball.save()

          return res.status(200).json({
            status:200,
            massage:"Confirm your email addres. We sent emailCode",
            data:newUser
        })  
        }
        return res.status(409).json({
          status:409,
          message:"Error"
        })
    } catch (error) {
      return next(new InternalServerError(500,error.massage))
    }
}
const GET = async(req,res,next)=>{
    try {
      let {emailCode} = req.params
      let user = await User.findOne({email_code:emailCode}).lean()
      if(!user){
        return res.status(404).json({
          status:404,
          massage:"No such email code exists",
        })
      }
      return res.status(200).json({
        status:200,
        massage:"Email found",
        token: JWT.sign({userId: user._id, statusId:user.status_id},'12345'),
      })
    } catch (error) {
      return next(new InternalServerError(500,error.massage))
    }
}

const GET_STATUS = async(req,res,next) => {
  try {
    let {statusId} = req.params
    let token_verify = JWT.verify(statusId,'12345')
    let subjects = await Subject.find({status_id:token_verify.statusId}).lean()
    if(!subjects){
      return res.status(404).json({
        status:404,
        massage:"Status not found",
        data:[]
      })
    }
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:subjects
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}
const POST_LOGIN = async(req,res,next) =>{
    try {
      let {email,password} = req.body 
      password = sha256(password)

      let user = await User.findOne({
        $and: [{ email: email }, { password: password }],
      });

      if(!user){
        return res.status(404).json({
          status:404,
          massage:"User not found"
        })
      }
      return res.status(200).json({
        status:200,
        massage:user,
        token: JWT.sign({userId: user._id,statusId:user.status_id},'12345'),
      })
    } catch (error) {
      return next(new InternalServerError(500,error.massage))
    }
}
const POST_STATUS = async(req,res,next) => {
  try {
    let {name} = req.body
    let newStatus = new Status({
        name
    })
    await newStatus.save()

    return res.status(201).json({
      status:201,
      massage:"Status succass added",
      data:newStatus
  })   
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const POST_SUBJECT = async(req,res,next) => {
  try {
    let level = 1
    let {name,status_id} = req.body
    status_id.toString()
    let newSubject = new Subject({
      name,
      status_id,
      level
    })

    await newSubject.save()

    return res.status(201).json({
      status:201,
      massage:"Subject succass added",
      data:newSubject
  })   
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const GET_USERS = async(req,res,next) => {
  try {
    let users = await User.find().lean()
    return res.status(200).json({
      status:200,
      massage:"All users",
      data:users
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}
const GET_USER = async(req,res,next) => {
  try {
    let {u_id} = req.params
    let user = await User.findOne({_id:u_id}).lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:user
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const get_STATUS = async(req,res,next) => {
  try {
    let {statusId} = req.params
    let status = await Status.findOne({_id:statusId}).lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:status
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}
const TOKEN_VERIFY = (req,res,next) => {
  try {
    let {token} = req.query
    let token_verify = JWT.verify(token,'12345')
    
    if(token_verify){
        return res.status(200).json({
          status:200,
          massage:"OK",
        })
    }
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}



const STATUS = async(req,res,next) => {
  try {
    let status = await Status.find().lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:status
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const SUBJECT = async(req,res,next) => {
  try {
    let { subjectName } = req.params
    let subject = await Subject.findOne({name : subjectName}).lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:subject
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const KEY_BALL = async(req,res,next)=>{
  try {
    let { id,subject_id } = req.query
    let user = await Key_ball.findOne({$and: [{ user_id: id }, { subject_id: subject_id }],}).lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:user
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const KEY_UPDATE = async(req,res,next)=>{
  try {
    let { id,subject_id } = req.query
    let user = await Key_ball.findOne({$and: [{ user_id: id }, { subject_id: subject_id }],}).lean()
    if(user.key > 0){
      let key = user.key - 1
      let ball = user.ball

      await Key_ball.findByIdAndUpdate(user._id,{...user,key,ball})

      return res.status(200).json({
        status:200,
        massage:"ok",
        data:user
      })
    }
    return res.status(404).json({
      status:404,
      massage:"Not found",
      data:user
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const ATTEMPTS_UPDATE = async(req,res,next) => {
  try {
    let {id,subject_id} = req.query
    let user = await Key_ball.findOne({$and: [{ user_id: id }, { subject_id: subject_id }],}).lean()
    let attempts = user.attempts + 1
     let s = await Key_ball.findByIdAndUpdate(user._id,{...user,attempts})
      return res.status(200).json({
        status:200,
        massage:"ok",
        data:user
      })
    
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const SUBJECT_UPDATE = async(req,res,next) => {
  try {
    let {id,subject_id} = req.query
    
    let u_subject = await Key_ball.findOne({subject_id : null})
    let user = await Key_ball.findOne({$and: [{ user_id: id }, { subject_id: subject_id }],}).lean()
    if(user || u_subject){
      let us = user ? user : u_subject
      let s = await Key_ball.findByIdAndUpdate(us._id,{...user,subject_id})
      return res.status(200).json({
        status:200,
        massage:"update subject id",
        data:s
      })
    }
    else{
      let newKey_ball = new Key_ball({
        user_id:id,
        subject_id,
        key:0,
        ball:0,
        attempts:0
      })

      await newKey_ball.save()
      return res.status(200).json({
        status:200,
        massage:"Add new keyBall",
        data:newKey_ball
      })
    }
    
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}
const KEYS_BALLS = async(req,res,next)=>{
  try {
    let { id } = req.params
    let users = await Key_ball.find({user_id: id }).lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:users
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}
const USER_UPDATE = async(req,res,next) => {
  try {
    let {file} = req.files
    let img = Date.now() + file.name.replace(/\s/g,'')
    let {id,name,surname,contact,password} = req.body
    //console.log(id,name,surname,contact,password);
    let user = await User.findOne({_id:id}).lean()
    console.log(user);
    name = name ? name : user.name
    surname = surname ? surname : user.surname
    user.contact = "9989 (--) --- -- --"
    password = password ? password : user.password
    console.log(12,user);
    let user_update = await User.findByIdAndUpdate(user._id,{...user,name,surname,password,contact})

    file.mv(path.join(process.cwd(),'src','uploads',img))
    return res.status(201).json({
        status:201,
        massage:"User succass update",
        data:user_update
    })
  } catch (error) {
    console.log(error);
    return next(new InternalServerError(500,error.massage))
  }
}
const get_SUBJECT = async(req,res,next) => {
  try{
    let {subject_id} = req.params
    let subject = await Subject.findOne({_id:subject_id}).lean()

    return res.status(200).json({
      status:200,
      massage:"ok",
      data:subject 
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const LEVEL_UPDATE = async(req,res,next) => {
  try {
    let {user_id,subject_id,level} = req.query
    if(level == "undefined"){
      {
        let level = 1
        let newLevel = new Level({
          user_id,
          subject_id,
          level
        })

        await newLevel.save()

        return res.status(201).json({
          status:201,
          massage:"added level",
          data:newLevel
        })
      }
    }
    let users = await Level.find({$or: [{ subject_id: null  }, { subject_id: subject_id }],}).lean()
    let user = users ? users.find(el => el.user_id == user_id) : ""
      if(user && level || level == 0){
        let s = await Level.findByIdAndUpdate(user._id,{...user,level})
        return res.status(200).json({
          status:200,
          massage:"update level",
          data:s
        })
      }
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}
const SUBJECT_ALL = async(req,res,next) => {
  try {
    let subject = await Subject.find().lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:subject
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const GET_LEVEL = async(req,res,next) => {
  try {
    let {user_id,subject_id} = req.query
    let level = await Level.find({$and: [{ user_id: user_id }, { subject_id: subject_id }],}).lean()
    return res.status(200).json({
      status:200,
      massage:"ok",
      data:level
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  } 
}

const DELETE_STATUS = async (req,res,next) => {
  try {
    const { statusId } = req.params
    let deleteStatus = await Status.findOneAndRemove({_id:statusId})
    if(!deleteStatus){
      return res.status(400).json({
        status:400,
        message:"Malumot o'chirilmadi"
      })
    }

    return res.status(200).json({
      status:200,
      message:"Malumot o'chirildi"
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const UPDATE_STATUS = async(req,res,next) => {
  try {
    const { statusId } = req.params
    const { name } = req.body

    let status = await Status.findById({_id:statusId})
    if(!status){
      return res.status(404).json({
        status:404,
        massage:"Status topilmadi",
        data:null
      })
    }
    let statusUpdate = await Status.findOneAndUpdate({_id:statusId},{$set : {name:name}},{new:true})

    return res.status(200).json({
      status:200,
      massage:"update Status",
      data:statusUpdate
    })

  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const DELETE_SUBJECT = async (req,res,next) => {
  try {
    const { subjectId } = req.params
    let deleteSubject = await Subject.findOneAndRemove({_id:subjectId})
    if(!deleteSubject){
      return res.status(400).json({
        status:400,
        message:"Malumot o'chirilmadi"
      })
    }

    return res.status(200).json({
      status:200,
      message:"Malumot o'chirildi"
    })
  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

const UPDATE_SUBJECT = async(req,res,next) => {
  try {
    const { subjectId } = req.params
    const { name } = req.body

    let subject = await Subject.findById({_id:subjectId})
    if(!subject){
      return res.status(404).json({
        status:404,
        massage:"subject topilmadi",
        data:null
      })
    }
    let subjectUpdate = await Subject.findOneAndUpdate({_id:subjectId},{$set : {name:name}},{new:true})

    return res.status(200).json({
      status:200,
      massage:"update subject",
      data:subjectUpdate
    })

  } catch (error) {
    return next(new InternalServerError(500,error.massage))
  }
}

export default {
    POST,
    GET,
    GET_STATUS,
    POST_LOGIN,
    POST_STATUS,
    POST_SUBJECT,
    GET_USERS,
    TOKEN_VERIFY,
    STATUS,
    SUBJECT,
    KEY_BALL,
    KEY_UPDATE,
    GET_USER,
    get_STATUS,
    ATTEMPTS_UPDATE,
    SUBJECT_UPDATE,
    KEYS_BALLS,
    USER_UPDATE,
    get_SUBJECT,
    LEVEL_UPDATE,
    SUBJECT_ALL,
    GET_LEVEL,
    DELETE_STATUS,
    UPDATE_STATUS,
    DELETE_SUBJECT,
    UPDATE_SUBJECT
}