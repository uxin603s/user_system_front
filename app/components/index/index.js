angular.module('app').component("index",{
bindings:{
	
},
templateUrl:'app/components/index/index.html?t='+Date.now(),
controller:["$scope",function($scope){
	$scope.list=[
		{id:1,name:'FB註冊'},
		{id:2,name:'使用者列表'},
		{id:3,name:'網站列表'},
		{id:4,name:'資料表與角色關係'},
		{id:5,name:'ip管理'},
		// {id:6,name:'ip白名單列表'},
		// {id:7,name:'個人頁面'},
	]
	$scope.cache.select_block || ($scope.cache.select_block=1)
	$scope.cache.fbR || ($scope.cache.fbR={});
	$scope.cache.user || ($scope.cache.user={});
	$scope.cache.web || ($scope.cache.web={});
	$scope.cache.ipList || ($scope.cache.ipList={});
}],
})