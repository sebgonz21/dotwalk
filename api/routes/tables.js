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

        res.status(200).json(schemas);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.post('/',(req,res,next)=>{

    schemaHandler.createNewSchema(req.body.table_name,req.body.columns)
    .then(schemaResult =>{
       
        database.createCollection(schemaResult.collection_name)
        .then(collectionResult=>{
            console.log(collectionResult);
            res.status(201).json({
                message: "Created table successfully",
                table: {
                    name:schemaResult.collection_name,
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

router.patch('/:tableid',(req,res,next)=>{
    const id = req.params.tableid;
    const columns = req.body.columns;
    
    schemaHandler.addSchemaElement(id,columns)
    .then((result)=>{
        res.status(201).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;