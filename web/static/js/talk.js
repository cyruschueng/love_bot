



var $messages = $('#content'),
    d, h, m,
    i = 0;

$(window).load(function() {
  $messages.mCustomScrollbar();

});


function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 1000 + (Math.random() * 20) * 100);
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  'Hi there, I\'m Fabio and you?',
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'That\'s awesome',
  'Codepen is a nice place to stay',
  'I think you\'re a nice person',
  'Why do you think that?',
  'Can you explain?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)'
]

function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();

  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 1000 + (Math.random() * 20) * 100);

}









//与小k的交流对话区
function talks() {
    getCode();
    var arrIcon = ['//j.kuaiduodian.com/assets/global/images/avatar.png', '//j.kuaiduodian.com/assets/global/images/avatar.png'];
    if($('#headPortrait').val()!="" && $('#headPortrait').val()!="None"){
        arrIcon[1]=$('#headPortrait').val()+'/thumbnail/100x100';
    }

    var iNow = -1;    //用来累加改变左右浮动
    var btn = document.getElementById('btn');
    var text = document.getElementById('text');
    var content = document.getElementById('content');
    var img = content.getElementsByClassName('headImg ');
    var span = content.getElementsByTagName('span');
    var myDate = new Date();
    var Hour = myDate.getHours();
    var Min = myDate.getMinutes();
    Hour = Hour > 9 ? Hour : "0" + Hour;
    Min = Min > 9 ? Min : "0" + Min;
    if ($("#welcomes").val() == "") {
        $("#welcomes").val("我很懒！没有写动态啦！")
    }
    // content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>'+ $("#welcomes").val() + '<i>' + Hour + ':' + Min + '</i></span></li>';
    // iNow++;
    // img[iNow].className += 'imgleft';
    // span[iNow].className += 'spanleft';
    $("#roboName0").html($("#name").val());
    
    // console.log($("#uuid").val());
    //发送
    // var uuid = getCookie("uuid");
    function talkSend() {
        clearInterval(selfTalk0);
        var myDate = new Date();
        var Hour = myDate.getHours();
        var Min = myDate.getMinutes();
        Hour = Hour > 9 ? Hour : "0" + Hour;
        Min = Min > 9 ? Min : "0" + Min;
        if (text.value == '') {
            layer.msg('不能发送空消息哦！', {icon: 6})
        } else {



         content.innerHTML +=    '    <div class="m-b-c">'+
            '<a href="" class="pull-right thumb-sm avatar"><img src="' + arrIcon[0] + '" class="img-circle" alt="..."></a>'+
            '<div class="m-r-xxl-f">'+
            '<div class="pos-rlt wrapper bg-primary r r-2x">'+
            '<span class="arrow right pull-up arrow-primary"></span>'+
            '<p class="m-b-none">'+ text.value.replace(/\</g, "&lt").replace(/\>/g,"&gt").replace(/\"/g,"'") + '</p>'+
            '</div>'+
            '<small class="text-muted">' + Hour + ':' + Min + '</small>'+
            '</div>'+
            '</div>    ';

            // content.innerHTML += '<li><img class="headImg " src="' + arrIcon[0] + '"><span><b style="color:#333;">我：</b>'+ text.value.replace(/\</g, "&lt").replace(/\>/g,"&gt").replace(/\"/g,"'") + '<i>' + Hour + ':' + Min + '</i></span></li>';
            // iNow++;
            // img[iNow].className += 'imgright';
            // span[iNow].className += 'spanright';
            var uuid = $("#uuid").val();
            var question = text.value.replace(/\</g, "&lt").replace(/\>/g,"&gt").replace(/\"/g,"'");
            text.value = '';
            // 内容过多时,将滚动条放置到最底端
            content.scrollTop = content.scrollHeight;
            //------------
            var ques = {
                uuid: uuid,
                question: question,
                robotName: $("#name").val(),
                unique_id: $("#unique_id").val(),
                answer1: $("#answer1").val(),
                answer2: $("#answer2").val(),
                answer3: $("#answer3").val(),
                answer4: $("#answer4").val(),
                answer5: $("#answer5").val(),
                enable: $("#enable").val()
            };
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/api/chat/info',
                data: JSON.stringify(ques)
            }).done(function (data) {
                var data = JSON.parse(data);
                console.log(data)
                if (data.mp3Url!=null && data.mp3Url!="null"){
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><audio controls="controls" src="'+ data.mp3Url +'">您的浏览器不支持audio音乐播放。</audio><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else if(data.skip_url!=null && data.skip_url!="null"){
                    window.location.href = data.skip_url
                }else if(data.img_url!=null && data.img_url!="null"){
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><img class="answerImg" src="'+ data.img_url +'?imageMogr2/thumbnail/300x300" alt="'+ data.img_url + '"  onclick="answerImgBig(this.alt)"/><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else if(data.changeBooks!=null && data.changeBooks!="null"){
                    var strBook = '';
                    for(var i=0;i<data.changeBooks.length;i++ ){
                        strBook +='<div class="changeBook1" ><img class="answerImg"  src="'+ data.changeBooks[i].picture +'?imageMogr2/thumbnail/300x300" alt="'+  data.changeBooks[i].picture + '"/></div><div class="changeBook2" ><h5>'+  data.changeBooks[i].name + '</h5><h6>作者：'+  data.changeBooks[i].author + '</h6><h6 >分享者：'+  data.changeBooks[i].share + '</h6><h6 >价格：'+  data.changeBooks[i].price + '</h6></div><h6>简介：'+  data.changeBooks[i].synopsis + '</h6><br/>'
                    }
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><br/><div >'+ strBook +'</div><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                } else {
                    // content.innerHTML += '<li><img  class="headImg "  src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<i>' + Hour + ':' + Min + '</i></span></li>';
                    // iNow++;
                    // img[iNow].className += 'imgleft';
                    // span[iNow].className += 'spanleft';



          content.innerHTML += '<div class="m-b-c">'+
            '<a href="" class="pull-left thumb-sm avatar"><img src="' + arrIcon[1] + '" alt="..."></a>'+
            '<div class="m-l-xxl-f">'+
            '<div class="pos-rlt wrapper b b-light r r-2x">'+
            '<span class="arrow left pull-up"></span>'+
            '<p class="m-b-none">' + data.answer + ' </p>'+
            '</div>'+
            '<small class="text-muted" style="float:right;"><i class="fa fa-ok text-success"></i> ' + Hour + ':' + Min + '</small>'+
            '</div>'+
            '</div>';

  updateScrollbar();
                    
                }
               
                content.scrollTop = content.scrollHeight;
            }).fail(function (data) {
                var message = JSON.parse(data.responseText).message;
                layer.msg(message, {icon: 5})
            });
        }
    }
    //点击按钮发送
    btn.onclick = function () {
        talkSend();
    };
    //回车键发送
    text.onkeydown = function (ev) {
        var oEvent = ev || event;
        if (oEvent.keyCode == 13 && oEvent.ctrlKey || oEvent.keyCode == 13) {
            talkSend();
            return;
        }
    }
    //随机自动说话
    var ci1 = 0;
    var selfTalk0 = setInterval(function () {
            var question = getPlaceholder()
            var myDate = new Date();
            var Hour = myDate.getHours();
            var Min = myDate.getMinutes();
            Hour = Hour > 9 ? Hour : "0" + Hour;
            Min = Min > 9 ? Min : "0" + Min;
           
        
         content.innerHTML +=    '    <div class="m-b-c">'+
            '<a href="" class="pull-right thumb-sm avatar"><img src="' + arrIcon[0] + '" class="img-circle" alt="..."></a>'+
            '<div class="m-r-xxl-f">'+
            '<div class="pos-rlt wrapper bg-primary r r-2x">'+
            '<span class="arrow right pull-up arrow-primary"></span>'+
            '<p class="m-b-none">'+ question+ '</p>'+
            '</div>'+
            '<small class="text-muted">' + Hour + ':' + Min + '</small>'+
            '</div>'+
            '</div>    ';

       

            //  content.innerHTML += '<li><img class="headImg " src="' + arrIcon[0] + '"><span><b style="color:#333;">我：</b>'+ question + '<i>' + Hour + ':' + Min + '</i></span></li>';
            // iNow++;
            // img[iNow].className += 'imgright';
            // span[iNow].className += 'spanright';
            var uuid = $("#uuid").val();
            // 内容过多时,将滚动条放置到最底端
            content.scrollTop = content.scrollHeight;
            //------------
            var ques = {
                uuid: uuid,
                question: question,
                robotName: $("#name").val(),
                unique_id: $("#unique_id").val(),
                answer1: $("#answer1").val(),
                answer2: $("#answer2").val(),
                answer3: $("#answer3").val(),
                answer4: $("#answer4").val(),
                answer5: $("#answer5").val(),
                enable: $("#enable").val()
            };
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/api/chat/info',
                data: JSON.stringify(ques)
            }).done(function (data) {
                var data = JSON.parse(data);
                if (data.mp3Url!=null && data.mp3Url!="null"){
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><audio controls="controls" src="'+ data.mp3Url +'">您的浏览器不支持audio音乐播放。</audio><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else if(data.skip_url!=null && data.skip_url!="null"){
                    window.location.href = data.skip_url
                }else if(data.img_url!=null && data.img_url!="null"){
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><img class="answerImg" src="'+ data.img_url +'?imageMogr2/thumbnail/300x300" alt="'+ data.img_url + '"  onclick="answerImgBig(this.alt)"/><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else if(data.changeBooks!=null && data.changeBooks!="null"){
                    var strBook = '';
                    for(var i=0;i<data.changeBooks.length;i++ ){
                        strBook +='<div class="changeBook1" ><img class="answerImg"  src="'+ data.changeBooks[i].picture +'?imageMogr2/thumbnail/300x300" alt="'+  data.changeBooks[i].picture + '"/></div><div class="changeBook2" ><h5>'+  data.changeBooks[i].name + '</h5><h6>作者：'+  data.changeBooks[i].author + '</h6><h6 >分享者：'+  data.changeBooks[i].share + '</h6><h6 >价格：'+  data.changeBooks[i].price + '</h6></div><h6>简介：'+  data.changeBooks[i].synopsis + '</h6><br/>'
                    }
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><br/><div >'+ strBook +'</div><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                } else {
                    // content.innerHTML += '<li><img  class="headImg "  src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<i>' + Hour + ':' + Min + '</i></span></li>';
                    // iNow++;
                    // img[iNow].className += 'imgleft';
                    // span[iNow].className += 'spanleft';


          content.innerHTML += '<div class="m-b-c">'+
            '<a href="" class="pull-left thumb-sm avatar"><img src="' + arrIcon[1] + '" alt="..."></a>'+
            '<div class="m-l-xxl-f">'+
            '<div class="pos-rlt wrapper b b-light r r-2x">'+
            '<span class="arrow left pull-up"></span>'+
            '<p class="m-b-none">' + data.answer + ' </p>'+
            '</div>'+
            '<small class="text-muted" style="float:right;"><i class="fa fa-ok text-success"></i> ' + Hour + ':' + Min + '</small>'+
            '</div>'+
            '</div>';

  updateScrollbar();

                }

                content.scrollTop = content.scrollHeight;
                
            }).fail(function (data) {
                var message = JSON.parse(data.responseText).message;
                layer.msg(message, {icon: 5})
            });
        ci1++
        if (ci1 >= 3){
            clearInterval(selfTalk0);
        }
        },4000);
}




//新年祝福机器人对话
function newYearRobotTalks() {
    CSH_GZ();
    getCode();
    var arrIcon = ['//j.kuaiduodian.com/assets/global/images/avatar.png', '//j.kuaiduodian.com/assets/global/images/avatar.png'];
    if($('#headPortrait').val()!="" && $('#headPortrait').val()!="None"){
        arrIcon[1]=$('#headPortrait').val()+'/thumbnail/100x100';
    }
    var iNow = -1;    //用来累加改变左右浮动
    var btn = document.getElementById('btn');
    var text = document.getElementById('text');
    var content = document.getElementById('content');
    var img = content.getElementsByClassName('headImg ');
    var span = content.getElementsByTagName('span');
    var myDate = new Date();
    var Hour = myDate.getHours();
    var Min = myDate.getMinutes();
    Hour = Hour > 9 ? Hour : "0" + Hour;
    Min = Min > 9 ? Min : "0" + Min;
    if ($("#welcomes").val() == "") {
        $("#welcomes").val("爱！要说出口才有用！")
    }
    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>'+ $("#welcomes").val() + '<i>' + Hour + ':' + Min + '</i></span></li>';
    iNow++;
    img[iNow].className += 'imgleft';
    span[iNow].className += 'spanleft';
   

    $("#roboName0").html($("#name").val());
   
    // console.log($("#uuid").val());
    //发送
    // var uuid = getCookie("uuid");
    function talkSendY() {
        clearInterval(selfTalk1);
        text.focus();
        var myDate = new Date();
        var Hour = myDate.getHours();
        var Min = myDate.getMinutes();
        Hour = Hour > 9 ? Hour : "0" + Hour;
        Min = Min > 9 ? Min : "0" + Min;
        if (text.value == '') {
            layer.msg('不能发送空消息哦！', {time:800,icon: 6})
        } else {
            
         content.innerHTML +=    '    <div class="m-b-c">'+
            '<a href="" class="pull-right thumb-sm avatar"><img src="' + arrIcon[0] + '" class="img-circle" alt="..."></a>'+
            '<div class="m-r-xxl-f">'+
            '<div class="pos-rlt wrapper bg-primary r r-2x">'+
            '<span class="arrow right pull-up arrow-primary"></span>'+
            '<p class="m-b-none">'+ text.value.replace(/\</g, "&lt").replace(/\>/g,"&gt").replace(/\"/g,"'") + '</p>'+
            '</div>'+
            '<small class="text-muted">' + Hour + ':' + Min + '</small>'+
            '</div>'+
            '</div>    ';

            // content.innerHTML += '<li><img class="headImg " src="' + arrIcon[0] + '"><span><b style="color:#333;">我：</b>'+ text.value.replace(/\</g, "&lt").replace(/\>/g,"&gt").replace(/\"/g,"'") + '<i>' + Hour + ':' + Min + '</i></span></li>';
            // iNow++;
            // img[iNow].className += 'imgright';
            // span[iNow].className += 'spanright';
            var uuid = $("#uuid").val();
            var question = text.value.replace(/\</g, "&lt").replace(/\>/g,"&gt").replace(/\"/g,"'");
            text.value = '';
           
            // 内容过多时,将滚动条放置到最底端
            content.scrollTop = content.scrollHeight;
            //------------
            var ques = {
                uuid: uuid,
                question: question,
                robotName: $("#name").val(),
                unique_id: $("#unique_id").val(),
                answer1: $("#answer1").val(),
                answer2: $("#answer2").val(),
                answer3: $("#answer3").val(),
                answer4: $("#answer4").val(),
                answer5: $("#answer5").val(),
                enable: $("#enable").val()
            };
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/api/chat/info',
                data: JSON.stringify(ques)
            }).done(function (data) {
                var data = JSON.parse(data);

                if (data.mp3Url!=null && data.mp3Url!="null"){
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><audio controls="controls" src="'+ data.mp3Url +'">您的浏览器不支持audio音乐播放。</audio><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else if(data.skip_url!=null && data.skip_url!="null"){
                    window.location.href = data.skip_url
                }else if(data.img_url!=null && data.img_url!="null"){
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><img class="answerImg" src="'+ data.img_url +'?imageMogr2/thumbnail/300x300" alt="'+ data.img_url + '"  onclick="answerImgBig(this.alt)"/><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else if(data.changeBooks!=null && data.changeBooks!="null"){
                    var strBook = '';
                    for(var i=0;i<data.changeBooks.length;i++ ){
                        strBook +='<div class="changeBook1" ><img class="answerImg"  src="'+ data.changeBooks[i].picture +'?imageMogr2/thumbnail/300x300" alt="'+  data.changeBooks[i].picture + '"/></div><div class="changeBook2" ><h5>'+  data.changeBooks[i].name + '</h5><h6>作者：'+  data.changeBooks[i].author + '</h6><h6 >分享者：'+  data.changeBooks[i].share + '</h6><h6 >价格：'+  data.changeBooks[i].price + '</h6></div><div style="clear: both"></div><h6>简介：'+  data.changeBooks[i].synopsis + '</h6><br/>'
                    }
                    content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><br/><div >'+ strBook +'</div><i>' + Hour + ':' + Min + '</i></span></li>';
                    iNow++;
                    img[iNow].className += 'imgleft';
                    span[iNow].className += 'spanleft';
                }else {
                    // content.innerHTML += '<li><img  class="headImg "  src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<i>' + Hour + ':' + Min + '</i></span></li>';
                    // iNow++;
                    // img[iNow].className += 'imgleft';
                    // span[iNow].className += 'spanleft';
                  



          content.innerHTML += '<div class="m-b-c">'+
            '<a href="" class="pull-left thumb-sm avatar"><img src="' + arrIcon[1] + '" alt="..."></a>'+
            '<div class="m-l-xxl-f">'+
            '<div class="pos-rlt wrapper b b-light r r-2x">'+
            '<span class="arrow left pull-up"></span>'+
            '<p class="m-b-none">' + data.answer + ' </p>'+
            '</div>'+
            '<small class="text-muted" style="float:right;"><i class="fa fa-ok text-success"></i> ' + Hour + ':' + Min + '</small>'+
            '</div>'+
            '</div>';
  updateScrollbar();
                }

                content.scrollTop = content.scrollHeight;
            }).fail(function (data) {
                var message = JSON.parse(data.responseText).message;
                layer.msg(message, {icon: 5})
            });
        }
    }
    //点击按钮发送
   btn.onclick = function () {
        talkSendY();
    };
    //回车键发送
    text.onkeydown = function (ev) {
        var oEvent = ev || event;
        if (oEvent.keyCode == 13 && oEvent.ctrlKey || oEvent.keyCode == 13) {
            talkSendY();
        }
    }
    //随机自动说话
    var ci2 = 0;
    var selfTalk1 = setInterval(function () {
        var question = getPlaceholder()
        var myDate = new Date();
        var Hour = myDate.getHours();
        var Min = myDate.getMinutes();
        Hour = Hour > 9 ? Hour : "0" + Hour;
        Min = Min > 9 ? Min : "0" + Min;
       
        content.innerHTML += '<li><img class="headImg " src="' + arrIcon[0] + '"><span><b style="color:#333;">我：</b>'+ question + '<i>' + Hour + ':' + Min + '</i></span></li>';
        iNow++;
        img[iNow].className += 'imgright';
        span[iNow].className += 'spanright';
        var uuid = $("#uuid").val();
        // 内容过多时,将滚动条放置到最底端
        content.scrollTop = content.scrollHeight;
        //------------
        var ques = {
            uuid: uuid,
            question: question,
            robotName: $("#name").val(),
            unique_id: $("#unique_id").val(),
            answer1: $("#answer1").val(),
            answer2: $("#answer2").val(),
            answer3: $("#answer3").val(),
            answer4: $("#answer4").val(),
            answer5: $("#answer5").val(),
            enable: $("#enable").val()
        };
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: '/api/chat/info',
            data: JSON.stringify(ques)
        }).done(function (data) {
            var data = JSON.parse(data);
            if (data.mp3Url!=null && data.mp3Url!="null"){
                content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><audio controls="controls" src="'+ data.mp3Url +'">您的浏览器不支持audio音乐播放。</audio><i>' + Hour + ':' + Min + '</i></span></li>';
                iNow++;
                img[iNow].className += 'imgleft';
                span[iNow].className += 'spanleft';
            }else if(data.skip_url!=null && data.skip_url!="null"){
                window.location.href = data.skip_url
            }else if(data.img_url!=null && data.img_url!="null"){
                content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><img class="answerImg" src="'+ data.img_url +'?imageMogr2/thumbnail/300x300" alt="'+ data.img_url + '"  onclick="answerImgBig(this.alt)"/><i>' + Hour + ':' + Min + '</i></span></li>';
                iNow++;
                img[iNow].className += 'imgleft';
                span[iNow].className += 'spanleft';
            }else if(data.changeBooks!=null && data.changeBooks!="null"){
                var strBook = '';
                for(var i=0;i<data.changeBooks.length;i++ ){
                    strBook +='<div class="changeBook1" ><img class="answerImg"  src="'+ data.changeBooks[i].picture +'?imageMogr2/thumbnail/300x300" alt="'+  data.changeBooks[i].picture + '"/></div><div class="changeBook2" ><h5>'+  data.changeBooks[i].name + '</h5><h6>作者：'+  data.changeBooks[i].author + '</h6><h6 >分享者：'+  data.changeBooks[i].share + '</h6><h6 >价格：'+  data.changeBooks[i].price + '</h6></div><h6>简介：'+  data.changeBooks[i].synopsis + '</h6><br/>'
                }
                content.innerHTML += '<li><img class="headImg " src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<br/><br/><div >'+ strBook +'</div><i>' + Hour + ':' + Min + '</i></span></li>';
                iNow++;
                img[iNow].className += 'imgleft';
                span[iNow].className += 'spanleft';
            } else {
                content.innerHTML += '<li><img  class="headImg "  src="' + arrIcon[1] + '"><span><b style="color:#333;">'+ $("#name").val() +'：</b>' + data.answer + '<i>' + Hour + ':' + Min + '</i></span></li>';
                iNow++;
                img[iNow].className += 'imgleft';
                span[iNow].className += 'spanleft';


            }

            content.scrollTop = content.scrollHeight;
            
        }).fail(function (data) {
            var message = JSON.parse(data.responseText).message;
            layer.msg(message, {icon: 5})
        });
        ci2++
        if (ci2>=3){
            clearInterval(selfTalk1);
        }
    },4000);
}
//拜年机器人页面上的关注功能
function YearGZ(){
    var GZ = {
        oth_phone: $('#accountId').val()
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/fans/save_fans',
        data: JSON.stringify(GZ)
    }).done(function (data) {
        var data = JSON.parse(data);
        if(data.flg == 1 ){
            $('#YearGZNum1').html(data.flg_count);
            $('#YearGZNum2').html(data.flg_count);
            $('#YearGZNum3').html(data.flg_count);
            layer.msg('您已经达到关注上限20个了哦！');
        }else {
            $('#YearGZNum1').html(data.flg_count);
            $('#YearGZNum2').html(data.flg_count);
            $('#YearGZNum3').html(data.flg_count);
            $('#YearGZ').hide();
            $('#YearQG').show();
        }
      
    }).fail(function (data) {
        var message = JSON.parse(data.responseText).message;
        layer.msg(message, {icon: 5})
    });
}
//取关
function YearQG(){
    var GZ = {
        oth_phone: $('#accountId').val()
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/fans/del_fans',
        data: JSON.stringify(GZ)
    }).done(function (data) {
        var data = JSON.parse(data);
        $('#YearGZNum1').html(data.flg_count);
        $('#YearGZNum2').html(data.flg_count);
        $('#YearGZNum3').html(data.flg_count);
        console.log(data)
        $('#YearGZ').show();
        $('#YearQG').hide();
    }).fail(function (data) {
        var message = JSON.parse(data.responseText).message;
        layer.msg(message, {icon: 5})
    });

    
}

