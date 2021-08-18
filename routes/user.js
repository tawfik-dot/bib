// Require router from express
const router = require("express").Router();

// Require bcrypt
const bcrypt = require("bcrypt");

// Require the json web token
const jwt = require("jsonwebtoken");

// Require the User Schema
const User = require("../models/Usermodel");

const isAuth = require("../middlewares/isAuth");

//require validitors
const {
  registerRules,
  loginRules,
  validator,
} = require("../middlewares/validator");
const Bookmodel = require("../models/Bookmodel");
const demandemodel = require("../models/demandemodel");
const comment = require("../models/Commentmodel");

//@route POST api/users/register
//@desc Register new user
//@access Public
router.post("/register", registerRules(), validator, async (req, res) => {
  const { id_user, role, name, lastName, addres, tel, email, password } =
    req.body;
  try {
    // Simple Validation
    /*  if (!name || !lastName || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields!' });
      } */

    // Check for existing user
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new User
    user = new User({
      id_user,
      role,
      name,
      lastName,
      addres,
      tel,
      email,
      password,
    });

    // Create Salt & hash
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    // Replace user password with hashed password
    user.password = hashedPassword;

    // Save the user
    await user.save();

    // sign user
    const payload = {
      id: user._id,
    };

    // Generate token
    const token = await jwt.sign(payload, process.env.secretOrKey, {
      expiresIn: "7 days",
    });

    res.status(200).send({ msg: "User registred with success", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Server Error" });
  }
});

//@route POST api/users/login
//@desc Login User
//@access Public
router.post("/login", loginRules(), validator, async (req, res) => {
  const { email, password } = req.body;
  try {
    //simple Validation
    /* if (!email || !password) {
        return res.status(400).send({ msg: 'Please enter all fields' });
      } */

    // Check for existing user
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ msg: "Bad Credentials! email" });
    }

    //Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ msg: "Bad Credentials! password" });
    }

    // sing user
    const payload = {
      id: user._id,
    };

    // Generate token
    const token = await jwt.sign(payload, process.env.secretOrKey, {
      expiresIn: "7 days",
    });

    res.send({ msg: "Logged in with success", user, token });
  } catch (error) {
    res.status(500).send({ msg: "Server Error" });
  }
});

//  @Desc Demande d'ajout du livre
// @Path /api/users/demande
// @Methode : POST
// Private
// @Data req.headers {token} req.body{données du livre}

router.post("/demande", isAuth, async (req, res) => {
  try {
    // get user from req
    const { user } = req;
    // get book data from req.body
    const bookdata = req.body;
    // add book instance 
    const newbook = new Bookmodel({ ...bookdata });
    // save demande
    const newdemande = new demandemodel({
      user,
      book: newbook,
      status: "EN ATTENTE",
    });
    await newdemande.save();
    res.status(200).send({ msg: "Demande ajouter !" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "erreur " });
  }
});

// path: http://localhost:5000/api/comments/addcomment/:id
// add comment
// private

router.post("/addcomment/:id",isAuth,async (req, res) => {
  try {
    const user = req.user;
  const {id} = req.params
  const comm = req.body.comment;
  const findbook = await Bookmodel.findById(id)
  const newcomment = new comment({
    id_user:user,
    id_book:findbook,
    comment:comm
  });
  await newcomment.save()
  await Bookmodel.updateOne({_id:id},{$push:{comments:newcomment}});
  res.status(200).send({msg:"comment ajouté"});
  } catch (error) {
    console.log(err);
  }
  
});




// path: http:5000//localhost:/api/books/
// get all book
// public

router.get("/", (req, res) => {
  Bookmodel
    .find()
    .then((book) => res.json({ msg: "book fetched", book }))
    .catch((err) => console.log(err));
});


// path: http:5000//localhost:/api/books/:id
// delete  book
// private

router.delete("/:id", (req, res) => {
  book
    .findOneAndDelete({ _id: req.params.id })
    .then((book) => res.json({ msg: "book deleted", book }))
    .catch((err) => console.log(err));
});

// path: http:5000//localhost:/api/books/:id
// edit  book
// private

router.put("/:id", (req, res) => {
  book
    .findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } })
    .then((book) => res.json({ msg: "book edited", book }))
    .catch((err) => console.log(err));
});

//path: http:5000//localhost:/api/books/
// get book by id
//

router.get("/get_book/:id", async (req, res) => {

  try {
    const { id } = req.params;
    const book = await Bookmodel.findOne({ _id: id }).populate("comments");
    if (!book) {
      return res.status(400).send({ msg: "book not found!" });
    }
    res.status(200).send({ msg: "the book", book });
  } catch (error) {
    res.status(400).send({ msg: "can not get book" });
  }
}); 

//@route POST api/users/isAuth
//@desc get authentified user
//@access Private

router.get("/user", isAuth, (req, res) => {
  res.status(200).send({ user: req.user });
});

module.exports = router;
