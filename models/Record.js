/**
 * Base Schema Object
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const structure = {
    _created_on:Date,
    _updated_on:Date,
    _created_by:String,
    _updated_by:String
};

let schema = new Schema(structure,{collection:"_Record"});

module.exports = mongoose.model("_Record",schema);