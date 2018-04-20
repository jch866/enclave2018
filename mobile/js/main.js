$(function() {
    var doc = $(window),
        header = $('#header'), //主要是针对移动端，注意PC也有headid
        artListUl = $(".artList>ul"),
        recommendUl = $(".recommend>ul"),
        mRecommendUl = $(".m_recommend>ul"),
        mArtList = $(".m_artList>ul"),
        mDetails = $(".m_details"),
        m_comment_list = $(".m_comment_list"),
        m_sharearticle_v1 = $(".m_sharearticle_v1"),
        m_special_v1 = $(".m_special_v1"),
        m_article_v1 = $(".m_article_v1"),
        m_probation_list = $(".m_probation_list"),
        details = $('.article_detail'),
        art_head = $('.article_head'),
        mart_head = $('.mdetail_head'),
        menu_tab = $('.menu_con'),
        downApp = $('#downApp'),
        openApp = $('#openApp'),
        tab = $('.menu > a'),
        mWeChat = $('#m_weChat'),
        mask = $('#mask'),
        arrow = $(".arrow");
    var delay = 60 * 60 * 3 * 1000; //3小时缓存机制
    var cache = { aL: 'artList', aLT: 'artList_time' };
    var len1=6,len2=3;
    var util = {
        //[util.supports_ls 判断是否支持localstorage]
        supports_ls: function() {
            return !!(window.localStorage)
        },
        //[util.setls 判断是否支持localstorage]
        setls: function(key, value) {
            window.localStorage[key] = value;
        },
        //[util.getls 判断是否支持localstorage]
        getls: function(key) {
            return window.localStorage[key];
        },
        //[util.rmls 判断是否支持localstorage]
        rmls: function(key) {
            window.localStorage.removeItem[key];
        },
    };
    var selfCacheData = util.supports_ls() ? util.getls(cache.aL) : false;
    var lsTime = util.supports_ls() ? (util.getls(cache.aLT) - 0) : false;
    var url = {
        al: 'https://app.enclavebooks.cn/v1_4/index', //article list
        ad: 'https://app.enclavebooks.cn/v1_4/article?', //article detail
        ar: 'https://app.enclavebooks.cn/v1_4/recommend' ,//article random  随机三篇
        homepage: 'https://app.enclavebooks.cn',
        special: 'http://test.enclavebooks.cn/v2/shareSpecial?id=1',
        specialarticle: 'http://test.enclavebooks.cn/v2/shareSpecialArticle?id=9',
        article: 'http://test.enclavebooks.cn/v2/shareArticle?id=253',
    };
    //首页slides变量
    var index = 0,
        imgList = $('.imgcls'),
        n = imgList.length,
        timeDelay = 5000;
    /**
     * [docRefresh 绑定首页按F5刷新事件]
     * @return {[type]} [description]
     */
    function docRefresh() {
        doc.keydown(function(e) {
            //阻止F5默认事件
            e.preventDefault();
            var x = e.keyCode;
            if (x === 116) {
                getArticle();
            }
        })
    }
    /**
     * [getArticle 获取文章列表]
     * @return {[type]} [description]
     */
    function getArticle() {
        $('.artList').addClass('loadingBg');
        $.get(url.al, function(data) {
            // console.log(data);
            if (data.code == 200) {
                if (util.supports_ls()) {
                    util.setls(cache.aL, JSON.stringify(data))
                    util.setls(cache.aLT, new Date().getTime())
                }
                // console.log(JSON.stringify(data));
                var artArray = data.result.data;
                artArray.length = 9;
                renderDom(artListUl, artArray);
                $('.artList').removeClass('loadingBg');
            }
        })
    }
    /**
     * [renderDom 渲染DOM元素]
     * @param  {[type]} data [服务器发回的JSON数据]
     * @return {[type]}      [void]
     */
    function renderDom(wrap,data,cb) {
        switch (wrap) {
            case artListUl: //文章列表的Dom
                artListUl.html('');
                $.each(data, function(index, item) {
                    var str = '<li>' +
                        '<a href="article.html?art_id=' + item.art_id+ '" ><img src=' + item.art_thumb + ' alt=""></a>' +
                        '<a href="article.html?art_id=' + item.art_id+ '" ><h3>' + item.art_title + '</h3></a>' +
                        '<a href="article.html?art_id=' + item.art_id+ '" ><p class="des">' + item.art_description + '</p></a>' +
                        '<div class="editor">' +
                        '<p><span class="mark">' + item.cate_name + '</span>' + item.art_editor + '</p>' +
                        '</div>' +
                        '</li>';
                    artListUl.append($(str));
                })
                break;
            case details: //文章详情的Dom
                var str = '<img src="' + data.art_thumb + '" alt=""><h1>' + data.art_title + '</h1>' +
                    '<div class="author">' +
                    '<img src="' + data.editor_avatar + '" alt=""><span>' + data.art_editor + ' · ' + format(data.art_time*1000) + '</span>' +
                    '</div>' + data.art_content.replace(/\/ueditor\/php/g,(url.homepage+"/ueditor/php")) +
                    '<div class="readOther">' +
                    '<span class="left mark">' + data.cate_name + '</span>' +
                    '<span class="reads"><i></i>' + data.art_view + '</span>' +
                    '</div>';
                details.html($(str));
                break;
            case recommendUl: //文章详情页下面的随机三篇文章的Dom
                recommendUl.html('');
                $.each(data, function(index, item) {
                    var str = '<li>' +
                        '<a href="article.html?art_id=' + item.art_id+ '" ><img src=' + item.art_thumb + ' alt=""></a>' +
                        '<div class="summary">' +
                        '<h2>' + item.art_title + '</h2>' +
                        '<p>' + item.art_description + '</p>' +
                        '<div><p><span class="mark">' + item.cate_name + '</span>' + item.art_editor + '</p></div>' +
                        '</div>' +
                        '</li>';
                    recommendUl.append($(str));
                })
                break;
            case mRecommendUl: //移动端文章详情页下面的随机三篇文章的Dom
                mRecommendUl.html('');
                $.each(data, function(index, item) {
                    var str = '<a href="article.html?art_id=' + item.art_id+ '" ><li><div class="imgWrap">' +
                        '<img src=' + item.art_thumb + ' alt=""></div>' +
                        '<div class="des">' +
                        '<h3>' + item.art_title + '</h3>' +
                        '<p>' + item.art_description + '</p>' +
                        '</li></a>';
                    mRecommendUl.append($(str));
                })
                break;
            case mArtList: //移动端首页列表
                mArtList.html('');
                $.each(data, function(index, item) {
                    var str = '<a href="article.html?art_id=' + item.art_id+ '" ><li><div class="imgWrap">' +
                        '<img src=' + item.art_thumb + ' alt=""></div>' +
                        '<div class="des">' +
                        '<h3>' + item.art_title + '</h3>' +
                        '<p>' + item.art_description + '</p>' +
                        '</div>' +
                        '</li></a>';
                    mArtList.append($(str));
                })
                break;
            case mDetails: //移动端文章详情
                var str = '<img src="' + data.art_thumb + '" alt=""><h1>' + data.art_title + '</h1>' +
                    '<div class="author">' +
                    '<span>' + data.art_editor + ' · ' + format(data.art_time*1000) + '</span>' +
                    '</div>' + data.art_content.replace(/\/ueditor\/php/g,(url.homepage+"/ueditor/php")) +
                    '<div class="readOther">' +
                    '<span class="left mark">' + data.cate_name + '</span>' +
                    '<span class="reads"><i></i>' + data.art_view + '</span>' +
                    '</div>';
                mDetails.html($(str));
                break;
            case m_article_v1: //移动端文章详情 v1
                var str = '<img src="' + data.artThumb + '" alt=""><h1>' + data.artTitle + '</h1>' +
                    '<div class="avatar_wrap">'+
                        '<span class="avatar">'+
                            '<img src="'+data.artAvatar+'" alt="">'+
                        '</span>'+
                        '<span class="profile">'+
                            '<div class="name blue">' + data.artEditor + '</div>'+
                            '<div class="time">' + format(data.artTime*1000) + '</div>'+
                        '</span>'+
                    '</div>'+data.artContent.replace(/\/ueditor\/php/g,(url.homepage+"/ueditor/php"));
                m_article_v1.html($(str));
                cb && cb();
                break;
            case m_comment_list: //移动端文章详情下面的最新评论 v1
                m_comment_list.html('');
                $.each(data, function(index, item) {
                    var str = '<li>'+
                    '<div class="m_header avatar_wrap">'+
                        '<span class="avatar"><img src="' + item.avatar+ '" alt=""></span>'+
                        '<span class="profile">'+
                            '<div class="name">' + item.name+ '</div>'+
                            '<div class="time">' + format(item.time*1000) + '</div>'+
                        '</span>'+
                    '</div>'+
                    '<div class="m_body">' + item.content+'</div>'+
                    '</li>'
                    m_comment_list.append($(str));
                })
            break;
            case m_special_v1: //专栏页 v1
                var str = '<img src="' + data.thumb + '" alt=""><h1>' + data.title + '</h1>' +
                    '<div class="avatar_wrap">'+
                        '<span class="profile">'+
                            '<div class="time">' + format(data.time*1000) + '</div>'+
                        '</span>'+
                        
                    '</div>'+data.specialColumnIntro;
                m_special_v1.html($(str));
               
                break;
            case m_probation_list: //专栏页下面的试读 v1
                m_probation_list.html('');
                $.each(data, function(index, item) {
                    var str = '<li>'+
                    '<div class="summary">'+
                        '<h4>' + item.artTitle+ '</h4>'+
                        '<p>' + item.artTitle+ '</p>'+
                    '</div>'+
                        '<div class="thumbnail">'+
                        '<img src="' + item.artThumb+ '" alt="">'+
                    '</div>'+
                '</li>';
                    m_probation_list.append($(str));
                })
                break;
            case m_sharearticle_v1: //付费文章页 v1
                var str = '<img src="' + data.artThumb + '" alt=""><h1>' + data.artTitle + '</h1>' +
                    '<div class="avatar_wrap">'+
                        '<span class="avatar">'+
                            '<img src="'+data.artAvatar+'" alt="">'+
                        '</span>'+
                        '<span class="profile">'+
                            '<div class="name blue">' + data.artEditor + '</div>'+
                            '<div class="time">' + format(data.artTime*1000) + '</div>'+
                        '</span>'+
                    '</div>'+data.artContent.replace(/\/ueditor\/php/g,(url.homepage+"/ueditor/php"));
                m_sharearticle_v1.html($(str));
                break;
        }



    }
    /**
     * [renderBySelfDate 利用存储的数据渲染文章列表]
     * @return {[type]} [description]
     */
    function renderBySelfDate() {
        var selfObj = JSON.parse(selfCacheData);
        var artArray = selfObj.result.data;
        artArray.length = 9;
        renderDom(artListUl, artArray);
    }
    //以时间判断是否需要重新加载文章列表
    function isOverTime() {
        if (lsTime) {
            var deferTime = new Date().getTime() - lsTime;
            return !!(deferTime < delay);
        }
        return false;
    }
    /**
     * [initArtList 初始化文章数据]
     * @return {[type]} [description]
     */
    function initArtList() {
        //有数据且不超时
        if (selfCacheData && isOverTime()) {
            renderBySelfDate();
        } else {
            //localStorage.removeItem(cache.aL);
            //localStorage.removeItem(cache.aLT);
            getArticle();
        }
    }
    //artListUl.length != 0可判断是不是在首页
    (artListUl.length != 0) && initArtList();
    //按F5刷新
    (artListUl.length != 0) && docRefresh();


    /**
     * [getArticleCon 得到单篇文章内容]
     * @return {[type]} [description]
     */
    function getArticleCon(isPc) {
        //var localId = location.search.substring(1); //"art_id=270"
        var localId = location.search.substring(1).split('=')[1];
        $.get(url.ad +'art_id=' + localId, function(data) {
                //console.log(data.message);
                if (data.code == 200) {
                    //console.log(data.result);
                    var item = data.result;
                    isPc ? renderDom(details, item) : renderDom(mDetails, item);
                }
            })
            //随机文章3篇
        getRandomArticle(isPc);
    }

    (details.length != 0) && getArticleCon(true);
    (mDetails.length != 0) && getArticleCon(false);

    function getRandomArticle(isPc) {
        $.get(url.ar, function(data) {
            // console.log(data);
            if (data.code == 200) {
                var res = data.result.data;
                isPc ? renderDom(recommendUl, res) : renderDom(mRecommendUl, res);
            }
        })
    }

    /**
     * [scrollFixed 绑定window滚动事件达到临界点head就fixed]
     * @return {[type]} [description]
     */
    function scrollFixed($obj) {
        doc.scroll(function() {
            var headHeight = $obj.outerHeight();
            if($(document).height()<(doc.height()+headHeight)){
                $obj.hasClass('fixedTop')&&$obj.removeClass('fixedTop');
                return;
            }
            if (doc.scrollTop() > headHeight) {
                $obj.addClass('fixedTop')
            } else {
                $obj.removeClass('fixedTop')
            }
        })
    }

    (art_head.length != 0) && scrollFixed(art_head);
    (mart_head.length != 0) && scrollFixed(mart_head);
    /**
     * [tabChange 关于我们，页面标题TAB]
     * @return {[type]} [description]
     */
    function tabChange() {
        var index = 0;
        if (tab.length != menu_tab.length) {
            return;
        } else {
            tab.on("click", function() {
                tab.removeAttr('class');
                $(this).addClass('curr');
                index = tab.index($(this));
                menu_tab.hide();
                menu_tab.eq(index).show();
            })
        }
        location.search && switchIndexTab(tab,menu_tab);
    }
    

    function switchIndexTab(tab,menu_tab){
        var index = location.search.split("=")[1];
        tab.removeAttr('class');
        $(tab[index]).addClass('curr');
        menu_tab.hide();
        menu_tab.eq(index).show();
    }
    
    (menu_tab.length != 0) && tabChange();
    /*******************************移动端交互***********************************/
    /**
     * [resizeLoad 自适应全屏]
     * @return {[type]} [description]
     */
    function resizeLoad() {
        var self = this;
        var width = doc.width();
        var winWidth = width;
        var winHeight = doc.height();
        header.css({
            width: winWidth,
            height: winHeight
        })

    }
    header && resizeLoad();

    /**
     * [scrollTop 向上滚动一屏]
     * @return {[type]} [description]
     */
    function scrollTop() {
        arrow.on('click', function() {
            $('body,html').animate({ scrollTop: doc.height() }, 400)
        })
    }
    arrow && scrollTop();
    /**
     * [getMArtList 获取移动端文章列表]
     * @return {[type]} [description]
     */
    function getMArtList() {
        $('.m_artList').addClass('loadingBg');
        $.get(url.al, function(data) {
            // console.log(data);
            if (data.code == 200) {
                var artArray = data.result.data;
                artArray.length = 6;
                renderDom(mArtList, artArray);
                $('.m_artList').removeClass('loadingBg');
            }
        })
    }

    (mArtList.length != 0) && getMArtList();
    /* 首页slides     */
    if (n != 0) {
        window.setInterval(function() {
            (index == n - 1) ? (index = 0) : index++;
            imgList.removeClass('active').removeClass('before');
            imgList.eq(index).addClass('active');
            if (index == 0) {
                imgList.eq(n - 1).addClass('before');
            } else {
                imgList.eq(index - 1).addClass('before');
            }
        }, timeDelay)
    }

    //移动端首页的遮罩二维码
    function showMask() {
            mask.css({
                top: doc.scrollTop(),
                height: window.innerHeight
                    //$(window).height()  safari有BUG
            })
            mask.fadeIn(100);
            doc.on("touchmove", function(e){
                e.preventDefault();
            });
        }
    function hideMask() {
            mask.fadeOut(100);
            doc.off("touchmove");
    }
    mWeChat.on('click',function(){
        showMask();
    })
    mask.on("click", function(){
        hideMask();
    });

    //补0；
    function add0(m) {
        return m < 10 ? '0' + m : m 
    }

    //格式化：如2017-05-11 13:56:13
    function format(seconds) {
        //seconds是整数，否则要parseInt转换
        var time = new Date(seconds);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }

    //封装移动端Touch事件
    function tapEvt(dom, callBack) {
        //第一不能超过延时时间，第二不能使移动  
        //获取一些必要的值开始时间，延时时间，是否是移动  
        var startTime = 0;
        var delayTime = 200;
        var isMove = false;
        dom.addEventListener("touchstart", function(event) {
            //记录开始时间  
            startTime = Date.now();
        });
        dom.addEventListener("touchmove", function(event) {
            //如果发生了移动就改变isMove的值  
            isMove = true;
        });
        dom.addEventListener("touchend", function(event) {
            //如果发生了移动就不执行回调  
            //if (isMove) return;
            //如果大于延时时间就不执行回调函数  
            if (Date.now() - startTime > delayTime) return;
            callBack(event);
        });
    }
    function randStr(){
        var s= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var len = s.length;
        var arr1=[],arr2=[];
        var newS = {};
        for(var i=0;i<len1;i++){
            arr1.push(s.charAt(randnum(0,len)));
        }
        for(var j=0;j<len2;j++){
            arr2.push(s.charAt(randnum(0,len)));
        }
        newS ={
            preFix:arr1.join(''),
            postFix:arr2.join('')
        };
        return newS;
    }

    function randnum(s,e){
        var n = e - s;
        return Math.floor(Math.random()*n+s);
    }

    function devicePlatform(){
        var device='';
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            device = 'iOS';
        } else if (/android/.test(ua)) {
            device = 'Android';
        } else {
            device = 'Desktop';
        }
        return device;
    }

    function downLoad(action){
        var device = devicePlatform();
        if(device == 'iOS'){
            if(action=='down'){
                window.location.href='https://itunes.apple.com/cn/app/%E9%A3%9E%E5%9C%B0-%E6%96%87%E8%89%BA%E9%9D%92%E5%B9%B4%E7%9A%84%E9%AB%98%E5%93%81%E8%B4%A8%E6%96%87%E5%AD%A6%E8%89%BA%E6%9C%AF%E9%98%85%E8%AF%BB%E7%A4%BE%E5%8C%BA/id1179249797?mt=8';
             }else{
                showMask();
             }
        }else if(device = 'Android'){
            window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=cn.enclavemedia.app&from=singlemessage';
        }else{
            window.location.href='index.html';
        }
    }
    downApp && downApp.on('click',function(e){
        e.preventDefault();
        downLoad('down');
    })
    openApp && openApp.on('click',function(e){
        e.preventDefault();
        downLoad('open')
    })

    // 文章详情新版本 增加JS
    //专栏 新版
    function getSpecial_v1(){
        m_special_v1.addClass('loadingBg');
         $.get(url.special,function(data){
            console.log(data);
            if(data.code == 200){
                renderDom(m_special_v1, data.result);
                console.log(data.result.specialColumnIntro)
                renderDom(m_probation_list, data.result.preview);
                m_special_v1.removeClass('loadingBg');
            }
         })
    }
    //付费文章 新版
    function getSpecialArticle_v1(){
        $.get(url.specialarticle,function(data){
            console.log('specialarticle');
            console.log(data)
         })
    }
    //文章 新版
    function getArticle_v1(){
        m_article_v1.addClass('loadingBg');
        $.get(url.article,function(data){
            // console.log(data)
            if(data.code == 200){
                renderDom(m_article_v1, data.result.article,filterAction);
                renderDom(m_comment_list, data.result.comment);
                m_article_v1.removeClass('loadingBg');
            }
        })
    }
    getArticle_v1();
    // getSpecialArticle_v1();
    getSpecial_v1();
    //从后台读取完文件后再操作新的DOM
    function filterAction(){
        new m_audio({sel:$('.el-audio')})
    }


});
