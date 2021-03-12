function addLikeNum(){
	let username = myCookie.getCookies('username');
	let addr = myCookie.getCookies('addr');
	let infor = {};//
	if(addr!=undefined&&username!=undefined){
		let qsid = GetURLQueryString('qsid');
		if(!qsid) return false;
		let questionIdNode = document.getElementById('question-id');
		let questionId = questionIdNode.innerText||questionIdNode.textContent;
		infor.qsid = questionId;
		infor.useraddr = addr;
		let dealFunc = function(){
			if(this.readyState ==4){
				if(this.status==200){
					let dealReturn = JSON.parse(this.responseText);
					if(dealReturn.result==1){
						let likeNumButton = document.getElementById('qsbr-likeNum');
						likeNumButton.innerText = dealReturn.likeNum;
						console.log('添加成功');
					}else if(dealReturn.result==0){
						console.log("添加失败");
					}
				}
			}
		}
		AjaxFuncGet('./testdata/quesion_addlike.json',dealFunc);
		//AjaxFuncPost('./testdata/question_addlike.json',dealFunc,infor);
	}else{
		alert('点赞评论需要先登录噢');
		return false;
	}
}

function answerQuestion(){
	let username = myCookie.getCookies('username');
	let addr = myCookie.getCookies('addr');
	let infor = {};//
	let qsid = GetURLQueryString('qsid');
	if(addr!=undefined&&username!=undefined){
		let answerTextarea = document.getElementById('answer-textarea');
		if(!qsid) return false;
		if(!answerTextarea.value.trim()){
			alert('回复不能为空噢');
			return false;
		}
		infor.answer = answerTextarea.value;
		infor.addr = addr;
		infor.qsid = qsid;
		let dealFunc = function(){
			if(this.readyState==4){
				if(this.status==200){
					let result = JSON.parse(this.responseText);
					if(result.status==1){
						let detail = result.detail;
						let answer = document.getElementById('answer-box');
						let answerblock = document.createElement('div');
						answerblock.id = detail.id;
						answerblock.classList.add('answer');
						let span = document.createElement('a');
						setHrefFunc.re_addrSetHref(span,detail.addr);
						setInnerText(span,detail.username);
						let colon = document.createTextNode(":");
						let comment_text = document.createTextNode(detail.comment);
						let answerBtn = document.createElement('button');
						answerBtn.classList.add("answer-btn");
						setInnerText(answerBtn,"回复");
						answerBtn.onclick = function(){
							let username = myCookie.getCookies("username");
							let addr = myCookie.getCookies("addr");
							if(addr!=undefined&&username!=undefined){
								let newcomment = prompt("回复:");
								if(typeof newcomment == "string"){
									if(newcomment.trim()){
										answerComment(addr,qsid,detail.id,newcomment);
									}
									else{
										alert('回复信息不能为空噢');
										return false;
									}
								}else{
									alert('回复信息不能为空噢');
									return false;
								}
							}else{
								alert("点赞评论需要先登录噢");
								return false;
							}
						}
						myAppendChild(answerblock,span,colon,comment_text,answerBtn);
						answer.appendChild(answerblock);
					}else{
						return false;
					}
				}
			}
		}
		//test with get
		AjaxFuncGet('./testdata/question_answerQuestion.json',dealFunc);
		//AjaxFuncPost('./testdata/question_answerQuestion.json',dealFunc,infor);
	}else{
		alert('点赞评论需要先登录噢');
		return false;
	}
}


