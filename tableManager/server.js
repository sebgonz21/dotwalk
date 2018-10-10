/*firebase
const admin = require('firebase-admin');

const serviceAccount = require('/Users/dmpalm1016/Desktop/nodeApp1/firebase/nodeapp1-9e613-firebase-adminsdk-m2r99-6d81bfecbe.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://nodeapp1-9e613.firebaseio.com",
databaseAuthVariableOverride: {
uid: "my-service-worker"
}
});
const db = admin.database();

var ref = db.ref("posts");
var postsList = ref.push();
var posts = [];
ref.on("child_added",function(data){ 
posts.push(data.val());
}); 

function addSnippet(){
postsList.set({
name:"danny"
});
}
//firebase*/

const fs = require('fs');
const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
res.render('index');
});

var crumbs = [];

function buildCrumbs(crumbs){
var arr = [];
if(!Array.isArray(crumbs)){
arr.push(crumbs);
return arr;
}

return crumbs;

}

app.get('/all_tables', (req, res) => {

if(req.query.name){
    var arr = [];
    arr[0] = req.url.substring(req.url.indexOf("/")+1,req.url.indexOf("?"));
    arr[1] = req.query.name;
    crumbs = buildCrumbs(arr);  
    res.render('table_records',{
        crumbs:crumbs
    });
    return;
}

crumb = req.url.substring(req.url.indexOf("/")+1);
crumbs = buildCrumbs(crumb);
res.render('all_tables',{
crumbs:crumbs
});
});
app.get('/create_table', (req, res) => {
    crumb = req.url.substring(req.url.indexOf("/")+1);
    crumbs = buildCrumbs(crumb);
res.render('create_table',{
    crumbs:crumbs
});
});

app.get('/styles.css', (req, res) => res.sendFile('styles'));



app.listen(port, () => console.log(`nodeApp1 is running on: ${port}!`));