import { InternalServerError } from "../utils/errors.js";
import Question_test from "../model/question_test.js";
import Question_img from "../model/question_img.js";
import Answer_test from "../model/answer_test.js";
import Key_ball from "../model/key_ball.js";

const POST_QUESTION = async (req, res, next) => {
  try {
    const { level, test_text, subject_id, correct_answer, additive_answer } =req.body;
    // console.log(234,additive_answer)

    let newQuestion = new Question_test({
      level,
      test_text,
      subject_id,
      correct_answer,
      additive_answer,
    });

    await newQuestion.save();

    return res.status(201).json({
      status: 201,
      massage: "Test succasfully added",
      data: newQuestion,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const POST_ANSWER = async (req, res, next) => {
  try {
    let { id, subject_id } = req.query;
    let { question_test_id, chosen_answer } = req.body;
    let test;
    let tests = await Question_test.find();
    for (const el of tests) {
      test = tests.find((el) => el._id.toString() == question_test_id);
    }

    let key_ball = await Key_ball.findOne({
      $and: [{ user_id: id }, { subject_id: subject_id }],
    }).lean();
    let key = key_ball ? key_ball.key : 0;
    let ball = key_ball ? key_ball.ball + 5 : 5;
    if (test.correct_answer.toLowerCase() == chosen_answer.toLowerCase()) {
      if (!key_ball) {
        let newKey_ball = new Key_ball({
          user_id: id,
          subject_id,
          key,
          ball,
        });
        await newKey_ball.save();
      }

      await Key_ball.findByIdAndUpdate(key_ball._id, {
        ...key_ball,
        key,
        ball,
      });
    }

    let newAnswer = new Answer_test({
      user_id: id,
      question_test_id,
      chosen_answer,
    });

    await newAnswer.save();

    return res.status(201).json({
      status: 201,
      massage: "Test answer succasfully added",
      data: newAnswer,
      correct:
        test.correct_answer.toLowerCase() == chosen_answer.toLowerCase()
          ? true
          : false,
      key,
      ball,
    });
  } catch (error) {
    return next(new InternalServerError(500, error));
  }
};
const GET = async (req, res, next) => {
  try {
    let { level, subject_id } = req.query;
    let test = await Question_test.find({
      $and: [{ level: level }, { subject_id: subject_id }],
    }).lean();

    return res.status(200).json({
      status: 200,
      massage: "OK",
      data: test,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const GET_TEST = async (req, res, next) => {
  try {
    let question_test = await Question_test.find().lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: question_test,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const DELETE = async (req, res, next) => {
  try {
    const { testId } = req.params;
    let deleteTest = await Question_test.findOneAndRemove({ _id: testId });
    if (!deleteTest) {
      return res.status(400).json({
        status: 400,
        message: "Malumot o'chirilmadi",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Malumot o'chirildi",
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const UPDATE = async (req, res, next) => {
  try {
    let { id } = req.params;
    let {test_text,correct_answer,additive_answer,subject_id} = req.body
    let test = await Question_test.findById({ _id: id });
    if (!test) {
      return res.status(404).json({
        status: 404,
        massage: "Test savoli topilmadi",
        data: null,
      });
    }
    let testQuestionUpdate = await Question_test.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          test_text: test_text,
          subject_id: subject_id,
          correct_answer: correct_answer,
          additive_answer: additive_answer
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      massage: "update test question",
      data: testQuestionUpdate,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

export default {
  POST_QUESTION,
  POST_ANSWER,
  GET,
  GET_TEST,
  DELETE,
  UPDATE,
};
