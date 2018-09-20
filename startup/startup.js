/**
 * Starts connection to database
 * and load schemas
 */

const Schemas = require('../models/SchemaModel.js');
const schemaHandler = require('../schemas/schema_handler.js');
const database = require('../database/database.js');
let db;

let startup = {

    start:()=>{     
        return new Promise((resolve, reject) => {

            database.connect().then((databaseConnection)=>{
                db = databaseConnection;    

                //Check if Schemas Collection exists
                schemaHandler.checkSchemasCollection(db).then((collectionExists)=>{
                    if(collectionExists){
                        //load schemas into mongoose
                        console.log("Schemas collection exists");
                    }else{
                        
                        console.log("Schemas collection Does not exist");
                        schemaHandler.createSchemasCollection().then((schemas)=>{
                            console.log(schemas);
                        });
                    }
                });

                
                schemaHandler.loadSchemas(db).then((result)=>{
                    resolve(result);
                });    
            });

            
        });
        
    }
};

module.exports = startup;