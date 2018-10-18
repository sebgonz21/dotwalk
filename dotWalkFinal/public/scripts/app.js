var mainApp = angular.module("mainApp", ['ngRoute']); 

mainApp.controller("mainController", function($scope, $rootScope, $route, $routeParams) {
$scope.ang = "AngularJS"; 
$scope.inputs = []; 
$scope.savedFields = []; 
$scope.saveTableDisabled = true; 
$scope.edit_table =  {}; 
$scope.table_name = ""; 
$scope.records = []; 
$scope.fieldTypes = ["String", "Boolean", "Integer"]; //for testing

//filler data
$scope.tables = []; 
var table1 =  {"name":"Table1", "records":"10", "id":"1", "fields":"4"}; 
table1.field_info = [ {"type":"String", "label":"Enter your name", "required":true},  {"type":"Boolean", "label":"Are you a weenee?", "required":true}]; 
table1.records = [ {"rec1":[ {"type":"String", "label":"Enter your name", "required":true, "value":"Danny Palmer"},  {"type":"Boolean", "label":"Male?", "required":true, "value":true}]}]; 
var table2 =  {"name":"Table2", "records":"10", "id":"2", "fields":"4"}; 
table2.field_info = [ {"type":"String", "label":"Enter your name for table 2", "required":false},  {"type":"Boolean", "label":"Are you table 2?", "required":false}]; 
var table3 =  {"name":"Table3", "records":"10", "id":"3", "fields":"4"}; 
var table4 =  {"name":"Table4", "records":"10", "id":"4", "fields":"4"}; 
$scope.tables.push(table1, table2, table3, table4); 
//filler data

//reset inputs and savedFields
function resetAppFields() {
$scope.inputs = []; 
$scope.savedFields = []; 
}

$rootScope.$on("$routeChangeSuccess", function(event, current, previous, rejection) {

$scope.routeLabel = current.label; 
$scope.table_name = $routeParams.table_name; 

if (current.originalPath.indexOf("createTableForm") == -1) {
resetAppFields(); 
}

if (current.originalPath == "/viewRecords") {
var table_id = $routeParams.id; 

$scope.tables.forEach(function (table) {
if (table.name == $scope.table_name && table.id == table_id) {
$scope.records = table.records; 
}
}); 

}

if (current.originalPath == "/editTable") {
var id = $routeParams.id; 
$scope.tables.forEach(function (table) {
if (table.id == id) {
$scope.edit_table = table; 
console.log($scope.edit_table); 
}
}); 
}

/*
//bread crumb routing logic if needed; works currently for only two layers
$scope.crumbs = []; 
//set home path
$scope.crumbs[0] =  {}; 
$scope.crumbs[0].label = "Home"; 
$scope.crumbs[0].loc = "/"; 
//set home path
var crumbObj =  {}; 
crumbObj.label = current.label; 
crumbObj.loc = current.originalPath.replace("/", ""); 
$scope.crumbs.push(crumbObj);  */
}); 

//if a user adds a field when creating a table, allow table to be saved client side
$scope.$watchCollection('inputs', function() {
if ($scope.inputs.length === 0 ||  ! $scope.inputs) {
$scope.saveTableDisabled = true; 
}else {
$scope.saveTableDisabled = false; 
}
}); 

/**dynamic add fields */
$scope.addfield = function() {
$scope.inputs.push( {}); 
}
//save field data
$scope.saveField = function(item, index) {
item.index = index; 
$scope.savedFields.push(item); 
}
//remove field on delete
$scope.removeField = function(item, index) {
$scope.savedFields.splice(item[index], 1); 
$scope.inputs.splice(index, 1); ; 
}

//save table to database
$scope.saveTable = function() {

}; 

}); 

//edit tale directive to be able to edit table name and fields, as well as other settings as determined
mainApp.directive("editTable", function() {

return {
retrict:'AE', 
scope: {
table:'='
}, 
template:'<div ng-repeat="field in table.field_info">' + 
'Label: <span>{{field.label}}</span>' + 
'<p>Type:' + 
'<input type="text" class="form-control" value="{{ field.type }}"/>' + 
'</p>' + 
'<span>Required:</span>' + 
'<span><input type="checkbox" class="form-control" ng-checked="field.required"/></span>' + 
'<hr/>' + 
'<div>', 
link:function(scope, element, attrs) {
console.log(scope.table)
}
}
}); 

//directive to 
mainApp.directive('scrollToLast', ['$location', '$anchorScroll', function($location, $anchorScroll) {

function linkFn(scope, element, attrs) {
var old = $location.hash(); 
$location.hash(attrs.scrollToLast); 
$anchorScroll(); 
}

return {
restrict:'AE', 
scope: {

}, 
link:linkFn
}; 

}]); 