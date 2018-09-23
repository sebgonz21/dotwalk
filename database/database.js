/** MONGOOSE DATABASE */

const mongoose = require('mongoose');
const database = "mongoosedb";
let db;

module.exports = {

    /**
     * Connect to database
     */
    connect:()=>{
        
        return new Promise((resolve, reject) => {
            console.log('Connecting...');
            //mongoose.connect('mongodb://localhost/'+database
            mongoose.connect('mongodb+srv://svcacct_dotwalk:dotwalk_2@cluster0-ihgvy.mongodb.net/'+database,
            { useNewUrlParser: true });

            client = mongoose.connection;
            
            client.on('error', console.error.bind(console, 'connection error:'));
           
            client.once('open', function() {
                db = client.db;            
                
                resolve(db);
            });    
        });
        
    },

    /**
     * Create Collection on database
     * @param collectionName Name of new collection
     */
    createCollection:(collectionName)=>{
        return new Promise((resolve, reject) => {
            db.createCollection(collectionName, (err, res) =>{
                if (err) {
                    reject(err);
                    return;
                };
                resolve(res);
            });    
        });        
    },

}

