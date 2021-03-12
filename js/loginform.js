//优化：函数封装成类，避免不必要的全局变量，不好控制

	//未选盒子input元素清空
function clearInput(element) {
	    let queue = []; //存放子节点的队列
	    while(element) {
			if(element.tagName.toLowerCase()=='input'){
				element.value = '';	
			}
	        if(element.children.length !== 0) {
	            for (let i = 0; i < element.children.length; i++) {
	               queue.push(element.children[i]);//存放子节点
	            }
	       }
	        element = queue.shift(); //取出第一项
	    }
	}

//获取需要操作盒子的id
function getCheckedId(){
	let reg = /\w+(?=radio)/;
	let todoId = document.querySelector('.choicebox input:checked').id;
	return todoId.match(reg)[0]+"box";
}

//盒子弹出函数
function showbox(){
	let reg = /\w+(?=radio)/;
	let initialId = getCheckedId();
	let initialbox = document.getElementById(initialId);
	
	initialbox.style.display = 'table';
	
	let radios = document.getElementsByClassName('choicebox')[0].querySelectorAll('input[type="radio"]')
	for(let i =0;i<radios.length;i++){
		radios[i].onclick = function(){
			//先把没有被选择的设置为display:none
			let otherboxid = document.querySelector('.choicebox input:not(:checked)').id;
			let otherbox = document.getElementById(otherboxid.match(reg)+"box");
			otherbox.style.display = 'none';
			
			let todoboxId = getCheckedId();
			let todobox = document.getElementById(todoboxId);
			todobox.style.display = 'table';
		}
	}
}

//表单提交控制函数
//选中盒子提交时不能为空,且删除另一个盒子的所有内容
//登录名长度不超过20个字符，且为邮箱格式
//密码大于6小于18个字符，只能包括数字、字母、下划线
function submitControl(){
	//登录名称控制
	let nameControl = function(value){
		let regStr = /^[a-zA-Z0-9_-]{4,16}$/g;
		if(value.match(regStr)==value) return true;
		return false;
	}
	
	//邮箱控制
	let addrControl = function(value){
		let reg = /[0-9a-zA-Z]+@[0-9a-zA-Z]+.[a-z]+/g;
		if(value.match(reg)==value&&value.length<=20&&value.length>=6) return true;
		return false;
	}
	//密码控制
	let passwordControl = function(value){
		let reg = /[0-9a-zA-Z_]+/g;
		if(value.match(reg)==value&&value.length<=18&&value.length>=6) return true;
		return false;
	}
	
	let inputControl = function(element){
		let queue = []; //存放子节点的队列
		while(element) {
			if(element.tagName.toLowerCase()=='input'&&(element.type.toLowerCase()=='text'||element.type.toLowerCase()=='password')){
				if(element.value==''){
					//添加个提示
					element.focus();
					return false;
				}else{
					let value = element.value;
					let addrResult = false;
					let passwordResult = false;
					let nameControlResult = false;
					if(element.id.toLowerCase()=='registryname'){
						nameControlResult = nameControl(value);
						console.log("name:"+nameControlResult);
					}else if(element.type.toLowerCase()=='text'){
						addrResult = addrControl(value);
						console.log('addr:'+addrResult)
					}else if(element.type.toLowerCase()=='password'){
						 passwordResult = passwordControl(value);
						 console.log('password:'+passwordResult);
					}
					if(!(passwordResult||addrResult||nameControlResult)){
						element.focus();
						return false;
					}
				}
			}
		    if(element.children.length !== 0) {
		        for (let i = 0; i < element.children.length; i++) {
		           queue.push(element.children[i]);//存放子节点
		        }
		   }
		    element = queue.shift(); //取出第一项
		}
		let pw = document.getElementById('registrypassword');
		let pwa = document.getElementById('passwordagain');
		if(pw.value===pwa.value){
			return true;
		}else{
			alert('两次密码不一致！重新输入亲');
			pw.focus();
			return false;
		}
	}
	
	//未选中盒子
	let reg = /\w+(?=radio)/;
	let otherboxid = document.querySelector('.choicebox input:not(:checked)').id;
	let otherbox = document.getElementById(otherboxid.match(reg)+"box");
	clearInput(otherbox);
	
	let checkedId = getCheckedId();
	let checkedBox = document.getElementById(checkedId);
	let checkResult = inputControl(checkedBox);
	return checkResult;
}

