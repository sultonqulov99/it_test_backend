import path from 'path'
import {InternalServerError} from "../utils/errors.js"
import Question_img from '../model/question_img.js'
import Key_ball from '../model/key_ball.js'
import Answer_img from "../model/answer_img.js"
import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types;

const POST_QUESTION_IMG = async(req,res,next) => {
    try {
        let {file} = req.files
        let img = Date.now() + file.name.replace(/\s/g,'')

        const {question_text,level,subject_id,correct_answer} = req.body
         
        let newQuestion = new Question_img({
            img,
            level,
            subject_id,
            question_text,
            correct_answer
          })
  
          await newQuestion.save()
        
        file.mv(path.join(process.cwd(),'src','uploads',img))
        return res.status(201).json({
            status:201,
            massage:"Img question succasfully added",
            data:newQuestion
        })
    } catch (error) {
        console.log(error);
        return next(new InternalServerError(500,error.massage))
    }
}
const POST_ANSWER_IMG = async(req,res,next) =>{
    try {
        let {id,subject_id} = req.query
        let {question_img_id,chosen_answer} = req.body

        
        let test
        let tests =await Question_img.find()

        for (const el of tests) {
            test = tests.find(el => el._id.toString() == question_img_id)
        }
    
        
        let key_ball = await Key_ball.findOne({$and: [{ user_id: id }, { subject_id: subject_id }],}).lean()
        let key = key_ball ? key_ball.key + 1 : 0
        let ball = key_ball ? key_ball.ball : 0
        if(test.correct_answer.toLowerCase() == chosen_answer.toLowerCase()){
            if(!key_ball){
                let newKey_ball = new Key_ball({
                    user_id:id,
                    subject_id,
                    key,
                    ball,
                  })
                  await newKey_ball.save()
            }
            await Key_ball.findByIdAndUpdate(key_ball._id,{...key_ball,key,ball})

        }

        let newAnswer = new Answer_img({
            user_id:id,
            question_img_id,
            chosen_answer
          })
  
          await newAnswer.save()

        return res.status(201).json({
          status:201,
          massage:"Img answer succasfully added",
          data:newAnswer,
          correct:(test.correct_answer.toLowerCase() == chosen_answer.toLowerCase()) ? true : false,
          key,
          ball 
      })
    }catch (error) {
        return next(new InternalServerError(500,error))
    }
}

const GET = async(req,res,next)=>{
    try {
        let {level,subject_id} = req.query
        let tests = await Question_img.find({
            $and: [{ level: level }, { subject_id: subject_id }],
          }).lean();

        return res.status(200).json({
            status:200,
            massage:"OK",
            data:tests
        })
    } catch (error) {
        return next(new InternalServerError(500,error.massage))
    }
}

const GET_TESTIMG = async(req,res,next) => {
    try {
      let question_img = await Question_img.find().lean()
      return res.status(200).json({
        status:200,
        massage:"ok",
        data:question_img
      })
    } catch (error) {
      return next(new InternalServerError(500,error.massage))
    }
  }

  const DELETE = async (req,res,next) => {
    try {
      const { testImgId } = req.params
      let deleteTestImg = await Question_img.findOneAndRemove({_id:testImgId})
      if(!deleteTestImg){
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

  const UPDATE = async (req, res, next) => {
    try {
      let { id } = req.params;
      let {question_text,correct_answer,subject_id} = req.body
      let {file} = req.files
      
      let img = Date.now() + file.name.replace(/\s/g,'')
      let test = await Question_img.findById({ _id: id });
      
      if (!test) {
        return res.status(404).json({
          status: 404,
          massage: "Test img savoli topilmadi",
          data: null,
        });
      }
      let testQuestionUpdate = await Question_img.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            question_text: question_text,
            subject_id: subject_id,
            correct_answer: correct_answer,
            img:img
          },
        },
        { new: true }
      );
      file.mv(path.join(process.cwd(),'src','uploads',img))
      return res.status(200).json({
        status: 200,
        massage: "update test img question",
        data: testQuestionUpdate,
      });
    } catch (error) {
      return next(new InternalServerError(500, error.massage));
    }
  };

export default {
    POST_QUESTION_IMG,POST_ANSWER_IMG,GET,GET_TESTIMG,DELETE,UPDATE
}