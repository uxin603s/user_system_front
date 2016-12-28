angular.module("app",["whereList","cache",])
.config(['$compileProvider',function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);	
}])