const express = require("express");
const router = express.Router({ mergeParams: true });


//FILE UPLAOD SYSTEM
const multer = require('multer')
require('dotenv').config();
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage })

//MIDDLEWARES
const { islogin } = require("../middlewares/islogin.js");

const listingControllers = require("../Controllers/listingControllers.js");


router.route("/new")
    .get(islogin, listingControllers.redirectTolistingCreateForm)
     .post( islogin,upload.single('newImage'),listingControllers.listFromFormToDB);
   

router.route("/:id")
    .get(listingControllers.specificList)
    .patch(islogin,upload.single('newImage'), listingControllers.listPatching)
    .delete(islogin, listingControllers.destroyList);

//SHOW ALL LISTINGS
router.get('/', listingControllers.showAllListings);

// ROUTE TO REDIRECT TO EDIT MAKING FORM
router.get("/edit/:id", islogin, listingControllers.listEditForm);




module.exports = router;
