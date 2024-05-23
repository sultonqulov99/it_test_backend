import { InternalServerError, AuthorizationError } from "../utils/errors.js";
import JWT from "jsonwebtoken";
import sha256 from "sha256";
import Admin from "../model/admin.js";

const POST_LOGIN = async (req, res, next) => {
  try {
    let { contact, password } = req.body;
    password = sha256(password);

    let user = await Admin.findOne({
      $and: [{ contact: contact }, { password: password }],
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        massage: "User not found",
      });
    }
    return res.status(201).json({
      status: 201,
      massage: user,
      token: JWT.sign({ role: user.role }, "shaftoli", { expiresIn: 600 }),
    });
  } catch (error) {
    console.log(error);
    return next(new InternalServerError(500, error.message));
  }
};

const POST_REGISTER = async (req, res, next) => {
  try {
    let { contact, password } = req.body;
    password = sha256(password);
    let token = req.headers.token;
    if (!token) {
      return next(new AuthorizationError(403, "Sizga ruxsat yo'q"));
    }

    const { role } = JWT.verify(token, "shaftoli");

    if (role != "SUPER_ADMIN" && role != "ADMIN") {
      return next(new AuthorizationError(403, "Sizga ruxsat yo'q"));
    }

    let user = await Admin.findOne({ contact: contact });

    if (user) {
      return res.status(400).json({
        status: 400,
        massage: "Bu nomerdan allaqachon ro'yxatdan o'tilgan!",
      });
    }

    let newAdmin = new Admin({
      contact,
      password,
      role: "ADMIN",
    });

    await newAdmin.save();

    return res.status(201).json({
      status: 201,
      massage: "Admin succass added",
      data: newAdmin,
      token: JWT.sign({ role: newAdmin.role }, "shaftoli", { expiresIn: 600 }),
    });
  } catch (error) {
    return next(new AuthorizationError(402, error.message));
  }
};

const UPDATE = async (req, res, next) => {
  try {
    let { contact, password, r_password } = req.body;
    let token = req.headers.token;

    if (password !== r_password) {
      return next(new AuthorizationError(401, "Passwordlar mos emas"));
    }

    if (!token) {
      return next(new AuthorizationError(403, "Sizga ruxsat yo'q"));
    }

    const { role } = JWT.verify(token, "shaftoli");

    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return next(new AuthorizationError(403, "Sizga ruxsat yo'q"));
    }

    let user = await Admin.findOne({ contact: contact });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Foydalanuvchi topilmadi!",
      });
    }

    const hashedPassword = sha256(password);

    let update_admin = await Admin.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    }, { new: true });

    return res.status(200).json({
      status: 200,
      message: "Password updated",
      data: update_admin,
    });
  } catch (error) {
    return next(new AuthorizationError(402, error.message));
  }
};

export default {
  POST_LOGIN,
  POST_REGISTER,
  UPDATE,
};
