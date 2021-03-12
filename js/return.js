		function pageControl(){
			function pageChange(btn){
				let clickNum = (btn.firstChild.nodeValue)-1;
				let nowPage = pagesArrs[active];
				let clickPage = pagesArrs[clickNum];
				nowPage.style.display = 'none';
				clickPage.style.display = 'block';
				active=clickNum;
			}
			if(!document.getElementById('blocks')){
				throw new Error("can't find id 'blocks'");
				return false;
			}
			if(!document.getElementById('page_control')){
				throw new Error("can't find id 'page_control' ");
				return false;
			}
			if(!document.getElementById('pages-btn-block')){
				throw new Error("can't find id 'pages-btn")
			}
			let pageControl = document.getElementById('page_control');
			let blockContainer = document.getElementById('blocks');
			let blocks = blockContainer.querySelectorAll('.block');
			let blocksArr = [].slice.call(blocks);
			let blockNum = blocksArr.length;
			if(blockNum === 0) return false;
			let pagesBtnBlock = document.getElementById('pages-btn-block');
			const NUM = 8;
			let active = 0;
				let pagesNum = Math.ceil(blockNum/NUM);
				for(let j=0;j<pagesNum;j++){
					let button = document.createElement('button');
					button.innerHTML = j+1;
					pagesBtnBlock.appendChild(button);
				}
				let pagesArrs = [];
				for(let i=0;i<pagesNum;i++){
					let div = document.createElement('div');
					div.id = 'page'+(i+1);
					div.style.display='none';
					if((i+1)*NUM>blockNum){
						(blocksArr.slice(i*NUM,blockNum)).forEach(function(x){
							div.appendChild(x);
						});
					}else{
						(blocksArr.slice(i*NUM,(i+1)*NUM)).forEach(function(x){
							div.appendChild(x);
						});
					}
					pagesArrs[i] = div;
				}
				pagesArrs.forEach(function(x){
					blockContainer.insertBefore(x,pageControl);
				});
				pagesArrs[active].style.display = 'block';
				let pageBtns = pagesBtnBlock.getElementsByTagName('button');
				for(let k = 0;k<pageBtns.length;k++){
					pageBtns[k].onclick = function(){
						pageChange(this);
					}
				}
		}
		
		function reGetBlock(){
			let keyword;
			let myaddr;
			if(GetURLQueryString('keyword')){
				keyword = GetURLQueryString('keyword');
			}
			if(GetURLQueryString('addr')){
				myaddr = GetURLQueryString('myaddr');
			}
			function dealFunc(){
				if(this.readyState ==4){
					console.log('ok');
					if(this.status==200){
						console.log('here');
						let blocks = document.getElementById('blocks');
						let pageControl = document.getElementById('page_control');
						let nowdata =JSON.parse(this.responseText);
						let blockArr = dataApply(nowdata);
						for(let block of blockArr)
							blocks.insertBefore(block,pageControl);
						}
					}
			}
			if(keyword){
				let addr = '';
				if(myCookie.getCookies("addr")){
					addr = myCookie.getCookies("addr")
				}
				AjaxFuncGet_sync('./testdata/return.json?keywords='+encodeURI(keyword),dealFunc);
			}else if(myaddr){
				AjaxFuncGet_sync('./testdata/return.json?addr='+encodeURI(myaddr) ,dealFunc);
			}else{
				return false;
			}
		}