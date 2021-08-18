const express = require("express");
const isAuth = require("../middlewares/isAuth");
const Bookmodel = require("../models/Bookmodel");

const router = express.Router();

const book = require("../models/Bookmodel");
const demandemodel = require("../models/demandemodel");
const User = require("../models/Usermodel");

// path: http:5000ds//localhost:/api/admin/addbook
// create book
// private

router.post("/addbook",isAuth, (req, res) => {
  const user = req.user
  const newbook = new book({
    user,
    ...req.body,
    comments:[]
  });
  newbook
    .save()
    .then((book) => res.json({ msg: "book added", book }))
    .catch((err) => console.log(err));
});

// path: http:5000//localhost:/api/admin/
// get all book
// public

router.get("/", (req, res) => {
  book
    .find()
    .then((book) => res.json({ msg: "book fetched", book }))
    .catch((err) => console.log(err));
});

// path: http:5000//localhost:/api/admin/:id
// delete  book
// private

router.delete("/:id", (req, res) => {
  book
    .findOneAndDelete({ _id: req.params.id })
    .then((book) => res.json({ msg: "book deleted", book }))
    .catch((err) => console.log(err));
});

// path: http:5000//localhost:/api/admin/:id
// edit  book
// private

router.put("/:id", (req, res) => {
  book
    .findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body } })
    .then((book) => res.json({ msg: "book edited", book }))
    .catch((err) => console.log(err));
});

//path: http:5000//localhost:/api/admin/:id
// get book by id
//

// router.get("/:id", (req, res) => {
//   book
//     .findOne({ _id: req.params.id })
//     .then((book) => res.json({ book }))
//     .catch((err) => console.log(err));
// });

//  @Desc Accepter livre
// @Path /api/admin/accepter_book/:id demande
// @Methode : PUT
// Private
// @Data req.headers {token} req.params{id}

router.put("/accepter_book/:id", async (req, res) => {
  try {
    // get id demande from req.params
    const { id } = req.params;
    // find demande
    const finddemande = await demandemodel.findOne({ _id: id });
    if (!finddemande) {
      return res.status(400).send({ msg: "demande introuvable" });
    }
    // get book data from demande
    const {
      name_book,
      author_book,
      year_book,
      des_book,
      language_book,
      type_book,
      pic_book,
      nbr_page_book,
      PDF_book,
      rating_book,
    } = finddemande.book;
    // get instance of book
    const newbook = new Bookmodel({
      user: finddemande.user,
      name_book,
      author_book,
      year_book,
      des_book,
      language_book,
      type_book,
      pic_book,
      nbr_page_book,
      PDF_book,
      rating_book,
    });
   
    // save book
    await newbook.save();
    // update status demande
    await demandemodel.updateOne({ _id: id }, { $set: { status: "ACCEPTER" } });
    res.status(200).send({ msg: "demande accepté" });
  } catch (error) {
    console.log(error);
    re.status(400).send({ msg: "erreur", error });
  }



});



// path: http:5000//localhost:/api/admin/:id
// delete  user
// private

router.delete("/delete_user/:id", (req, res) => {
  User
    .findOneAndDelete({ _id: req.params.id })
    .then((user) => res.json({ msg: "user deleted", user }))
    .catch((err) => console.log(err));
});




//  @Desc refuse livre
// @Path /api/admin/accepter_book/:id demande
// @Methode : PUT
// Private
// @Data req.headers {token} req.params{id}

router.put("/refuser_book/:id", async (req, res) => {
  try {
    // get id demande from req.params
    const { id } = req.params;
    // find demande
    const finddemande = await demandemodel.findOne({ _id: id });
    if (!finddemande) {
      return res.status(400).send({ msg: "demande introuvable" });
    }
    // get book data from demande
    // const {
    //   name_book,
    //   author_book,
    //   year_book,
    //   des_book,
    //   language_book,
    //   type_book,
    //   pic_book,
    //   nbr_page_book,
    //   PDF_book,
    //   rating_book,
    // } = finddemande.book;
    // // get instance of book
    // const newbook = new Bookmodel({
    //   user: finddemande.user,
    //   name_book,
    //   author_book,
    //   year_book,
    //   des_book,
    //   language_book,
    //   type_book,
    //   pic_book,
    //   nbr_page_book,
    //   PDF_book,
    //   rating_book,
    // });
   
    // save book
    // await newbook.save();
    // update status demande
    await demandemodel.updateOne({ _id: id }, { $set: { status: "REFUSER" } });
    res.status(200).send({ msg: "demande refuser" });
  } catch (error) {
    console.log(error);
    re.status(400).send({ msg: "erreur", error });
  }
});

//  @Desc GET DEMANDES
// @Path /api/admin/get_demandes
// @Methode : GET
// Private
// @Data req.headers {token}

router.get("/get_demandes",isAuth, async (req, res) => {
  try {
   const demandes = await demandemodel.find().populate("user");
    res.status(200).send({ msg: "les demandes",demandes });
  } catch (error) {
    console.log(error); 
    re.status(400).send({ msg: "erreur get demandes ", error });
  }
});


module.exports = router;
