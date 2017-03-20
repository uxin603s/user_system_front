angular.module("app",["param","cache",])
.config(['$compileProvider',function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);	
}])