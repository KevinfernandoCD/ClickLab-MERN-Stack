const express = require("express");
const { authUserTokenId } = require("../serverErrorHandling/authMiddleware");
const {sendMessage,getMessages}  = require("../controllers/messages");

const router = express.Router();


router.route('/').post(authUserTokenId,sendMessage);
router.route('/:chatId').get(authUserTokenId,getMessages);

module.exports = router;
