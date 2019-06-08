 

//banner轮播图
function banners(){
    len=$(".big li").length;
    // var wid=$(".con").width();
    var wid= '1000'
    var $new=$(".big li:eq(0)").clone();
    $(".big").append($new);
    // $(".big").width((len+1)*wid);
    $(".big").width(7000);
    var myset;
    //滑过效果
    $(".con p").hide();
    $(".con").mouseover(Mouseover);
    $(".con").mouseout(Mouseout);
    function Mouseover(){
        $(".con p").show();
        clear();
    }
    function Mouseout(){
        $(".con p").hide();
        add();
    }
    //banner左右切换
    $(".con p:eq(0)").click(rightfun);
    $(".con p:eq(1)").click(leftfun);
    var kk=0;
    function rightfun(){
        add();
        biao("after");
        $(".big").stop(true).animate({'margin-left':-wid*kk});
        myfocus();
    }
    function leftfun(){
        add();
        biao("before");
        $(".big").stop(true).animate({'margin-left':-wid*kk});
        myfocus();
    }


    function biao(str){
        if(str=="after"){
            kk++;
        }
        else{
            kk--;
        }
        //到最后的时候
        if(kk>len){
            $(".big").css({'margin-left':0});
            kk=1;
        }
        //到最前的时候
        if(kk<0){
            $(".big").css({'margin-left':-wid*len});
            kk=len-1;
        }
    }
    $(".sml li").mouseover(overfun);
    $(".sml li").mouseout(outfun);
    function overfun(){
        clear();
        kk=$(this).index();
        $(".big").stop(true).animate({"margin-left":-wid*kk});
        myfocus();
    }
    function outfun(){
        add();
    }
    //自动轮播
    myset=window.setInterval(every,2500);
    function every(){
        biao("after");
        $(".big").stop(true).animate({'margin-left':-wid*kk});
        myfocus();
    }
    //清除定时器
    function clear(){
        window.clearInterval(myset);
        myset=null;
    }
    //添加定时器
    function add(){
        window.clearInterval(myset);
        myset=null;
        myset=window.setInterval(every,2500);
    }
    function myfocus(){
        var m;
        if(kk==len){m=0;}else{m=kk;}
        $(".sml li").eq(m).addClass('cur').siblings().removeClass('cur');
    }

}




//关在线客服
function closeTrigger1(){
    $('.contentBox').css('display','none')
}
//显示在线客服
function openTrigger1(){
    $('.contentBox').css('display','block')
}
//意见反馈
function view_tickling1(){
    $('#fb_baidu_right_dialog').css('display','block')
    $('#fb_baidu_wizard').css('display','block')
    // $('body').css('overflow','hidden')
}
//悬浮窗是否显示
function web_flow_display(){
    var display = sessionStorage.getItem("display");
   
    if(display){
        web_flow_close()
    }else{

    }
}
//关闭悬浮窗
function web_flow_close(){
    sessionStorage.setItem("display","none1111");
     // $('.web_flow').addClass('web_dis_none');
    $('.web_flow').addClass('web_dis_none1');
}

//输入框随机恋爱对话
function getLoveTalk() {
    var arr = ['我喜欢你','你喜欢谁','爱情是什么','什么是爱情','怎样追到女神','怎样追到男神','你相过亲吗','你对相亲怎么看','你有喜欢的人吗','情人节怎么过','我要找对象','单身狗好孤单','你脱单了吗','我想找个男朋友','我想找个女朋友','单恋会成功吗','在爱情里什么最重要','你谈过恋爱吗','怎样才能脱单','为什么找到合适的人这么难','我喜欢你','你喜欢谁','爱情是什么','什么是爱情','怎样追到女神','怎样追到男神']
    var str = '';
    var iNum = getRandom(1, 20)
    str += arr[iNum+1]
    $('#text').attr('value',str)
}
//随机匹配昨日排行中的机器人
function RandomPairing(){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/company/yesterday/questions_rank"
    }).done(function (data) {
        var data = JSON.parse(data);
        var num = data.length;
        var i = getRandom(0,num-1)
        window.location.href = "/m/newYearRobot/"+ data[i].app_key;
console.log(data)
    }).fail(function (data) {
        console.log(data);

    });
}

