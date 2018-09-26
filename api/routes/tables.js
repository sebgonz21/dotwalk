/**
 * Route for handling TABLE requests
 */

const express = require('express');
const router = express.Router();
const ShemaModel = require('../../models/SchemaModel.js');
const schemaHandler = require('../../schemas/schema_handler.js');
const database = require("../../database/database.js");


/**
 * Get all tables
 */
router.get('/',(req,res,next)=>{

    ShemaModel.find()
    .exec()
    .then(schemas =>{

        //@TODO Loop through schemas put into new
        //object and make collection_name, table name and structure and columns

        let tables = [];
        for(var i = 0; i < schemas.length; i++){
            tables.push({
                _id:schemas[i]._id,
                table_name:schemas[i].collection_name,
                columns:schemas[i].structure
            });
        }

        res.status(200).json(tables);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


/**
 * Create Table
 */
router.post('/',(req,res,next)=>{

    schemaHandler.createNewSchema(req.body.table_name,req.body.columns)
    .then(schemaResult =>{
       
        database.createCollection(schemaResult.collection_name)
        .then(collectionResult=>{
           
            res.status(201).json({
                message: "Created table successfully",
                table: {
                    table_name:schemaResult.collection_name,
                    _id: schemaResult._id,
                    columns:schemaResult.structure
                }
            });

        }).catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        
    })
    .catch(err =>{
        console.log(err);
        if(err && err.name ==="OverwriteModelError"){
            err = {               
                message:"Table already exists"                
            };
        }
        res.status(500).json({
            error: err
        });
    });    

});

/**
 * Add column to table
 */
router.patch('/:table_name',(req,res,next)=>{
    const table_name = req.params.table_name;
    const columns = req.body.columns;
    
    schemaHandler.addSchemaElement(table_name,columns)
    .then((result)=>{
        res.status(201).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


/**
 * Delete column
 */


 /**
  * Delete table
  */
module.exports = router;