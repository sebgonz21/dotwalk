/**
 * Handler for stored Schemas.
 * Load Schemas
 * Updates Schemas 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ShemaModel = require('../models/SchemaModel.js');


let handler = {};

/**
 * Map of Schema Instances
 */
handler.SchemaInstances = {};

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
 * from SchemaModel.js
 */
handler.createSchemasCollection = ()=>{
    return new Promise((resolve, reject) => {
        const structure = {
            structure:{
                created_on:Date,
                updated_on:Date
            },
            collection_name:"Object"
        };
        let schemas = new ShemaModel(structure);
        resolve(schemas.save());    
    });        
};

/**
 * Loads schemas from Schemas collections.
 * Adds each schema into mongoose and
 * saves instance in local array
 */
handler.loadSchemas = ()=>{       

    return new Promise((resolve, reject) => {
        ShemaModel.find()
        .exec()
        .then(schemas =>{

            for(let i = 0;i< schemas.length; i++){
                sch = schemas[i];
                
                const loadedSchema = new Schema(sch.structure,{collection:sch.collection_name});
                const loadedSchemaModel = mongoose.model(sch.collection_name,loadedSchema);     
                
                handler.SchemaInstances[sch._id] = {model:loadedSchemaModel,schema:loadedSchema};
                
            }
            
            resolve(handler.SchemaInstances);
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
handler.createNewSchema = (name,structure)=>{
    return new Promise((resolve, reject) => {
        
        //create collection for data
        const newSchemaData = new Schema(structure,{collection:name});
        const newSchemaModel = mongoose.model(name,newSchemaData);     
        const newSchemaInstance = new newSchemaModel();
        newSchemaInstance.save()           
        .then(schemaDataResult =>{
                //create schema definition
            const newSchema = new ShemaModel({
                collection_name:name,
                structure: structure
            });
        
            newSchema.save()
            .then(schemaDefResult => {
                
                resolve(schemaDataResult);
            })
            .catch(err => {
                reject(err);
            });  
            
        })
        .catch(err =>{
            reject(err)
        });                                     
        
    });
};

/**
 * Add element to Schema definition.
 * Like adding column to table
 * @param schemaId Object ID for Schema
 * @param columns new columns to add to schema
 */
handler.addSchemaElement = (schemaId,columns)=>{
    return new Promise((resolve, reject) => {                        
        
        //Edit mongoose Schema
        let editSchema = handler.SchemaInstances[schemaId].schema;                  
        editSchema.add(columns);           

        //Update Array of mongoose Schemas
        handler.SchemaInstances[schemaId].schema = editSchema;
        let newModel = mongoose.model(handler.SchemaInstances[schemaId].model.modelName,editSchema);
        handler.SchemaInstances[schemaId].model = newModel;                    

        //Update Schema Definition
        ShemaModel.findOne({"_id":schemaId}, function(err, doc){
            
            let newStructure = doc.structure;
            for(let col in columns){
                newStructure[col] = columns[col];
            }
            ShemaModel.update(
                {"_id":schemaId},
                { $set : { structure : newStructure}},
                function(err,result){
                    if(err) reject(err)
                    resolve(result);
                }
            );
            
            });
        
        
    });
    
}


module.exports = handler;