function answerComment(addr,qsid,answerid,comment){
	let infor = {};
	infor.addr = addr;
	infor.qsid = qsid;
	infor.answerid = answerid;
	infor.comment = comment;
	let dealFunc = function(){
		if(this.readyState==4){
			if(this.status==200){
				let result = JSON.parse(this.responseText);
				if(result.status==1){
					let detail = result.detail;
					let answerblock = document.getElementById(detail.answerid);
					let toCommentBlock = document.createElement('div');
					toCommentBlock.id = detail.id;
					toCommentBlock.style.marginLeft = "2em";
					let nameButton = document.createElement('a');
					nameButton.title = "查看 "+detail.username+" 的提问";
					setHrefFunc.re_addrSetHref(nameButton,detail.addr)
					setInnerText(nameButton,detail.username);
					let text = document.createTextNode('回复');
					let targetnameButton = document.createElement('a');
					targetnameButton.title = "查看 "+detail.targetname+' 的提问';
					setHrefFunc.re_addrSetHref(targetnameButton,detail.targetaddr);
					setInnerText(targetnameButton,detail.targetname);
					let c = document.createTextNode(':');
					let innerComment = document.createTextNode(detail.comment);
					let answerButton = document.createElement('button');
					answerButton.classList.add("answer-btn");
					setInnerText(answerButton,"回复");
					answerButton.onclick = function(){
						let username = myCookie.getCookies("username");
						let addr = myCookie.getCookies("addr");
						if(addr!=undefined&&username!=undefined){
							let qsid = GetURLQueryString('qsid');
							let newcomment = prompt("回复:");
							if(typeof newcomment == "string"){
								if(newcomment.trim()){
									answerComment(addr,qsid,detail.answerid,newcomment);
								}
								else{
									alert('回复信息不能为空噢');
									return false;
								}
							}else{
								alert('回复信息不能为空噢');
								return false;
							}
						}else{
							alert("点赞评论需要先登录噢");
							return false;
						}
					}
					myAppendChild(toCommentBlock,nameButton,text,targetnameButton,c,innerComment,answerButton);
					if(detail.where==1){
						answerblock.appendChild(toCommentBlock);
					}else if(detail.where==2){
						answerblock.parentNode.insertBefore(toCommentBlock,answerblock.nextSibling);
					}
				}else{
					alert("评论失败!");
					return false;
				}
			}
		}
	}
	AjaxFuncGet('./testdata/comment.json',dealFunc);
	//AjaxFuncPost('./testdata/comment.json',dealFunc,infor);
}

