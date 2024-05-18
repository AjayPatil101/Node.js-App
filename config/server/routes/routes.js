const express = require("express");
const router = express.Router();
const { postUser, Singin, reset, forgot, validateResetOtp ,me} = require("../controllers/controllers");
const articlecontroller = require("../controllers/articleControllers");
const jwtCheck = require('../Utils/jwtUtils');

router.post("/signup", postUser);
router.post("/signin", Singin);
router.post('/User/sendUserPasswordResetEmail', forgot);
router.get('/User/me', jwtCheck.jwtCheck,me);
router.put('/User/reset', reset);
router.put('/User/:email/:resetOTP', validateResetOtp);

router.get('/article/getArticle/:_id', jwtCheck.jwtCheck, articlecontroller.getArticles);

router.post('/article/insertArticle', jwtCheck.jwtCheck, articlecontroller.addArticles);

router.delete('/article/deleteArticle/:id', jwtCheck.jwtCheck, articlecontroller.removeArticles);

router.put('/article/updateArticle/:_id', jwtCheck.jwtCheck, articlecontroller.updateArticles);
router.get('/article/paginationArticle', jwtCheck.jwtCheck, articlecontroller.paginationArticle);

router.get('/article/SearchArticle/:key', jwtCheck.jwtCheck, articlecontroller.SearchArticles);

module.exports = router;
