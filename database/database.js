/** MONGOOSE DATABASE */

const mongoose = require('mongoose');
const database = "mongoosedb";
let db;

module.exports = {

    connect:()=>{
        
        return new Promise((resolve, reject) => {
            console.log('Connecting...');
            mongoose.connect('mongodb://localhost/'+database
            );
            client = mongoose.connection;
            
            client.on('error', console.error.bind(console, 'connection error:'));
           
            client.once('open', function() {
                db = client.db;            
                resolve(db);
            });    
        });
        
    }

}

