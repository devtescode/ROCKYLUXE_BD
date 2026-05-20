const jwt = require("jsonwebtoken")
const env = require("dotenv")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin  = require("../Models/user.models");
env.config()




module.exports.userwelcome = async (req, res) => {
    res.status(200).json({ message: "Welcome to Bridal" })
}

module.exports.status = async (req, res) => {
    const admin = await Admin.findOne();
    if (admin) {
        return res.json({ adminExists: true });
    } else {
        return res.json({ adminExists: false });
    }
}


module.exports.register = async (req, res) => {
    try {
        const existing = await Admin.findOne();

        if (existing) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const admin = new Admin({
            email: req.body.email,
            password:  req.body.password,
        });

        await admin.save();
        console.log("Admin created successfully");

        res.json({ message: "Admin created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}


module.exports.login = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(
            req.body.password,
            admin.password
        );

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }

}


module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // FIND ADMIN
    const admin = await Admin.findOne()

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
      })
    }

    // CHECK CURRENT PASSWORD
    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      })
      console.log("Current password is incorrect");
      
    }

    // ✅ JUST SET NEW PASSWORD
    // pre('save') will hash automatically
    admin.password = newPassword

    await admin.save()

    res.status(200).json({
      message: 'Password updated successfully',
    })
    console.log("Password updated successfully");

  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}