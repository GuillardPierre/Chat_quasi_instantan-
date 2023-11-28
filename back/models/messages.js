const mongoose = require('mongoose')


const messagesSchema = mongoose.Schema({
    user: {type: String, required: true}, 
    content: {type: String, required: true}
  });
  
  module.exports = mongoose.model('Messages', messagesSchema);