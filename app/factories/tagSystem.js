angular.module('app')
.factory('tagSystem',['$rootScope',function($rootScope){
	var data={
		size:{
			w:0,
			h:0,
		},
		idList:[],
		tagList:{},
	}
	var iframe=document.createElement("iframe");
	iframe.style="width:100%;height:100%;"
	iframe.setAttribute("marginwidth",0);
	iframe.setAttribute("marginheight",0);
	iframe.setAttribute("scrolling","no");
	iframe.setAttribute("frameborder",0);
	var source;
	var timer={};
	var init=function(src){
		var load=function(){
			source=iframe.contentWindow;
			postMessageHelper.init("tagSystem",source)
			postMessageHelper.send("tagSystem")
			postMessageHelper.receive("tagSystem",function(res){
				clearTimeout(timer[res.name])
				timer[res.name]=setTimeout(function(){
					if(res.name=="resize"){
						data.size.w=res.value.w
						data.size.h=res.value.h
					}
					if(res.name=="idSearchTag"){
						data.tagList=res.value;
					}
					if(res.name=="getInsertList"){
						data.insertList=res.value
					}
					if(res.name=="tagSearchId"){
						data.idList=res.value
					}
					if(res.name=="searchTagName"){
						data.customInsertList=res.value;
					}
					
					$rootScope.$apply();
				},0)
			})
		}
		iframe.onload=load
		iframe.src=src;
	}
	
	var tagSearchId=function(value){
		postMessageHelper
			.send("tagSystem",{name:'tagSearchId',value:value})
	}
	
	var idSearchTag=function(value){
		postMessageHelper
			.send("tagSystem",{name:'idSearchTag',value:value})
	}
	var addIdRelation=function(id,tag){
		postMessageHelper
			.send("tagSystem",{name:'addIdRelation',value:{id:id,name:tag.name}})
		tag.name='';
	}
	var delIdRelation=function(id,index){
		postMessageHelper
			.send("tagSystem",{name:'delIdRelation',value:{id:id,index:index}})
	}
	var chIdRelation=function(id,a,b){
		postMessageHelper
			.send("tagSystem",{name:'chIdRelation',value:{id:id,a:a,b:b}})
	}
	var searchTagName=function(tag){
		postMessageHelper
			.send("tagSystem",{name:'searchTagName',value:tag.name})
		tag.name='';
	}
	var setMode=function(mode){
		postMessageHelper
			.send("tagSystem",{name:'setMode',value:mode})
	}
	return {
		init:init,
		iframe:iframe,
		data:data,
		tagSearchId:tagSearchId,
		idSearchTag:idSearchTag,
		addIdRelation:addIdRelation,
		delIdRelation:delIdRelation,
		chIdRelation:chIdRelation,
		searchTagName:searchTagName,
		setMode:setMode,
	}
}])