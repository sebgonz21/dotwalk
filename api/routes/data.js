/**
 * Route for handling DATA requests
 */

const express = require('express');
const router = express.Router();
const schemaHandler = require('../../schemas/schema_handler.js');

router.get('/:tableid',(req,res,next)=>{

    const id = req.params.tableid;
    const schemasInstances = schemaHandler.SchemaInstances;
    const schemaInstance = schemasInstances[id];
    
    
    if(schemaInstance){
        const model = schemaInstance.model;
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

router.post('/:tableid',(req,res,next)=>{

    
    const id = req.params.tableid;
    const data = req.body.data;
    const schemasInstances = schemaHandler.SchemaInstances;
    const schemaInstance = schemasInstances[id];
    
    if(schemaInstance){
        const model = schemaInstance.model;
        if(model){
            const newDocument = new model(data);
            res.status(201).json(newDocument.save());
        }
    }

});

module.exports = router;