const express=require("express");
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { getDashboardStats, getAllUsers, getUserById, deleteUser } = require("../controllers/adminController");



const router=express.Router();

router.get("/dashboard",auth,authorizeRoles("admin"),getDashboardStats);

router.get("/users",auth,authorizeRoles("admin"),getAllUsers);

router.get("/user/:id",auth,authorizeRoles("admin"),getUserById);
router.delete("/users/:id",auth,authorizeRoles("admin"),deleteUser);
module.exports=router;
