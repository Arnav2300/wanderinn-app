const mongoose=require("mongoose");
const BookmarkSchema=new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, required: true},
    places: { type: [mongoose.Schema.Types.ObjectId], ref: "Place", required: true }
})
const BookmarkModel = mongoose.model("Bookmark", BookmarkSchema);
module.exports=BookmarkModel