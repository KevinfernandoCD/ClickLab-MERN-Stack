const express = require("express");
const { createChat,fetchChat,createGroup,updateGroup,addToGroup,removeFromGroup,getGroups,UpdateGroupImage,deleteChat} = require("../controllers/createChatController");
const { authUserTokenId } = require("../serverErrorHandling/authMiddleware");

const router = express.Router();

router.route('/').post(authUserTokenId,createChat);
router.route('/').get(authUserTokenId,fetchChat);
router.route('/getgroups').post(authUserTokenId,getGroups)
router.route('/group').post(authUserTokenId,createGroup);
router.route('/updatechat').put(authUserTokenId,updateGroup);
router.route('/removefromchat').put(authUserTokenId,removeFromGroup);
router.route('/addtochat').put(authUserTokenId,addToGroup);
router.route('/updateImage').put(authUserTokenId,UpdateGroupImage);
router.route('/deletechat').put(authUserTokenId,deleteChat)

module.exports = router;