//输入框随机祝福语;
function getPlaceholder() {
    var arr = ['你最讨厌的人是谁呀','怎样追到男神','今日新闻','今天有什么新闻','我要看新闻','讲笑话','我要听笑话','来个笑话','给我讲个段子','现在几点了','今天星期几','今天几号','后天几号','昨天礼拜几','现在是什么时间','金牛座运势','狮子座幸运色','处女座健康','白羊座工作','双子座爱情','巨蟹座财运','天秤座幸运数字','天蝎座速配星座','射手座今天怎么样','摩羯座今天要注意什么','7和9谁大','5乘以6得多少','北京天气','哈尔滨明天下雪吗','你快乐吗','今年你有对象了吗','你刷牙了没有','你愿不愿意嫁给我','相过亲吗','床前明月光','天空为什么是蓝色的','你是美女吗','你饿不饿','你是男生女生','你会做什么','彩虹是什么颜色的','我要礼物','怎么减肥','今天过得开心吗','谁发明了电话','我国第一部字典','我国第一部写在纸上的书是','京杭大运河开凿于什么年代','地球到月球的距离为','哪根手指的指甲长得最快','长颈鹿怎么打架','女排的球网有多高','千里送鹅毛','红色食品是指什么','哪个沙漠位于海边','老鼠为什么要啃家具','冰淇淋最早出现在哪个国家','鳄鱼为什么会流泪','颜筋柳骨','怎么使鲜花插得久一些','紫菜长在哪里','第一位华人航天员是谁','京剧中红色脸谱代表','我困了','你叫什么名字','你爸爸是谁','你奶奶的儿子是谁','你快乐吗','你会做什么','出来聊天吧','我心情特别好','你是机器人吗','你有朋友吗','天王盖地虎','逗逗你','你口味重吗','抢票神器','好无聊啊','我叫什么名字','你在干嘛呢','长得像孙红雷的狗','比利牛斯山犬','斑点狗','拉布拉多寻回犬','曾经沧海难为水','白居易的暮江吟','两个黄鹂鸣翠柳','何当共剪西窗烛','李白乘舟将欲行','鹅鹅鹅','结婚对象怎么选','两只老虎两只老虎','剪刀石头布','狼和哈士奇有什么区别','怎样才能脱单','在爱情里什么最重要','商鞅是谁','单恋会成功吗','你有休息时间吗','你对相亲怎么看','你最讨厌的人是谁呀','怎样追到男神']
    var str = '';
    var iNum = getRandom(1, 101)
    str += arr[iNum+1]
   return str
}
//拜年机器人随机title
function getTitle() {
    //230个
    // var arr=['并给您发了个大红包！']
    var str = $('#Cname').val() + "的机器人给您拜年了，并给您发了个大红包"
    // var iNum = getRandom(1, 228)
    // str += arr[iNum+1]
    $(document).attr("title",str+"！");
}
//min~max范围内随机数
function getRandom(min, max){
    var r = Math.random() * (max - min);
    var re = Math.round(r + min);
    re = Math.max(Math.min(re, max), min)

    return re;
}
//输入框随机祝福语;背景图
function getBackground() {
    var arrImgUrl = ['/static/images/newYear05bj001.png', '/static/images/newYear05bj002.png', '/static/images/newYear05bj003.png', '/static/images/newYear05bj001.png','/static/images/newYear05bj001.png', '/static/images/newYear05bj002.png', '/static/images/newYear05bj003.png', '/static/images/newYear05bj001.png','/static/images/newYear05bj001.png', '/static/images/newYear05bj002.png', '/static/images/newYear05bj003.png', '/static/images/newYear05bj001.png']
    var strImgUrl = '';
    var iNum = Math.round(Math.random()*10)
    strImgUrl += arrImgUrl[iNum+1]
    $('.newYearUl #newYearGreetings').css('background-image','url('+ strImgUrl +')')
}

//生成随机id
function getCode() {
    var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    var str = '';
    while (str.length < 32) {
        var iNum = parseInt(Math.random() * 100)
        while (iNum > 35) {
            iNum = parseInt(Math.random() * 100)
        }
        str += arr[iNum]
    }
    $("#uuid").val(str);
    return str;
}
//存cookie
function setCookie(name, str, time) {
    var date = new Date();
    var date1 = date.setDate(date.getDate() + time);
    window.document.cookie = name + "=" + str + ";expires=" + date1 + ";"
}
//取得cookie
function getCookie(name) {
    var str = document.cookie.split(";")
    for (var i = 0; i < str.length; i++) {
        var str2 = str[i].split("=");
        if (str2[0] == name) {
            return str2[1];
        }
    }
    return str2[1];
}

//点击显示隐藏块
function clickDisnone(Across, disnone) {
    var oClick = document.getElementById(Across);
    var oDisnone = document.getElementById(disnone);
    oClick.onclick = function () {
        if (oDisnone.style.display == "none") {
            oDisnone.style.display = "block";
        } else {
            oDisnone.style.display = "none";
        }
    }
}

//划过返回顶部
function hover1(obj1, obj2) {
    obj1.hover(function () {

            obj2.addClass("none_1")
            //alert(1)
        },
        function () {
            obj2.removeClass("none_1")
        })
}

//悬浮窗

function getScrollTop() {
    var scrollPos;
    if (window.pageYOffset) {
        scrollPos = window.pageYOffset;
    }
    else if (document.compatMode && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollPos = document.body.scrollTop;
    }
    return scrollPos;
}

