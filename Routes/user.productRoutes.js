const express = require("express")
const { getallproducts, addproducts, editproducts, deleteproducts } = require("../Controllers/user.controllersproduct")
const router = express.Router()
const upload = require("../middleware/upload");




router.get("/getallproducts", getallproducts)
router.post("/addproducts",  upload.single("images"), addproducts)
router.put("/editproducts/:id",  upload.single("images"), editproducts)
router.delete("/deleteproducts/:id", deleteproducts)





module.exports = router