function CSH_GZ(){
    var GZ = {
        oth_phone: $('#accountId').val()
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: '/fans/find_fans',
        data: JSON.stringify(GZ)
    }).done(function (data) {
        var data = JSON.parse(data);
        $('#YearGZNum1').html(data.flg_count);
        $('#YearGZNum2').html(data.flg_count);
        $('#YearGZNum3').html(data.flg_count);
        
        console.log(data)
        if(data.flg==0){
            $('#YearGZ').show();
            $('#YearQG').hide();
        }else {
            $('#YearGZ').hide();
            $('#YearQG').show();
        }
    }).fail(function (data) {
        var message = JSON.parse(data.responseText).message;
        layer.msg(message, {icon: 5})
    });
}

//移动端搜索
function search_comssPhone() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/company/search-for-keyword?keyword=" + encodeURI($('#cominput0').val())
    }).done(function (data) {
        var data = JSON.parse(data);
        console.log(data);
        var str = '';
        if(data.length==0){
            str += '<tr style="width: 100%;height: 20px;" class="trstate"><td style="width: 40%;text-align: right;font-size: 12px;"> <a style="display: block;text-decoration: none;color: orange;" href="/register" target="_blank" >啊！没搜索到！您可以点这里创建个！</a></td></tr>'
            $('#search_bottom').html(str)
        }else {
            for (var i = 0; i < data.length; i++) {
                str += '<tr style="width: 100%;height: 20px;" class="trstate"><td style="width: 40%;text-align: left;font-size: 12px;"> <a style="display: block;text-decoration: none;color: black;" href="/robot-company/' + data[i].uniqueId + '" target="_blank">'+data[i].name+ '<span style="float: right;background: url(/static/images/YearRankbj3.png) no-repeat;background-size: 0.4rem;height: 0.35rem;display: -webkit-inline-box;text-indent: 2em;width: 1.3rem;line-height: 0.5rem;">'+ data[i].robotVal +'</span> </a></td></tr>';
                $('#search_bottom').html(str)
            }
        }


    }).fail(function (data) {
        console.log(data);
    });
}




