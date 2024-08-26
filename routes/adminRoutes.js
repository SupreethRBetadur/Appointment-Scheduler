const express = require("express");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");


const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
});

//GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors Data list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting doctors data",
      error,
    });
  }
});

//POST ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
      const user = await userModel.findOne({ _id: doctor.userId });
      const notifcation = user.notifcation;
      notifcation.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request has been ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  }
);

module.exports = router;