//意见反馈提交
function fd_save() {
    var suggestion = $("#fb_des_content").val();
    var contactInformation = $("#feedback_email").val();
    var account = {
        suggestion: suggestion,
        contactInformation: contactInformation
    }

    if (suggestion == "") {
        layer.msg("您的意见还没有填写哦！", {icon: 5})
    } else {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: '/api/message/save',
            data: JSON.stringify(account)
        }).done(function (data) {
            layer.msg("感谢您提出宝贵意见！", {icon: 6})
            fb_close_x()
        }).fail(function (data) {
            console.log(data);
            var message = JSON.parse(data.responseText).message;
            layer.msg(message, {icon: 5})
        });
    }
}
//关闭意见反馈弹窗
function fb_close_x() {
    $('#fb_baidu_right_dialog').css('display', 'none')
    $('#fb_baidu_wizard').css('display', 'none')
    $("#fb_des_content").val("");
    $("#feedback_email").val("");
}

// 获取邀请码
// param 为 参数的名称

function getParameter(param) {
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd == -1)
        return query.substring(iStart);
    return query.substring(iStart, iEnd);
}

//站内信标记
function platformMail(){
    $.ajaxSetup({cache:false})  //禁止ie浏览器读取缓存的ajax
    //初始化知识库
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/mails/find_phone"
    }).done(function (data) {
        var data = JSON.parse(data);
       console.log(data.flg);
        if (data.flg == 1) {
            $('.allBiao1').css('display', 'block');
            $('.allBiao2').css('display', 'inline-block')
        } else {
            $('.allBiao1').css('display', 'none');
            $('.allBiao2').css('display', 'none')
        }

    }).fail(function (data) {
        console.log(data);
    });
}
//退出当前账户（注销）
function logOut(){
    sessionStorage.removeItem('YearUniqueId')
        window.location.href='/logout'
    // window.location.href='/logout'
}

//七牛上传头像
function uploadImage(element,tar) {
    var fileSize = (tar.files[0].size/1024).toFixed(2);
    
    if(fileSize>500){
        layer.alert("图片不能大于500kb");
        tar.value="";
        $("#inputImage").css("display","block")
        return
    }else{
        $.ajaxFileUpload({
            type: 'post',
            url: '/upload/' + element, //你处理上传文件的服务端
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: element,//与页面处理代码中file相对应的ID值
            async: false,
            dataType: 'json', //返回数据类型:text，xml，json，html,scritp,jsonp五种
            success: function (data) {
                $('.row').css("display","block")
                //头像截取上传
                $('#RobotHeader').val(data.url)
             
                 $('#headPortrait1').val($('#RobotHeader').val()+$('#cropParameter').val())
              
                console.log($('#RobotHeader').val())
            
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                console.error(e);
            }

        })
    }
   
}

//上传图片
function uploadImageAdd() {
  
        $.ajaxFileUpload({
            type: 'post',
            url: '/upload/inputImage', //你处理上传文件的服务端
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'inputImage',//与页面处理代码中file相对应的ID值
            async: false,
            dataType: 'json', //返回数据类型:text，xml，json，html,scritp,jsonp五种
            success: function (data) {
                //聊天图片添加
                $("#img-yuLan").attr("src", data.url + "?imageMogr2/thumbnail/150x150")
                $('#img-yuLan').attr("alt",data.url)
                $('#addImgUrl').val(data.url)
                console.log($('#addImgUrl').val())
                // window.location.href = $('#RobotHeader').val()+$('#cropParameter').val();
//                if (element == 'input-logo') {
//                    $("#img-log").attr("src", data.url + "?date=" + new Date().getTime());
//                    $("#img-log").css("display", "block");
//                    $("#smallLogoUrl").val(data.url);
//                    ctx.company().smallLogoUrl = data.url;
//
//                    $("#input-logo").off("change");
//                    $("#input-logo").on("change", function () {
//                        toUpload(this);
//                    });
//                } else if (element == 'com-pic') {
//                    picManage.picUpload(data.url, element);
//                    ctx.company().imageUrls.push(data.url);
//
//                    $("#com-pic").off("change");
//                    $("#com-pic").on("change", function () {
//                        toUpload(this);
//                    });
//                } else {
//                    picManage.picUpload(data.url, element);
//                    ctx.product().productImageUrls.push(data.url);
//                    $("#product-pic").off("change");
//                    $("#product-pic").on("change", function () {
//                        toUpload(this);
//                    });
//                }
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                console.error(e);
//                $("#com-pic,#product-pic").off("change");
//                $("#com-pic,#product-pic").on("change", function () {
//                    toUpload(this);
//                });
            }

        })
  

}

function answerImgBig(src){
    var str = "";
    str += '<div class="closeImfBig" style="position: fixed;z-index:999;background: rgba(0,0,0,0.7);bottom: 0px;top: 0px;left: 0px;right: 0px;display: block;">  <img  class="bigImg0" src="'+ src +'"></div>'
    $('#answerImgBigTC').html(str);
   
    $('.closeImfBig').click(function(){
        $('#answerImgBigTC').html("");
    })
}

function reloadHead(){
    $('.row').css("display","block")
    window.location.reload(false);
}