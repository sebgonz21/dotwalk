/**
 * Route for handling DATA requests
 */

const express = require('express');
const router = express.Router();
const schemaHandler = require('../../schemas/schema_handler.js');
const mongoose = require('mongoose');

router.get('/:table_name',(req,res,next)=>{

    const table_name = req.params.table_name;
    
    if(mongoose.models[table_name]){
        const model = mongoose.models[table_name];
        if(model){
            model.find({})
            .exec()
            .then(docs =>{
                res.status(200).json(docs);
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({ error: err });
            });
        }else{
            res.status(500).json({ error: "Table model is not instantiated" });
        }  
    }else{
        res.status(400).json({ error: "invalid table id" });
    }
    
    

});

router.post('/:table_name',(req,res,next)=>{

    
    const table_name = req.params.table_name;
    const data = req.body.data;
    
    if(mongoose.models[table_name]){
        const model = mongoose.models[table_name];
        console.log(model);
        console.log(model.schema);
        if(model){
            const newDocument = new model(data);
            newDocument.save()
            .then(result =>{
                res.status(201).json(result);
            })
            .catch(err =>{
                res.status(500).json({
                    error:err
                });
            });
            
        }
    }

});

module.exports = router;