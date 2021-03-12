function eventUtil(myfunc){
	var oldLoad = window.onload;
	if(typeof window.onload !='function'){
		window.onload = myfunc;
	}
	else{
		window.onload = function(){
			oldLoad();
			myfunc();
		};
	}
}

function myAppendChild(father,...nodes){
	for(let node of nodes){
		father.appendChild(node);
	}
}

function setInnerText(element, text) {
        //判断浏览器是否支持这个属性
        if (element.textContent) {//不支持
            element.textContent = text;
        } else {//支持这个属性
            element.innerText = text;
        }
    }

let myCookie = {
	setCookies(addr,addrValue,exdays){
		let date = new Date();
		date.setTime(date.getTime()+(exdays*24*60*60*1000));
		let expires = 'expires'+'='+date.toGMTString();
		let cstr = addr+'='+addrValue+'; '+expires;
		document.cookie=cstr;
		console.log(document.cookie);
	},
	getCookies(cname){
		let cookiesArr = document.cookie.split(';');
		for(let i=0;i<cookiesArr.length;i++){
			let c = cookiesArr[i].trim();
			if(c.indexOf(cname)==0) return c.substring(cname.length+1,c.length);
		}
		return undefined;
	},
	deleteCookies(cname,cvalue){
		let oldDate = new Date(-1);
		let expires ='expires'+'='+oldDate.toDateString();
		let cArr = document.cookie.split(';');
		for(let i=0;i<cArr.length;i++){
			let c = cArr[i].trim();
			if(c.indexOf(cname)==0&&c.indexOf(cvalue)==cname.length+1){
				this.setCookies(cname,cvalue,-1);
				console.log('delete cookie successfully');
				return true;
			}
		}
		console.log('不存在对应cookie');
		return false;
	}
}


//针对每个页面提供不同的调用函数 的中间函数
function AjaxFuncGet(url,dealFunc){
	let htmlHttp;
	if(window.XMLHttpRequest){
		htmlHttp = new XMLHttpRequest();
	}else{
		htmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	htmlHttp.onreadystatechange = dealFunc;
	htmlHttp.open('GET',url,true);
	htmlHttp.send();
}


function AjaxFuncGet_sync(url,dealFunc){
	let htmlHttp;
	if(window.XMLHttpRequest){
		htmlHttp = new XMLHttpRequest();
	}else{
		htmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	htmlHttp.onreadystatechange = dealFunc;
	htmlHttp.open('GET',url,false);
	htmlHttp.send();
}


function AjaxFuncPost(url,dealFunc,infor){
	let htmlHttp;
	if(window.XMLHttpRequest){
		htmlHttp = new XMLHttpRequest();
	}else{
		htmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	htmlHttp.onreadystatechange = dealFunc;
	let str = '';
	//这里注意,用了ES6新方法Object.keys()
	if(Object.keys(infor).length){
		var keysArr = Object.keys(infor);
		for(let key of keysArr){
			str =str+key+"="+infor[key]+"&";
		}
		str = str.slice(0,-1);
	}
	htmlHttp.open('POST',url,true);
	htmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	htmlHttp.send(str);
}


function prepareForm(){
		let dealFunc = function(){
			if(this.readyState ==4){
				if(this.status==200){
					if(!document.getElementById('form-container')){
						let formContainerDiv = document.createElement('div');
						formContainerDiv.innerHTML=this.responseText;
						document.getElementById('myheader').appendChild(formContainerDiv);
						
						//不足：低版本ie会出现问题，因为无法设置捕获阶段触发机制
						//容器在捕获阶段触发，子元素在冒泡阶段触发，使得子元素总在父元素之后触发
						let formContainer = document.getElementById('form-container');
						let handlerOuter = function(){
							this.style.display = 'none';
						}
						formContainer.addEventListener('click',handlerOuter,true);
						
						let loginOrRegistry = document.getElementById('login-or-registry');
						let handlerInner = function(){
							formContainer.style.display = 'block';
						}
						loginOrRegistry.addEventListener('click',handlerInner,false);
						let loginButton = document.getElementById('login-or-registry-button');
						loginButton.onclick = function(){
							formContainer.style.display = 'block';
							return false;
						}
					}else{
						return false;
					}
				}
			}
		}
		AjaxFuncGet_sync('form.txt',dealFunc);
}


function setHref(link){
	link.href = 'question.html?qsid='+link.id;
}
let setHrefFunc = {
	re_keywordSetHref:function(link,keyword){
		link.href = 'return.html?keyword='+encodeURI(keyword);
	},
	re_addrSetHref:function(link,addr){
		link.href = 'return.html?addr='+encodeURI(addr);
	},
	qs_qsidSetHref:function(link){
		link.href = 'question.html?qsid='+link.id;
	}
}

//
function getQuestionDetail(){
	this.href = 'quesion.html?id='+this.id;
}

function GetURLQueryString(name) { 
		  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
		  var context = "";
		  if (r != null) 
		     context = r[2]; 
		  reg = null; 
		  r = null; 
		  return context == null || context == "" || context == "undefined" ? "" : context; 
}
	function dataApply(returnResult){
		let blockArr = [];
		let blockkeyArr = Object.keys(returnResult);
		let i = 0;
		for(let key of blockkeyArr){
			let blockDiv = document.createElement('div');
			blockDiv.classList.add('block');
			//title
			let link = document.createElement('a');
			link.id = key;
			link.innerHTML = returnResult[key].title;
			setHrefFunc.qs_qsidSetHref(link);
			//br模块
			let blockbrDiv = document.createElement('div');
			blockbrDiv.classList.add('block-br');
			let linkDetailArr =Object.keys(returnResult[key].blockbr);
			linkDetailArr.forEach(x=>{
				let p = document.createElement('p');
				p.innerHTML=returnResult[key].blockbr[x];
				blockbrDiv.appendChild(p);
			});
			blockDiv.appendChild(link);
			blockDiv.appendChild(blockbrDiv);
			blockArr[i++] = blockDiv;
		}
		return blockArr;
	}