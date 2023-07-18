window.onload = function () {
    //记录缩略图下标
    var bigimgIndex = 0;

    //路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        //获取导航的样式对象
        var navPath = document.querySelector('#navPath');
        //获取数据
        var path = goodData.path;
        //遍历数据
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                var aNode = document.createElement("a");
                aNode.innerHTML = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerHTML = path[i].title;
                //创建i标签
                var iNode = document.createElement('i');
                iNode.innerText = '/';
                //让navPath元素追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);

            }

        }

    }

    //放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        /**
         * 思路：
         * 1、获取小图框元素对象，并且设置移入事件(onmouseenter)
         * 2、动态的创建蒙版元素以及大图框和大图片元素
         * 3、移出时(onmouseleave)需要移除蒙版元素和大图框
         */

        //1.获取小图框元素
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        //获取leftTop元素
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');
        var imagessrc = goodData.imagessrc;

        //2.设置移入事件
        smallPic.onmouseenter = function () {

            //3. 创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //4.创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            //5.创建大图片元素
            var BigImg = document.createElement('img');
            BigImg.src = imagessrc[bigimgIndex].b;

            //6.大图框来追加大图片
            BigPic.appendChild(BigImg);

            //7.让小图框来追加蒙版元素
            smallPic.appendChild(maskDiv);

            //8.让leftTop元素追加大图框
            leftTop.appendChild(BigPic);


            //设置移动事件
            smallPic.onmousemove = function (event) {
                //event.clientX: 鼠标点距离浏览器左侧X轴的值
                //getBoundingClientRect().left:小图框元素距离浏览器左侧可视left值
                //offsetWidth:为元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                if (left < 0) {
                    left = 0
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if (top < 0) {
                    top = 0
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }

                //设置left和top属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth);
                // 
                BigImg.style.left = -left / scale + "px";
                BigImg.style.top = -top / scale + "px";

            }


            //设置移出事件
            smallPic.onmouseleave = function () {

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }
        }
    }
    //动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData() {
        var ul = document.querySelector('#piclist ul');
        var imagessrc = goodData.imagessrc;
        for (var i = 0; i < imagessrc.length; i++) {
            var newLi = document.createElement('li');
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;
            newLi.appendChild(newImg);
            ul.appendChild(newLi);

        }
    }
    //点击缩略图
    thumbnailClick();
    function thumbnailClick() {
        var smallPic_img = document.querySelector('#smallPic img')
        var liNode = document.querySelectorAll('#piclist ul li');
        var imagessrc = goodData.imagessrc;
        //保证大小图一样
        smallPic_img.src = imagessrc[0].s;

        for (var i = 0; i < liNode.length; i++) {
            liNode[i].index = i;
            liNode[i].onclick = function () {
                var idx = this.index;
                bigimgIndex = idx;
                //变化小图路径
                smallPic_img.src = imagessrc[idx].s;

            }
        }
    }
    //点击左右箭头
    thumbnaiLftRightlClick();
    function thumbnaiLftRightlClick() {
        //获取按钮
        var prev = document.querySelector('.prev');
        var next = document.querySelector('.next');
        //    console.log(prev, next)
        // var piclist = document.querySelector('#piclist');
        var ul = document.querySelector('#piclist ul');
        var liNodes = document.querySelectorAll('#piclist ul li');
        //计算
        var start = 0;
        //步长
        var step = (liNodes[0].offsetWidth + 20) * 2;
        //总体运动的距离值 = ul宽 - div宽
        var endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);
        //发生事件
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + "px";
        }
        next.onclick = function () {
            start += step;
            if (start > endPosition) {
                start = endPosition;
            }
            ul.style.left = -start + "px";
        }
    }
    //商品详情动态数据选渲染
    rightTopData();
    function rightTopData() {
        /**
         * rightTop
         * goodDaata里的goodDatail
         * 建立字符串变量，原来的结果粘进来，将所对应的数据放在对应的位置上重新渲染上去
         */
        var rightTop = document.querySelector('.rightTop');
        // console.log(rightTop)
        var goodsDetail = goodData.goodsDetail;
        // console.log(goodsDetail)
        var s = `<h3>${goodsDetail.title}</h3>
        <p>${goodsDetail.recommend}</p>
        <div class="priceWrap">
            <div class="priceTop">
                <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                <div class="price">
                    <span>￥</span>
                    <p>${goodsDetail.price}</p>
                    <i>降价通知</i>
                </div>
                <p>
                    <span>累计评价</span>
                    <span>${goodsDetail.evaluateNum}</span>
                </p>
            </div>
            <div class="priceBottom">
                <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                <p>
                    <span>${goodsDetail.promoteSales.type}</span>
                    <span>${goodsDetail.promoteSales.content}</span>
                </p>

            </div>
        </div>
        <div class="support">
            <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
            <p>${goodsDetail.support}</p>
        </div>
        <div class="address">
            <span>配&nbsp;&nbsp;送&nbsp;&nbsp;至</span>
            <p>${goodsDetail.address}</p>
        </div>`;
        //渲染rightYop元素
        rightTop.innerHTML = s;
    }
    //商品参数的动态数据渲染
    rightBottomData();
    function rightBottomData() {
        var chooseWrap = document.querySelector('.chooseWrap');
        // console.log(chooseWrap)
        var crumbData = goodData.goodsDetail.crumbData;
        // console.log(crumbData)
        for (var i = 0; i < crumbData.length; i++) {
            var dlNode = document.createElement('dl');
            var dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;
            dlNode.appendChild(dtNode);
            //遍历dd
            for (j = 0; j < crumbData[i].data.length; j++) {
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                //给每个DD加自定义属性
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice);
                dlNode.appendChild(ddNode);

            }
            chooseWrap.appendChild(dlNode);
        }
    }

    //点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind() {
        /**
         * 每一行dd文字颜色排他
         * 思路：
         * 1、获取所有的dl元素，取其中第一个dl元素下的所有dd先做测试，
         *   测试完毕之后在对应dl第一行下标的前面在嵌套一个for循环，目的在变换下标
         * 2、循环所有的dd元素并且添加点击事件
         * 3、确定实际发生事件的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都重置为基础颜色(#666)
         * ==========================================================================================
         * 
         * 
         * 点击dd之后产生的mark标记
         * 思路：
         * 1、首先先来创建一个可以容纳点击的dd元素值的容器（数组），确定数组的起始长度,在添加一些默认值
         * 2、然后再将点击的dd元素的值按照对应下标来写入到数组的元素身上
         */

        //1、找第一个dl下的所有的dd元素
        var dlNodes = document.querySelectorAll(' .chooseWrap dl');

        var arr = new Array(dlNodes.length);

        var choose = document.querySelector('.choose');

        //数组填充值
        arr.fill(0);

        // console.log(arr); // [0, 0, 0, 0]

        for (var i = 0; i < dlNodes.length; i++) {

            (function (i) {

                var ddNodes = dlNodes[i].querySelectorAll('dd');

                //2、遍历当前所有的dd元素
                for (var j = 0; j < ddNodes.length; j++) {

                    ddNodes[j].onclick = function () {
                        // console.log(i);
                        //  console.log(ddNodes[i]); // undefined
                        //this：表示哪一个元素真实的发生了事件
                        // console.log(this);

                        //清空choose元素
                        choose.innerHTML = "";

                        for (var k = 0; k < ddNodes.length; k++) {
                            ddNodes[k].style.color = "#666";
                        }

                        /**
                         * ddNodes[0].style.color = "#666";
                         * ddNodes[1].style.color = "#666";
                         * ddNodes[3].style.color = "#666";
                         */

                        //假设点击的是第二个元素，下标为1'
                        //ddNodes[1].style.color = "red";
                        //相同下标的dd元素的字体颜色在进行覆盖操作,而其他未点击的元素都是在进行重新设置颜色
                        this.style.color = "red";


                        //点击哪一个dd元素动态的产生一个新的mark标记元素
                        arr[i] = this;
                        // arr[i] = this.innerText;
                        changePriceBind(arr);

                        //遍历arr数组，将非0元素的值写入到mark标记
                        arr.forEach(function (value, index) {
                            //只要是为真的条件，咱们就动态的来创建mark标签
                            if (value) {
                                //创建div元素
                                var markDiv = document.createElement('div');
                                //并且设置class属性
                                markDiv.className = 'mark';
                                //并且设置值
                                // markDiv.innerText = value;
                                markDiv.innerText = value.innerText;
                                //创建a元素
                                var aNode = document.createElement('a');
                                //并且设置值
                                aNode.innerText = 'X';
                                //设置下标
                                aNode.setAttribute('index', index);
                                //让div追加a 
                                markDiv.appendChild(aNode);

                                //让choose元素追加div
                                choose.appendChild(markDiv);

                            }
                        })
                        // 获取所有的a标签元素玄幻发生点击事件
                        var aNodes = document.querySelectorAll('.mark a ');
                        // console.log(aNodes)
                        for (var n = 0; n < aNodes.length; n++) {
                            aNodes[n].onclick = function () {
                                //获取点击的a
                                var idx1 = this.getAttribute('index');
                                // console.log(idx1)
                                //恢复数组中对应下标数组的值
                                arr[idx1] = 0;
                                var ddlist = dlNodes[idx1].querySelectorAll('dd');
                                for (var m = 0; m < ddlist.length; m++) {
                                    ddlist[m].style.color = "#666";
                                }
                                ddlist[0].style.color = 'red';
                                choose.removeChild(this.parentNode);
                                //调整价格
                                changePriceBind(arr);

                            }
                        }

                    }
                }
            })(i)


        }

    }
    //价格变动
    //点击dd的时候才调用
    function changePriceBind(arr) {
        //获取价格
        var oldPrice = document.querySelector('.price p');
        //去除默认价格
        var price = goodData.goodsDetail.price;
        //给dd设自定义属性记录变化价格
        //遍历arr数组，给dd加价格数据
        for(var i = 0;i<arr.length;i++){
            if(arr[i]){
                //数据类型强制转换
                var changePrice = Number(arr[i].getAttribute('price'));
                // console.log(arr[i].getAttribute('price'));
                price = price - changePrice;
                //
               
            }
            // console.log(arr[i])
            
        }
        oldPrice.innerText = price;
        var leftPrice = document.querySelector('.listWrap .left p');
        leftPrice.innerText = '￥' + price;
        //选择搭配中的复选框元素
        var ipts = document.querySelectorAll('.middle li div input');
        var newPrice = document.querySelector('.listWrap .right i');
        for(var j = 0 ;j<ipts.length;j++){
            if(ipts[j].checked){
                price+=Number(ipts[j].value);

            }

        }
        newPrice.innerText = '￥' + price;

    }
    //中间区域复选框
    choosePrice();
    function choosePrice(){
        var ipts = document.querySelectorAll('.middle li div input');
        var leftPrice = document.querySelector('.listWrap .left p');
        var newPrice = document.querySelector('.listWrap .right i');
        // console.log(ipts)
        for(var i = 0;i<ipts.length;i++){
            ipts[i].onclick=function(){
                var oldPrice = Number(leftPrice.innerText.slice(1));
                // console.log(oldPrice)
                for(var j = 0;j<ipts.length;j++){
                    if(ipts[j].checked){
                        oldPrice = oldPrice + Number(ipts[j].value);
                    }
                }
                newPrice.innerText = '￥' + oldPrice;
            }
        }

    }
    //封装一个公共的选项卡函数
    function Tab(tabBtns,tabConts){
        for(var i = 0;i<tabBtns.length;i++){
            tabBtns[i].index = i;
            tabBtns[i].onclick = function(){
                for(var j = 0;j<tabBtns.length;j++){
                    tabBtns[j].className = '';
                    tabConts[j].className = ''
                }
                this.className = 'active';
                tabConts[this.index].className = 'active';
            }
        }
    }
    //点击左侧选项卡
    leftTab();
    function leftTab(){
        var h4s = document.querySelectorAll('.asideTop h4');
        var divs = document.querySelectorAll('.asideContent>div');
        // console.log(divs)
        // console.log(h4s)
        Tab(h4s,divs);
    }
    //点击you侧选项卡
    rightTab();
    function rightTab(){
        var lis = document.querySelectorAll('.tabBtns li');
        var divs = document.querySelectorAll('.tabContents div');
        Tab(lis,divs);
    }
    //右边侧边栏点击效果
    // rightASIDEbIND();
    // function rightASIDEbIND(){
    //     var btns = document.querySelector('.btns');
    //     //记录初始状态
    //     var flag = true;
    //     var rightAside = document.querySelector('.rightAside');
    //     btns.onclick = function(){
    //         if(flag){
    //             //展开
    //             // flag = false;
    //             btns.className = "btns btnsOpen";
    //             rightAside.className = "rightAside asideOPen";
    //         }else{
    //             //关闭
    //             // flag = true;
    //             // flag = !flag;
    //             btns.className = "btns btnsClose";
    //             rightAside.className = "rightAside asideClose";
    //         }
    //         flag = !flag;
    //     }
    // }
    rightAsideBind();
    function rightAsideBind(){
        /**
         * 思路：
         * 1、先找到按钮元素，发生点击事件
         * 2、记录一个初始的状态，在点击事件的内容进行判断,如果为关闭则展开，否则为关闭（状态取反）
         * 3、如果为展开则设置按钮和侧边栏对应的class效果，关闭亦如此
         */

        //1、找按钮元素
        var btns = document.querySelector('#wrapper .rightAside .btns');

        //记录初始状态
        var flag = true; //关闭

        //查找侧边栏元素
        var rightAside = document.querySelector('#wrapper .rightAside');

        //2、发生点击事件
        btns.onclick = function(){

             //判断
             if(flag){
                 //展开
                //  flag = false;

                btns.className = "btns btnsOpen";

                rightAside.className = "rightAside asideOpen";

             }else{
                 //关闭
                //  flag = true;
                btns.className = "btns btnsClose"

                rightAside.className = "rightAside asideClose";
             }

             //无论前面的if和else执行的到底是谁，最终flag的状态都是在原来基础之上进行取反
             flag = !flag;
        }
     }
}