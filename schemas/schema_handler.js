/**
 * Handler for stored Schemas.
 * Load Schemas
 * Updates Schemas 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaModel = require('../models/SchemaModel.js');
const baseTableModel = require('../models/Record.js');

const baseColumns = {
    _created_on:"Date",
    _updated_on:"Date",
    _created_by:"String",
    _updated_by:"String"
};

let handler = {};

/**
 * Checks if Schemas Collection
 * exists in database
 * @param {Object} db Database connection object
 */
handler.checkSchemasCollection = (db)=>{

    return new Promise((resolve, reject) => {
        db.listCollections({name: 'Schemas'})
        .next(function(err, collinfo) {
            if(collinfo){
                resolve(true);
            }else{
                resolve(false);
            }
        });     
    });
    
};

/**
 * Creates Schemas collection
 * from SchemaModel.js by inserting base table Record
 */
handler.createSchemasCollection = ()=>{
    return new Promise((resolve, reject) => {
        const schemaStructure = {
            collection_name:"_Record",
            structure:baseColumns
        };
        let schemas = new SchemaModel(schemaStructure);
        schemas.save()
        .then(result =>{
            resolve(result);    
        })
        .catch(err =>{
            reject(err);
        });
        
    });        
};

/**
 * Loads schemas from Schemas collections.
 * Adds each schema into mongoose and
 * saves instance in local array
 */
handler.loadSchemas = ()=>{       

    return new Promise((resolve, reject) => {
        SchemaModel.find({ collection_name: { $ne: "_Record" } })
        .exec()
        .then(schemas =>{

            for(let i = 0;i< schemas.length; i++){
                sch = schemas[i];
                
                const loadedSchema = new Schema(sch.structure,{collection:sch.collection_name});
                mongoose.model(sch.collection_name,loadedSchema);     
                
            }
            
            resolve(true);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        });
    });
};

/**
 * Create model and save collection
 * then add to schema definition
 * @param name Name of new Schema
 * @param structure structure of new Schema (columns)
 */
handler.createNewSchema = (table_name,structure)=>{
    return new Promise((resolve, reject) => {
        
        //create Schema and Model in Mongoose through inheritance
        baseTableModel.discriminator(table_name,new Schema(structure,{collection:table_name}));
        
        //Get new structure with inherited columns
        structure =  Object.assign(structure,baseColumns);

        //Create new Schema record
        const newSchema = new SchemaModel({
            collection_name:table_name,
            structure: structure
        });
    
        newSchema.save()
        .then(schemaDefResult => {
            resolve(schemaDefResult);
        })
        .catch(err => {            
            reject(err);
        });          
    });
};

/**
 * Add element to Schema definition.
 * Like adding column to table
 * @param schemaId Object ID for Schema
 * @param columns new columns to add to schema
 */
handler.addSchemaElement = (table_name,columns)=>{
    return new Promise((resolve, reject) => {                        
        
        //Edit mongoose Schema
        //Recompile model
        if(mongoose.models[table_name]){
            let editSchema = mongoose.models[table_name].schema
            editSchema.add(columns);           
            mongoose.model(table_name,editSchema);
        }
                      

        //Update Schema Definition
        SchemaModel.findOne({"collection_name":table_name}, function(err, doc){
            
            let newStructure = doc.structure;
            for(let col in columns){
                newStructure[col] = columns[col];
            }
            SchemaModel.updateOne(
                {"_id":doc._id},
                { $set : { structure : newStructure}},
                function(err,result){
                    if(err) reject(err)
                    resolve(result);
                }
            );
            
            });
        
        
    });
    
}

/**
 * Remove column from table.
 * - removes key from mongoose Schema Object and recompiles model
 * - removes key from Schema deifinition record for Schema
 * - removes key from existing documents in collection
 * 
 * @param table_name name of table from which to remove column
 * @param column_name name of column to remove
 */
handler.removeSchemaElement = (table_name,column_name)=>{
    return new Promise((resolve, reject) => {
       
        if(mongoose.models[table_name]){
            console.log("deleting");
            //Remove from key from table
            const editSchemaModel = mongoose.models[table_name];

            let unsetColumn = {};
            unsetColumn[column_name] = ""; 

            editSchemaModel.collection.updateMany({},{$unset:unsetColumn});

            //@TODO FINISH THIS




            //Remove key from Schema object in mongoose
            //const editSchema = editSchemaModel.schema;
           // editSchema.remove(column_name);           
           // mongoose.model(table_name,editSchema);

            //Remove key from Schema Definition table record
            SchemaModel.findOne({collection_name:table_name},function(err,schemaDefinition){
                if(err){
                    reject(err);
                    return;
                }

                //console.log(schemaDefinition);
            });
           
            //SchemaModel.collection.update({collection_name:table_name},$unset);
        }
       
    });
};

module.exports = handler;