document.onclick = function () {
    $('#search_bottom').html("")
}
//pc端搜索
function search_comss() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/company/search-for-keyword?keyword=" + encodeURI($('#cominput0').val())
    }).done(function (data) {
        var data = JSON.parse(data);
        console.log(data);
        var str = '';
        if(data.length==0){
            str += '<tr style="width: 100%;height: 20px;" class="trstate"><td style="width: 40%;text-align: right;font-size: 12px;"> <a style="display: block;text-decoration: none;color: orange;" href="/register" target="_blank" >啊！没搜索到！您可以点这里创建个！</a></td></tr>'
            $('#search_bottom').html(str)
        }else {
            for (var i = 0; i < data.length; i++) {
                str += '<tr style="width: 100%;height: 20px;" class="trstate"><td style="width: 40%;text-align: left;font-size: 12px;"> <a style="display: block;text-decoration: none;color: black;" href="/robot-company/' + data[i].uniqueId + '" target="_blank">'+data[i].name+ '<br/><span style="background: url(/static/images/YearRankbj3.png) no-repeat;position: relative;top: 4px;background-size: 25px;width: 21px;height: 21px; display: -webkit-inline-box;"></span> '+ data[i].robotVal +'</a></td></tr>';
                $('#search_bottom').html(str)
            }
        }
       
       
    }).fail(function (data) {
        console.log(data);
    });
}
//加载昨日排行
function yesterload() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/company/yesterday/questions_rank"
    }).done(function (data) {
        var data = JSON.parse(data);
        var stryes = '';
        for (var i = 0; i < data.length; i++) {
            stryes += '<tr style="width: 100%;height: 20px;" class="trstate"> <td style="width: 40%;"> <a href="/robot-company/' + data[i].app_key + '" style="display:block;text-decoration:none;margin-right: 14px;" target="_blank" class="ui-link">' + data[i].companyName + ' </a> </td> </tr>'
        }
        $('#ques_ranks').html(stryes)
    }).fail(function (data) {
        console.log(data);
    });
}

