window.onload=function(){

var config = {};
config.url = 'http://dotwalkdev.us-east-2.elasticbeanstalk.com/api/';

function TableManagerApp(config){
if(!config){
return;
}
//app
var app = this;
//url
var url = config.url;
//app fields
var tableName = document.getElementById("table-name");
var fieldName = document.getElementById("field-name");
var fieldRequired = document.getElementById("field-required");
var addField = document.getElementById("add-field");
var createTable = document.getElementById("create-table");
var fieldType = "";

var dataFieldTypes = document.querySelectorAll('[data-fieldtype]');

for(var i = 0;i<dataFieldTypes.length;i+=1){
    dataFieldTypes[i].addEventListener("click",function(evt){
        fieldType = this.getAttribute("data-fieldtype");
    });
}



app.fields = [];
app.field = {};
//log errors
app.handleError=function(error){console.log(error);};

//templates
app.allTablesTemplate = function(vari){
var columns = []

for(var col in vari.columns){
    columns.push(col); 
}

var template = `<a href="../all_tables?name=${vari.table_name}" class="list-group-item list-group-item-action flex-column align-items-start dark">
<div class="d-flex w-100 justify-content-between">
<h5 class="mb-1">${vari.table_name}</h5>
</div>
<p class="mb-1">Fields: ${columns.length}</p>
</a>`;
return template;
}
//templates

//get all tables
app.getAllTables=function(ele){
if(!ele){
return;
}
function displayTables(result){
console.log(result);
var i = 0;
var len = result.length;
for(i;i<len;i+=1){
var html = app.allTablesTemplate(result[i]);
ele.innerHTML+=html;
}

}
app.allTablesAjax(url,displayTables,app.handleError);
}

app.allTablesAjax=function(url,success,error){
$.ajax({type:'GET',url: url+'tables',dataType:'JSON', success: success,error:error});
}

//create a table

//add fields

app.addField=function(){
var fieldObj = {};
fieldObj.fieldName = fieldName.value;
fieldObj.fieldType = fieldType;
fieldObj.fieldRequired = "false"; 
if(fieldRequired.checked){
fieldObj.fieldRequired = "true"; 
}
app.fields.push(fieldObj);
}

if(addField){
addField.addEventListener("click",function(evt){
app.addField();
console.log(app.fields);
});
}


app.createTable=function(){
if(app.fields.length==0){
return;
}
var tableData = {
table_name:tableName.value,
columns:{}
}
var i = 0;
var len = app.fields.length;

for(i;i<len;i+=1){
tableData.columns[app.fields[i].fieldName]={
type:app.fields[i].fieldType,
required:app.fields[i].fieldRequired
}
}
$.ajax({type:'POST',data:JSON.stringify(tableData),contentType:'application/json', dataType:'JSON', url: url +'tables', success: function(result){
console.log(result);
tableName.value="";
app.fields=[];
fieldName.value="";
fieldRequired.checked=false;
},error:function(error){
console.log(error);
}});

}

if(createTable){
createTable.addEventListener("click",function(evt){
app.createTable();
});
}


}


//build app
var app =  new TableManagerApp(config);
//get all tables element
var allTablesID =  document.getElementById("all-tables");
app.getAllTables(allTablesID);


//getAllTables();

/*var postTableColumnData = {
table_name:"tableManagerAdmin12",
columns:{
dpField1:{
type:"String",
required:"true"
},
dpField2:{
type:"Boolean",
required:"true"
}
}
};



$.ajax({type:'POST',data:JSON.stringify(postTableColumnData),contentType:'application/json', dataType:'JSON', url: config.url +'tables', success: function(result){
console.log(result);
},error:function(error){
console.log(error);
}});*/

/*var postColumnToTable = {
columns:{
postedColumn:{
type:"String",
required:"true"
}
}	
}


$.ajax({type:'PATCH',data:JSON.stringify(postColumnToTable),contentType:'application/json', dataType:'JSON', url: url +'tables/tableManagerAdmin1', success: function(result){
console.log(result);
},error:function(error){
console.log(error);
}});*/

/*
var deleteColumns = {columns:['postedColumn']};

$.ajax({type:'DELETE',data:JSON.stringify(deleteColumns),contentType:'application/json', dataType:'JSON', url: url +'tables/tableManagerAdmin1', success: function(result){
console.log(result);
},error:function(error){
console.log(error);
}});
*/


//create records

var recUrl = 'http://dotwalkdev.us-east-2.elasticbeanstalk.com/api/data/';

/*var recData = {
data:{
dpField1:'testing a record',

}
}

$.ajax({type:'POST',data:JSON.stringify(recData),contentType:'application/json', dataType:'JSON', url: recUrl +'tableManagerAdmin1', success: function(result){
console.log(result);
},error:function(error){
console.log(error);
}});*/

/*$.ajax({type:'GET', dataType:'JSON', url: recUrl +'tableManagerAdmin1', success: function(result){
console.log(result);
},error:function(error){
console.log(error);
}});*/


}