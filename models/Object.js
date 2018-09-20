/**
 * Base Schema Object
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const structure = {
    created_on:Date,
    updated_on:Date
};

let schema = new Schema(structure,{collection:"Object"});
console.log(schema);

module.exports = mongoose.model("Object",schema);