//认领平行人
function ReceivePINGX(){
    var str = "";
    str +='<div class="update_c" style="position: fixed;z-index:999;background: rgba(0,0,0,0.7);bottom: 0px;top: 0px;left: 0px;right: 0px;display: block;"> <div style="width: 350px;height: 200px;background: #fff;position: relative;top: 30%;margin: auto;"> <div style="height: 42px;background: #4898D5;color:#fff;font-size: 18px;padding: 0 10px 0 20px;line-height: 42px;">认领平行人窗口 <div class="close_update_cX" style="height: 29px;width: 16px;float: right;background: url(/static/images/icono0.png) no-repeat left bottom;"></div> </div> <form> <div style="padding-top: 13px;"> <table style="font-size: 16px;"> <tbody> <tr> <td style="width:70px;text-align: right;padding-top: 1px;">手机号:</td> <td> <input type="text" name="phone" required="required" id="ReceivePhone" style="width:250px;height:30px;font-size: 13px;margin-left: 5px;" title="手机号" placeholder="请输入领取平行人的手机号" maxlength="11" value="" /> </td> </tr> <tr> <td style="display: block;"></td> <td> <a class="ReceiveBYE"  style="display: block;float: left;width: 80px;height: 31px;border-radius: 5px;background: #4898D5;line-height: 31px;text-align: center;margin-left: 21px;margin-top: 38px;color: #fff;cursor: pointer;" data-robotId="{{robot.id}}">认领</a> <a class="ReceiveBNO" style="display: block;float: left;width: 80px;height: 31px;border-radius: 5px;background: #999;line-height: 31px;text-align: center;margin-left: 21px;margin-top: 38px;color: #fff;cursor: pointer;">取消</a> </td> </tr> </tbody> </table> </div> </form> </div> </div>'
    $('#tanchuang').html(str);
    $('.ReceiveBNO').click(function () {//取消
        closeXX()
    });
    function closeXX(){
        $('#tanchuang').html("")
    }
    $(".close_update_cX").click(function () {//叉掉
        closeXX();
    });
    $('.ReceiveBYE').click(function () {//保存
        var phones = $('#ReceivePhone').val();
        var robotId = $('#idd0').val();
        var invitationCode_no = $('#invitationCode_no').val();
        var Receive = {
            robotId: robotId,
            invitationCode:invitationCode_no,
            mobile: phones,
            newYearGreetings:'你好',
            source: 3
        };
        console.log(JSON.stringify(Receive));
        if ($('#ReceivePhone').val()!="" && oPhonetest0()) {
            //保存把数据传到后台
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: '/api/bind-mobile',
                data: JSON.stringify(Receive)
            }).done(function (data) {
                layer.msg("认领成功", {time:1500,icon: 6},function(){
                    closeXX();
                    // window.location.reload(false);
                })
            }).fail(function (data) {
                console.log(data);
                var message = JSON.parse(data.responseText).message;
                layer.msg(message, {icon: 5})
            });
        } else {
            layer.msg("请正确填写手机号！", {icon: 5})
        }

    });
    addEvent($('#ReceivePhone'), "blur", oPhonetest0);
    function oPhonetest0() {
        var that =document.getElementById("ReceivePhone");
        var re = /^1[5|3|4|7|8][0-9]{9}$/;
        if (re.test(that.value)) {
            return true;
        } else {
            // layer.alert("请输入正确手机号11");
            return false;
        }
    }
}


function addEvent(obj, type, fn) { //添加事件兼容
    if (obj.addEventListener) {
        obj.addEventListener(type, fn);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, fn);
    }
}

//待领取平行人页面的领取功能
function ReceiveSS(){
    $('.ReceiveSS').click(function(){
        var idone = $(this).attr('data-id');
        $('#idd0').val(idone);
        ReceivePINGX()
    })
   
}
