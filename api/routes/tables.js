/**
 * Route for handling TABLE requests
 */

const express = require('express');
const router = express.Router();
const ShemaModel = require('../../models/SchemaModel.js');
const schemaHandler = require('../../schemas/schema_handler.js');
/**
 * Get all tables
 */
router.get('/',(req,res,next)=>{

    ShemaModel.find()
    .exec()
    .then(schemas =>{
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
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Created Table",
            createdProduct: result
        });
    })
    .catch(err =>{
        console.log(err);
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