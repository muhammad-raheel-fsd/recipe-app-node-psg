const express = require("express");
const bcrypt = require("bcryptjs");
const { Users } = require("../../db/models");
const { hashPassword, validatePassword } = require("../../utils/bcrypt");
const createToken = require("../../utils/createToken");
const router = express.Router();

// Sign up
router.post("/addUser", async (req, res) => {
  const { username, password, email, profileImage: image } = req.body;
  try {
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
      image,
    });

    return res.json({ status: 200, redirect: "/auth/login" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await Users.findAll();

    if (users.length === 0) {
      return res.status(404).json({ status: 404, message: "Users not found" });
    }

    return res.status(200).json({ status: 200, data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// get all users by id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    return res.status(200).json({ status: 200, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//login user
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({
      where: { email },
    });

    if (!user || !(await validatePassword(password, user.password))) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const token = createToken({ email: user.email });
    return res.json({
      status: 200,
      cookie: { token, userId: user.userid },
      redirect: "/",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// update user
router.put("/update/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username, email, password, profileImage: image } = req.body;

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const updatedUser = await user.update({ username, email, password, image });

    return res.json({ status: 200, data: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;