//登录注册操作
//注册成功重新登录,登陆成功记录cookie信息,之后点赞和评论都通过cookie判断用户信息
function loginResultDeal(){
	//设置传递信息
	let infor = {};
	let checkedId = getCheckedId();
	let checkedBox = document.getElementById(checkedId);
	infor.deal = document.querySelector('.choicebox input:checked').value;
	if(infor.deal==1){
		if(document.getElementById('loginaddr')){
			infor.addr = document.getElementById('loginaddr').value;
		}else{
			infor.addr = '';
		}
		if(document.getElementById('loginpassword')){
			infor.password = document.getElementById('loginpassword').value;
		}else{
			infor.password = ''
		}
	}else if(infor.deal ==2){
		if(document.getElementById('registryname')){
			infor.username=document.getElementById('registryname').value;
		}else{
			infor.username = '';
		}
		if(document.getElementById('registryaddr')){
			infor.addr = document.getElementById('registryaddr').value;
		}else{
			infor.addr = '';
		}
		if(document.getElementById('registrypassword')){
			infor.password = document.getElementById('registrypassword').value;
		}else{
			infor.password = '';
		}
	}

	let loginDealFunc = function(){
		if(this.readyState==4){
			console.log('返回成功');
			if(this.status==200){
				console.log('请求成功');
				let result = this.responseText;
				let obj = JSON.parse(result);
				//返回信息：成功：操作状态+用户名和邮箱；失败：操作状态+备注信息
				//状态信息——0：登录失败；1：登陆成功；2：注册失败;3:注册成功
				//信息格式：Json字符串
				if(Object.keys(obj).length){
					let status = obj.status;
					let comment = '请求备注信息';
					comment = obj.comment;
					if(status==0||status==2){
						alert(comment);
						return false;
					}
					if(status==1||status ==3){
						//问题：插入脚本即可访问用户的密码，所以需要清空
						let formContainer = document.getElementById('form-container');
						formContainer.style.display = 'none';
						clearInput(document.getElementById('loginbox'));
						clearInput(document.getElementById('registrybox'));
						//登录成功
						let username = '用户名称';
						username = obj.username;
						let addr = '邮箱地址';
						addr = obj.addr;
						myCookie.setCookies('addr',addr,7);
						myCookie.setCookies('username',username,7);
						alert('你好!'+username+'!欢迎访问Astick!');
						outDeal(username,addr);
					}
				}else{
					throw new Error('返回信息解析失败');
					return false;
				}
			}
		}
	}
	AjaxFuncGet('./testdata/login.json',loginDealFunc);
	//AjaxFuncPost('./testdata/llogin.json',loginDealFunc,infor);
}

function outDeal(username,addr){
	let outFunc = function(username,addr){
		let checkResult = confirm('确定要退出登录吗？');
		if(!checkResult) return false;
		myCookie.deleteCookies('username',username);
		myCookie.deleteCookies('addr',addr);
		let loginButton = document.getElementById('login-or-registry-button');
		loginButton.style.display = 'inline';
		let outButtonContainer = document.getElementById('out-button-container');
		outButtonContainer.parentNode.removeChild(outButtonContainer);
	};
	let loginButton = document.getElementById('login-or-registry-button');
	loginButton.style.display = 'none';
	let loginButtonContainer = document.getElementById('login-button-container');
	let outButtonContainer = document.createElement('div');
	outButtonContainer.id = 'out-button-container';
	let loginedName = document.createElement('a');
	loginedName.title = "查看我的提问";
	setHrefFunc.re_addrSetHref(loginedName,addr)
	loginedName.style.display = 'inline';
	loginedName.innerHTML="Hello!"+ username;
	let outButton = document.createElement('button');
	outButton.id = 'outButton';
	outButton.innerHTML = '退出';
	outButton.onclick = function(){
		outFunc(username,addr);
	};
	outButtonContainer.appendChild(loginedName);
	outButtonContainer.appendChild(outButton);
	loginButtonContainer.appendChild(outButtonContainer);
}
	
//页面加载自动登录
function autoLogin(){
	let addr = myCookie.getCookies('addr');
	let username = myCookie.getCookies('username');
	if(addr!=undefined&&username!=undefined){
		outDeal(username,addr);
	}else{
		console.log('之前未登录');
	}
}

//表单准备函数
function submitClick(){
	//表单控制函数准备
	let submitform = document.getElementById('login-or-registry');
	submitform.onsubmit = function(){
		let result = submitControl();
		if(result){
			loginResultDeal();
		}
		return false;
	}
	submitform.onreset = function(){
		var login = document.getElementById('loginradio');
		login.click();
	}
}