function getQuestion(){
	let qsid = GetURLQueryString('qsid');
	//回复评论
	let getAnswer = function(answer){
		let block = document.createElement('div');
		block.id = 'answer';
		let arr = Object.keys(answer);
		for(let key of arr){
			let answerToHost = answer[key];
			let toHostBlock = document.createElement('div');
			toHostBlock.id = key;
			toHostBlock.classList.add('answer');
			let usernameButton = document.createElement('a');
			usernameButton.title = "查看 "+answerToHost.username+" 的提问";
			setHrefFunc.re_addrSetHref(usernameButton,answerToHost.addr);
			setInnerText(usernameButton,answerToHost.username);
			let colon = document.createTextNode(':');
			let comment = document.createTextNode(answerToHost.comment);
			let answerBtn = document.createElement('button');
			answerBtn.classList.add("answer-btn");
			setInnerText(answerBtn,"回复");
			answerBtn.onclick = function(){
				let username = myCookie.getCookies("username");
				let addr = myCookie.getCookies("addr");
				if(addr!=undefined&&username!=undefined){
					let qsid = GetURLQueryString("qsid");
					let newcomment = prompt("回复:");
					
					if(typeof newcomment == "string"){
						if(newcomment.trim()){
							answerComment(addr,qsid,key,newcomment);
						}else{
							alert('回复信息不能为空噢');
							return false;
						}
					}else{
						alert('回复信息不能为空噢');
						return false;
					}
				}else{
					alert("点赞评论需要先登录噢");
					return false;
				}
			}
			myAppendChild(toHostBlock,usernameButton,colon,comment,answerBtn);
			if(answerToHost.answer){
				let answerToComments = answerToHost.answer;
				let answerToCommentsArr = Object.keys(answerToComments);
				for(let newkey of answerToCommentsArr){
					let answerToComment = answerToComments[newkey];
					let toCommentBlock = document.createElement('div');
					toCommentBlock.id = newkey;
					toCommentBlock.style.marginLeft = "2em";
					let nameButton = document.createElement('a');
					nameButton.title = "查看 "+answerToComment.username+" 的提问";
					setHrefFunc.re_addrSetHref(nameButton,answerToComment.addr)
					setInnerText(nameButton,answerToComment.username);
					let text = document.createTextNode('回复');
					let targetnameButton = document.createElement('a');
					targetnameButton.title = "查看 "+answerToComment.targetname+' 的提问';
					setHrefFunc.re_addrSetHref(targetnameButton,answerToComment.targetaddr);
					setInnerText(targetnameButton,answerToComment.targetname);
					let c = document.createTextNode(':');
					let innerComment = document.createTextNode(answerToComment.comment);
					let answerButton = document.createElement('button');
					answerButton.classList.add("answer-btn");
					setInnerText(answerButton,"回复");
					answerButton.onclick = function(){
						let username = myCookie.getCookies("username");
						let addr = myCookie.getCookies("addr");
						if(addr!=undefined&&username!=undefined){
							let qsid = GetURLQueryString("qsid");
							let newcomment = prompt("回复:");
							if(typeof newcomment == "string"){
								if(newcomment.trim()){
									answerComment(addr,qsid,newkey,newcomment);
								}
								else{
									alert('回复信息不能为空噢');
									return false;
								}
							}else{
								alert('回复信息不能为空噢');
								return false;
							}
							
						}else{
							alert("点赞评论需要先登录噢");
							return false;
						}
					}
					myAppendChild(toCommentBlock,nameButton,text,targetnameButton,c,innerComment,answerButton);
					toHostBlock.appendChild(toCommentBlock);
				}
			}
			block.appendChild(toHostBlock);
		}
		return block;
	}
	let dealFunc = function(){
		if(this.readyState==4){
			if(this.status==200){
				let result = JSON.parse(this.responseText);
				if(result.status==1){
					let detail = result.detail;
					//问题内容部分
					let qs_idElem = document.getElementById('question-id');
					let qs_titleElem = document.getElementById('question-title');
					let qs_contentElem = document.getElementById('question-content');
					setInnerText(qs_idElem,detail.qsid);
					setInnerText(qs_titleElem,detail.title);
					setInnerText(qs_contentElem,detail.content);
					let qsbr_likeNumElem = document.getElementById('qsbr-likeNum');
					let qsbr_contentNumElem = document.getElementById('qsbr-contentNum');
					let qsbr_usernameElem = document.getElementById('qsbr-username');
					let qsbr_timeElem = document.getElementById('qsbr-time');
					let detail_qs = detail.questionbr;
					setInnerText(qsbr_likeNumElem,detail_qs.likeNum);
					setInnerText(qsbr_contentNumElem,detail_qs.contentNum);
					setInnerText(qsbr_usernameElem,detail_qs.username);
					setHrefFunc.re_addrSetHref(qsbr_usernameElem,detail.useraddr);
					setInnerText(qsbr_timeElem,detail_qs.givetime);
					//answer循环部分
				   if(Object.keys(detail.answer).length!=0){
					   let detail_answer = detail.answer;
					   let answerBox = document.getElementById('answer-box');
					   let block = getAnswer(detail_answer);
					   answerBox.appendChild(block);
				   }
				}else{
					alert('没有查找到指定问题')
					return false;
				}
			}
		}
	}
	if(qsid){
		AjaxFuncGet_sync('./testdata/question_detail.json?qsid='+encodeURI(qsid),dealFunc)
	}
}

function questionPrepare(){
			if(document.getElementById('qsbr-contentNum')){
				let contentButton = document.getElementById('qsbr-contentNum');
				contentButton.onclick = function(){
					window.location.hash = '#answer-textarea';
					document.getElementById('answer-textarea').focus();
				}
			}
			if(document.getElementById('qsbr-likeNum')){
				let likeNumButton = document.getElementById('qsbr-likeNum');
				likeNumButton.onclick = function(){
					addLikeNum();
				}
			}
			if(document.getElementById('anwser-button')){
				let asBtn = document.getElementById('anwser-button');
				asBtn.onclick=function(){
					answerQuestion();
				}
			}
}