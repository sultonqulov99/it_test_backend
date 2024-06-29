import { InternalServerError } from "../utils/errors.js";
import JWT from "jsonwebtoken";
import sha256 from "sha256";
import User from "../model/users.js";
import Key_ball from "../model/key_ball.js";
import Subject from "../model/subjects.js";
import Status from "../model/status.js";
import Level from "../model/level.js";
import Question_test from "../model/question_test.js";
import Question_img from "../model/question_img.js";
import Contact from "../model/contact.js";
import path from "path";

const POST = async (req, res, next) => {
  try {
    let key = 0;
    let ball = 0;
    let attempts = 0;
    let { name, surname, status_id, password, contact } = req.body;
    password = sha256(password);

    let login = await User.findOne({ contact }).lean();
    if (login) {
      return res.status(409).json({
        status: 409,
        massage: "User already exists",
      });
    }
    let newUser = new User({
      name,
      surname,
      status_id,
      password,
      contact,
      createdAt: new Date(),
    });

    await newUser.save();

    let newKey_ball = new Key_ball({
      user_id: newUser._id,
      subject_id: null,
      key,
      ball,
      attempts,
    });

    await newKey_ball.save();

    newUser = newUser.toObject();
    delete newUser.password;

    return res.status(201).json({
      status: 201,
      massage: "User added succasse",
      data: newUser,
      token: JWT.sign(
        { userId: newUser._id, statusId: newUser.status_id },
        "12345",
        { expiresIn: 60 * 60 * 24 }
      ),
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const GET_STATUS = async (req, res, next) => {
  try {
    let { token } = req.params;
    let status = JWT.verify(token, "12345");

    let subjects = await Subject.find({
      status_id: status.statusId,
    }).lean();

    if (!subjects) {
      return res.status(404).json({
        status: 404,
        massage: "Status not found",
        data: [],
      });
    }
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: subjects,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};
const POST_LOGIN = async (req, res, next) => {
  try {
    let { contact, password } = req.body;
    password = sha256(password);

    let user = await User.findOne({
      $and: [{ contact: contact }, { password: password }],
    }).lean();

    if (!user) {
      return res.status(404).json({
        status: 404,
        massage: "User not found",
      });
    }
    delete user.password;
    return res.status(201).json({
      status: 201,
      massage: user,
      token: JWT.sign({ userId: user._id, statusId: user.status_id }, "12345", {
        expiresIn: 60 * 60 * 24,
      }),
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const POST_STATUS = async (req, res, next) => {
  try {
    let { name } = req.body;
    let newStatus = new Status({
      name,
      createdAt: new Date(),
    });
    await newStatus.save();

    return res.status(201).json({
      status: 201,
      massage: "Status succass added",
      data: newStatus,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const POST_SUBJECT = async (req, res, next) => {
  try {
    let level = 1;
    let { name, status_id } = req.body;
    let { fileName } = req.files;
    let img = Date.now() + fileName.name.replace(/\s/g, "");
    status_id.toString();

    let newSubject = new Subject({
      name,
      fileName: img,
      status_id,
      level,
      createdAt: new Date(),
    });

    await newSubject.save();

    fileName.mv(path.join(process.cwd(), "src", "uploads", img));

    return res.status(201).json({
      status: 201,
      massage: "Subject succass added",
      data: newSubject,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const GET_USERS = async (req, res, next) => {
  try {
    const { userName } = req.query;
    let users = await User.find().lean();
    if (userName) {
      let user = users.filter((user) =>
        user.name.toLowerCase().includes(userName.toLowerCase())
      );
      return res.status(200).json({
        status: 200,
        message: "All users",
        data: user,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "All users",
      data: users,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const GET_USER = async (req, res, next) => {
  try {
    let { u_id } = req.params;
    let user = await User.findOne({ _id: u_id }).lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const get_STATUS = async (req, res, next) => {
  try {
    let { statusId } = req.params;
    let status = await Status.findOne({ _id: statusId }).lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: status,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const TOKEN_VERIFY = (req, res, next) => {
  try {
    let { token } = req.query;
    let token_verify = JWT.verify(token, "12345");

    if (token_verify) {
      return res.status(200).json({
        status: 200,
        massage: "OK",
      });
    }
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const STATUS = async (req, res, next) => {
  try {
    let status = await Status.find().lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: status,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const SUBJECT = async (req, res, next) => {
  try {
    let { subjectName } = req.params;
    let subject = await Subject.findOne({ name: subjectName }).lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: subject,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const KEY_BALL = async (req, res, next) => {
  try {
    let { id, subject_id } = req.query;
    let user = await Key_ball.findOne({
      $and: [{ user_id: id }, { subject_id: subject_id }],
    }).lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const KEY_UPDATE = async (req, res, next) => {
  try {
    let { id, subject_id } = req.query;
    let user = await Key_ball.findOne({
      $and: [{ user_id: id }, { subject_id: subject_id }],
    }).lean();
    if (user.key > 0) {
      let key = user.key - 1;
      let ball = user.ball;

      await Key_ball.findByIdAndUpdate(user._id, { ...user, key, ball });

      return res.status(200).json({
        status: 200,
        massage: "ok",
        data: user,
      });
    }
    return res.status(404).json({
      status: 404,
      massage: "Not found",
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const ATTEMPTS_UPDATE = async (req, res, next) => {
  try {
    let { id, subject_id } = req.query;
    let user = await Key_ball.findOne({
      $and: [{ user_id: id }, { subject_id: subject_id }],
    }).lean();

    let attempts = +user.attempts + 1;
    let s = await Key_ball.findByIdAndUpdate(user._id, { ...user, attempts });
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const SUBJECT_UPDATE = async (req, res, next) => {
  try {
    let { id, subject_id } = req.query;

    let u_subject = await Key_ball.findOne({ subject_id: null });
    let user = await Key_ball.findOne({
      $and: [{ user_id: id }, { subject_id: subject_id }],
    }).lean();
    if (user || u_subject) {
      let us = user ? user : u_subject;
      let s = await Key_ball.findByIdAndUpdate(us._id, { ...user, subject_id });
      return res.status(200).json({
        status: 200,
        massage: "update subject id",
        data: s,
      });
    } else {
      let newKey_ball = new Key_ball({
        user_id: id,
        subject_id,
        key: 0,
        ball: 0,
        attempts: 0,
      });

      await newKey_ball.save();
      return res.status(200).json({
        status: 200,
        massage: "Add new keyBall",
        data: newKey_ball,
      });
    }
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const KEYS_BALLS = async (req, res, next) => {
  try {
    let { id } = req.params;
    let users = await Key_ball.find({ user_id: id }).lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: users,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const USER_UPDATE = async (req, res, next) => {
  try {
    let { file } = req.files;
    let img = Date.now() + file.name.replace(/\s/g, "");
    let { id, name, surname, contact, password } = req.body;
    //console.log(id,name,surname,contact,password);
    let user = await User.findOne({ _id: id }).lean();
    console.log(user);
    name = name ? name : user.name;
    surname = surname ? surname : user.surname;
    user.contact = "9989 (--) --- -- --";
    password = password ? password : user.password;
    let user_update = await User.findByIdAndUpdate(user._id, {
      ...user,
      name,
      surname,
      password,
      contact,
    });

    file.mv(path.join(process.cwd(), "src", "uploads", img));
    return res.status(201).json({
      status: 201,
      massage: "User succass update",
      data: user_update,
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerError(500, error.massage));
  }
};
const get_SUBJECT = async (req, res, next) => {
  try {
    let { subject_id } = req.params;
    let subject = await Subject.findOne({ _id: subject_id }).lean();

    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: subject,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const get_SUBJECTS = async (req, res, next) => {
  try {
    let { subject_id } = req.params;
    let subjects = await Key_ball.find({ subject_id }).populate("user_id");

    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: subjects,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const LEVEL_UPDATE = async (req, res, next) => {
  try {
    let { user_id, subject_id, level } = req.query;
    if (level == "undefined") {
      {
        let level = 1;
        let newLevel = new Level({
          user_id,
          subject_id,
          level,
        });

        await newLevel.save();

        return res.status(201).json({
          status: 201,
          massage: "added level",
          data: newLevel,
        });
      }
    }
    let users = await Level.find({
      $or: [{ subject_id: null }, { subject_id: subject_id }],
    }).lean();
    let user = users ? users.find((el) => el.user_id == user_id) : "";
    if ((user && level) || level == 0) {
      let s = await Level.findByIdAndUpdate(user._id, { ...user, level });
      return res.status(200).json({
        status: 200,
        massage: "update level",
        data: s,
      });
    }
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};
const SUBJECT_ALL = async (req, res, next) => {
  try {
    let subject = await Subject.find().lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: subject,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const GET_LEVEL = async (req, res, next) => {
  try {
    let { user_id, subject_id } = req.query;
    let level = await Level.find({
      $and: [{ user_id: user_id }, { subject_id: subject_id }],
    }).lean();
    return res.status(200).json({
      status: 200,
      massage: "ok",
      data: level,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const DELETE_STATUS = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    let statusSearchSubject = await Subject.findOne({
      status_id: statusId,
    }).lean();

    if (statusSearchSubject) {
      return res.status(403).json({
        status: 403,
        message:
          "Categoriyani o'chirib bo'lmaydi, chunki unga Subject biriktirilgan!",
      });
    }

    let deleteStatus = await Status.findOneAndRemove({ _id: statusId });
    if (!deleteStatus) {
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

const UPDATE_STATUS = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const { name } = req.body;

    let status = await Status.findById({ _id: statusId });
    if (!status) {
      return res.status(404).json({
        status: 404,
        massage: "Status topilmadi",
        data: null,
      });
    }
    let statusUpdate = await Status.findOneAndUpdate(
      { _id: statusId },
      { $set: { name: name } },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      massage: "update Status",
      data: statusUpdate,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const DELETE_SUBJECT = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    let subjectSearchQuestion_test = await Question_test.findOne({
      subject_id: subjectId,
    }).lean();
    let subjectSearchQuestion_img = await Question_img.findOne({
      subject_id: subjectId,
    }).lean();

    if (subjectSearchQuestion_test) {
      return res.status(403).json({
        status: 403,
        message:
          "Fanni o'chirib bo'lmaydi, chunki unga test savoli biriktirilgan!",
      });
    }
    if (subjectSearchQuestion_img) {
      return res.status(403).json({
        status: 403,
        message:
          "Fanni o'chirib bo'lmaydi, chunki unga rasmli test savoli biriktirilgan!",
      });
    }

    let deleteSubject = await Subject.findOneAndRemove({ _id: subjectId });
    if (!deleteSubject) {
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

const UPDATE_SUBJECT = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name } = req.body;
    let { fileName } = req.files;

    let img = Date.now() + fileName.name.replace(/\s/g, "");
    let subject = await Subject.findById({ _id: subjectId });
    if (!subject) {
      return res.status(404).json({
        status: 404,
        massage: "subject topilmadi",
        data: null,
      });
    }
    let subjectUpdate = await Subject.findOneAndUpdate(
      { _id: subjectId },
      {
        $set: {
          name: name,
          fileName: img,
        },
      },
      { new: true }
    );
    file.mv(path.join(process.cwd(),'src','uploads',img))
    return res.status(200).json({
      status: 200,
      massage: "update subject",
      data: subjectUpdate,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.massage));
  }
};

const CONTACT = async (req, res, next) => {
  try {
    let { fullName, contact, text, user_id } = req.body;

    let user = await User.findById({ _id: user_id });

    if (!user) {
      return res.status(404).json({
        status: 404,
        massage: "user topilmadi",
        data: null,
      });
    }
    let newContact = new Contact({
      user_id,
      fullName,
      contact,
      text,
    });

    await newContact.save();

    return res.status(201).json({
      status: 201,
      massage: "Contact succass added",
      data: newContact,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const CONTACTS = async (req, res, next) => {
  try {
    let contacts = await Contact.find().lean();

    contacts.reverse();

    return res.status(200).json({
      status: 200,
      message: "All contacts",
      data: contacts,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const CONTACT_DELETE = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    let deleteContact = await Contact.findOneAndRemove({ _id: contactId });
    if (!deleteContact) {
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

export default {
  POST,
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
  UPDATE_SUBJECT,
  get_SUBJECTS,
  CONTACT,
  CONTACTS,
  CONTACT_DELETE,
};
