const mongoose=require("mongoose")

const CommentSchema= new mongoose.Schema({
 id_user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
 },
 id_book:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "book"
 },
 comment:
{
    type:String
}, 



})

module.exports= mongoose.model("comment",CommentSchema);