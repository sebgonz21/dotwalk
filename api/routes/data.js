/**
 * Route for handling DATA requests
 */

const express = require('express');
const router = express.Router();
const schemaHandler = require('../../schemas/schema_handler.js');
const mongoose = require('mongoose');

/**
 * Get all records from table
 */
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

/**
 * Create Record
 */
router.post('/:table_name',(req,res,next)=>{

    
    const table_name = req.params.table_name;
    const data = req.body.data;
    
    if(mongoose.models[table_name]){
        const model = mongoose.models[table_name];
        
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

/**
 * Update Record
 */
router.patch('/:table_name/:record_id',(req,res,next)=>{

    const table_name = req.params.table_name;
    const record_id = req.params.record_id;
    const updates = req.body.data;
    
    if(mongoose.models[table_name]){
        const model = mongoose.models[table_name];

        model.update({ _id: record_id }, { $set: updates })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Record updated',
                result:result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
        });
    }
    
    
});

/**
 * Delete Record
 */
router.delete('/:table_name/:record_id',(req,res,next)=>{
    const table_name = req.params.table_name;
    const record_id = req.params.record_id;

    if(mongoose.models[table_name]){
        const model = mongoose.models[table_name];

        model.remove({ _id: record_id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Record deleted',
                result:result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
        });
    }
});

module.exports = router;