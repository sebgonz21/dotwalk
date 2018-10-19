mainApp.config(function ($routeProvider) {
$routeProvider
.when("/",  {
templateUrl:"../public/partials/main.html", 
label:"Home"
}).when("/tables",  {
templateUrl:"../public/partials/tables.html", 
label:"Tables"
}).when("/create_table",  {
reloadOnSearch:false, 
templateUrl:"../public/partials/createTableForm.html", 
label:"Create Table"
}).when("/editTable",  {
templateUrl:"../public/partials/editTable.html", 
label:"Edit Table"
}).when("/viewRecords",  {
templateUrl:"../public/partials/viewrecords.html", 
label:"View Records"
}).when("/settings",  {
templateUrl:"../public/partials/settings.html", 
label:"Settings"
}); 
}); 