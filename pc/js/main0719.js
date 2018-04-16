$(function() {
    var doc = $(window),
        header = $('#header'), //主要是针对移动端，注意PC也有headid
        artListUl = $(".artList>ul"),
        recommendUl = $(".recommend>ul"),
        mRecommendUl = $(".m_recommend>ul"),
        mArtList = $(".m_artList>ul"),
        mDetails = $(".m_details"),
        details = $('.article_detail'),
        art_head = $('.article_head'),
        mart_head = $('.mdetail_head'),
        menu_tab = $('.menu_con'),
        downApp = $('#downApp'),
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
        homepage: 'https://app.enclavebooks.cn' //article random  随机三篇
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
    function renderDom(wrap, data) {
        switch (wrap) {
            case artListUl: //文章列表的Dom
                artListUl.html('');
                $.each(data, function(index, item) {
                    var str = '<li>' +
                        '<a href="article.html?art_id=' + randStr().preFix+item.art_id+randStr().postFix + '" ><img src=' + item.art_thumb + ' alt=""></a>' +
                        '<a href="article.html?art_id=' + randStr().preFix+item.art_id+randStr().postFix + '" ><h3>' + item.art_title + '</h3></a>' +
                        '<a href="article.html?art_id=' + randStr().preFix+item.art_id+randStr().postFix + '" ><p class="des">' + item.art_description + '</p></a>' +
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
                        '<a href="article.html?art_id=' + randStr().preFix+item.art_id+randStr().postFix + '" ><img src=' + item.art_thumb + ' alt=""></a>' +
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
                    var str = '<a href="article.html?art_id=' + randStr().preFix+item.art_id+randStr().postFix + '" ><li><div class="imgWrap">' +
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
                    var str = '<a href="article.html?art_id=' + randStr().preFix+item.art_id+randStr().postFix + '" ><li><div class="imgWrap">' +
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
        var searchStr = location.search.split('=')[1];
        var s = searchStr.substring(len1);
        var localId = s.substring(0,s.length-len2);
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
        hideMask()
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
    // var mIndex = document.getElementById('header');
    // mIndex && tapEvt(mIndex,function() {
    //     $('body,html').animate({ scrollTop: doc.height() }, 400)
    // });

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

    function downLoad(){
        var device = devicePlatform();
        if(device == 'iOS'){
            window.location.href='https://itunes.apple.com/us/app/fei-de/id1179249797?mt=8';
        }else if(device = 'Android'){
            window.location.href='https://apk.enclavebooks.cn/enclave.apk';
        }else{
            window.location.href='index.html';
        }
    }
    downApp && downApp.on('click',function(e){
        downLoad();
    })
});
