/**
 * Route for handling TABLE requests
 */

const express = require('express');
const router = express.Router();
const ShemaModel = require('../../models/SchemaModel.js');
const schemaHandler = require('../../schemas/schema_handler.js');
const database = require("../../database/database.js");
const mongoose = require('mongoose');

/**
 * Gets the total record count of table.
 * @todo should move this function somewhere else.
 * @param {Object} table Table object containing name and other table details 
 */
const getRecordCount = (table)=>{
    return new Promise((resolve, reject) => {
        if(mongoose.models[table.table_name]){
            const model = mongoose.models[table.table_name];
            model.countDocuments()
            .then(result =>{
                table.record_count = result;
                resolve(table);
            })
            .catch(err =>{
                console.log(err);
                reject(err);
            });
        }
    });
};

/**
 * Get all tables
 */
router.get('/',(req,res,next)=>{

    ShemaModel.find()
    .exec()
    .then(schemas =>{

        let tables = [];
        let promises = [];
        for(let i = 0; i < schemas.length; i++){
        
            let table = {
                _id:schemas[i]._id,
                table_name:schemas[i].collection_name,
                columns:schemas[i].structure
            };
            
            promises.push(getRecordCount(table));
        }

        Promise.all(promises)
        .then(result=>{
            tables = result;
            res.status(200).json(tables);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

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

    console.log(req.body);
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
                //error: err.message
                error:"Failed To create table " + err.message
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
            error:"Failed To create table " + err.message
        });
    });    

});

/**
 * Get Table data
 */
router.get('/:table_name',(req,res,next)=>{
    const table_name = req.params.table_name;


    let table_data = {};

    getRecordCount(table_name)
    .then(result =>{
        table_data.record_count = result;
        res.status(200).json(table_data);
    })
    .catch(err =>{
        console.log(err);
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
 * Delete table or column
 */
router.delete('/:table_name', (req,res,next)=>{
    const table_name = req.params.table_name;
    const columns = req.body.columns;
    if(table_name){
        if(columns){
            //delete columns
            for(var i = 0; i < columns.length; i++){
               
                schemaHandler.removeSchemaElement(table_name,columns[i])
                .then(result =>{
                    //console.log(result);
                    if(result && i === columns.length -1){
                        res.status(200).json({
                            table_name:table_name,
                            columns:columns,
                            result:"Columns deleted"
                        });
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err.message
                    });
                });            
                
            }
            
        }else{
            //delete table
            console.log("deleting table");
            schemaHandler.removeSchema(table_name)
            .then(result =>{
                console.log(result);
                res.status(200).json({
                    table_name:table_name,
                    result:"Table deleted"
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error: err.message
                });
            });
        }
    }else{
        res.status(400).json({
            error: "No table name provided"
        });
    }
            
});

 
module.exports = router;