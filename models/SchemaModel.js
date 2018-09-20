/**
 * Schema for storing schemas
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const structure = {
    structure:Object,
    collection_name:{
        type:String,
        required:true
    }
};

let schema = new Schema(structure,{collection:"Schemas"});

module.exports = mongoose.model("Schemas",schema);
