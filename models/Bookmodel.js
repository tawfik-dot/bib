const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  name_book: {
    type: String,
  },

  author_book: {
    type: String,
  },

  year_book: {
    type: String,
  },

  des_book: {
    type: String,
  },

  language_book: {
    type: String,
  },

  type_book: {
    type: String,
  },

  pic_book: {
    type: String,
  },

  nbr_page_book: {
    type: Number,
  },

  PDF_book: {
    type: String,
  },

  rating_book: {
    type: String,
  },
  comments:[{ type: Schema.Types.ObjectId,
    ref: "comment",}]
});

module.exports = mongoose.model("book", BookSchema);
