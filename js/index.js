//全局变量
let sortNum = 'sort1';

//block更新:GET方式
function getBlock(){
	function dealFunc(){
		if(this.readyState ==4){
			if(this.status==200){
				let blocks = document.getElementById('blocks');
				let button = document.getElementById('get-data-button');
				let nowdata =JSON.parse(this.responseText);
				if(window.sessionStorage.getItem('olddata')){
					let olddataJson = window.sessionStorage.getItem('olddata');
					let olddata = JSON.parse(olddataJson);
					let alldata = Object.assign({},nowdata,olddata);
					let alldataJson = JSON.stringify(alldata);
					window.sessionStorage.setItem('olddata',alldataJson)
				}else{
					window.sessionStorage.setItem('olddata',this.responseText);
				}
				let blockArr = dataApply(nowdata);
				for(let block of blockArr)
					blocks.insertBefore(block,button);
				}
			}
	}
	if(document.querySelectorAll('.blocks .block a').length){
		console.log('这是啥?')
		let hadedId = '';
		let links =  document.querySelectorAll('.blocks .block a');
		for(let i = 0;i<links.length;i++){
			hadedId=hadedId+links[i].id+'+';
		}
		hadedId=hadedId.slice(0,-1);
		console.log('index.json?'+'sortNum='+sortNum+'&hadedIds='+encodeURI(hadedId));
		AjaxFuncGet('./testdata/index.json?'+'sortNum='+sortNum+'&hadedIds='+encodeURI(hadedId),dealFunc);
	}else{
		console.log('index.json?'+'sortNum='+sortNum+'&hadedIds='+encodeURI('null'));
		AjaxFuncGet('./testdata/index.json?'+'sortNum='+sortNum+'&hadedIds='+encodeURI('null'),dealFunc);
	}
}

//页面刷新恢复原申请模块
function refreshPage(){
	if(sessionStorage.getItem('olddata')){
		let olddataJson = sessionStorage.getItem('olddata');
		let olddata = JSON.parse(olddataJson);
		let blocks = document.getElementById('blocks');
		let button = document.getElementById('get-data-button');
		let blockArr = dataApply(olddata);
		for(let block of blockArr){
			blocks.insertBefore(block,button);
		}
	}
}

//热门搜索数据更新
function getHot(){
	function dealFunc(){
		if(this.readyState==4){
			if(this.status == 200){
				let hot = document.getElementById('hot');
				let ol = document.createElement('ol');
				let returnResult = JSON.parse(this.responseText);
				let liArr = Object.keys(returnResult);
				for(let key of liArr){
					let li = document.createElement('li');
					let link = document.createElement('a');
					link.id = key;
					link.href = '#';
					link.innerHTML =returnResult[key].keyword;
					let keyword = link.innerText||link.textContent;
					setHrefFunc.re_keywordSetHref(link,keyword);
					li.appendChild(link);
					ol.appendChild(li);
				}
				hot.appendChild(ol);
			}
		}
	}
	AjaxFuncGet('./testdata/hot.json',dealFunc);
}

//绑定top中a标签的函数，根据不同的排序需要申请问题
function topLinkBound(link){
	if(sortNum != link.id){
		sortNum = link.id;
		if(document.getElementById('blocks')){
			let blocks = document.getElementById('blocks');
			blocks.innerHTML = null;
			let button = document.createElement('button');
			button.id = 'get-data-button';
			button.innerHTML = '加载更多';
			button.onclick = getBlock;
			blocks.appendChild(button);
		}
		sessionStorage.clear();
		getBlock();
	}
}


//提问表单准备函数
function prepareGiveQuesitonForm(){
	if(document.getElementById('question-input-form')) return false;
	let giveQuestion = function(){
		let infor = {};
		let username = myCookie.getCookies("username");
		let addr = myCookie.getCookies("addr");
		infor.username = username;
		infor.addr = addr;
		let title = document.getElementById('title-input');
		let content = document.getElementById('content-input');
		if(title.value==""||title.value.trim()==""||content.value==""||content.value.trim()==""){
			alert("标题和正文不能为空噢！");
			return false;
		}else{
			infor.title = title.value;
			infor.content = content.value;
			let dealFunc = function(){
				if(this.readyState==4){
					if(this.status ==200){
						
						let result=JSON.parse(this.responseText);
						if(result.status==1){
							let formContainer = document.getElementById('question-form-container');
							alert(result.comment);
							formContainer.style.display = 'none';
						}else{
							alert(result.comment);
						}
					}
				}
			}
			AjaxFuncGet('./testdata/giveqs.json',dealFunc);
			//AjaxFuncPost('./testdata/giveqs.json',dealFunc,infor)
		}
	}
	let dealFunc = function(){
		if(this.readyState ==4){
			if(this.status==200){
				let formContainerDiv = document.createElement('div');
				formContainerDiv.innerHTML=this.responseText;
				document.getElementById('myheader').appendChild(formContainerDiv);
				let giveqs_form = document.getElementById('question-form');
				giveqs_form.onsubmit = function(){
					giveQuestion();
					return false;
				}
				//不足：低版本ie会出现问题，因为无法设置捕获阶段触发机制
				//容器在捕获阶段触发，子元素在冒泡阶段触发，使得子元素总在父元素之后触发
				let formContainer = document.getElementById('question-form-container');
				let handlerOuter = function(){
					this.style.display = 'none';
				}
				formContainer.addEventListener('click',handlerOuter,true);
				
				let loginOrRegistry = document.getElementById('question-form');
				let handlerInner = function(){
					formContainer.style.display = 'block';
				}
				loginOrRegistry.addEventListener('click',handlerInner,false);
				let loginButton = document.getElementById('give-question-button');
				loginButton.onclick = function(){
					let addr = myCookie.getCookies('addr');
					let username = myCookie.getCookies('username');
					if(addr!=undefined&&username!=undefined){
						formContainer.style.display = 'block';
					}else{
						alert('提问前请先注册登录噢!');
						return false;
					}
				}
			}
		}
	}
	AjaxFuncGet_sync('giveqs_form.txt',dealFunc);
}


function prepareOfTopAndBlock(){
	//button
	let button = document.getElementById('get-data-button');
	button.onclick = getBlock;
	//top中的a标签
	let topBr = document.getElementById('TOP-br');
	let links = topBr.getElementsByTagName('a');
	for(let i =0;i<links.length;i++){
		links[i].onclick = function(){
			topLinkBound(this);
		};//赋值函数引用，而不是函数运算结果
	}
	let keywordForm = document.getElementById('keyword-search');
	let keywordFormInput = document.getElementById('keyword-search-input');
	keywordForm.onsubmit = function(){
		if(keywordFormInput.value.trim()){
			return true;
		}else{
			alert("搜索符不能为空噢");
			return false;
		}
	}
}
