const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true}
});

//export to modules as we are going to use it in server
module.exports = mongoose.model('Post', postSchema);
