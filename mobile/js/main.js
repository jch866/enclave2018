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
        openApp = $('#openApp'),
        tab = $('.menu > a'),
        mWeChat = $('#m_weChat'),
        mask = $('#mask'),
        arrow = $(".arrow");
    var downurl = {
        iOS: 'https://itunes.apple.com/cn/app/%E9%A3%9E%E5%9C%B0-%E6%96%87%E8%89%BA%E9%9D%92%E5%B9%B4%E7%9A%84%E9%AB%98%E5%93%81%E8%B4%A8%E6%96%87%E5%AD%A6%E8%89%BA%E6%9C%AF%E9%98%85%E8%AF%BB%E7%A4%BE%E5%8C%BA/id1179249797?mt=8',
        android: 'http://a.app.qq.com/o/simple.jsp?pkgname=cn.enclavemedia.app&from=singlemessage',
        index: 'index.html'
    };
    var delay = 60 * 60 * 3 * 1000; //3小时缓存机制
    var cache = { aL: 'artList', aLT: 'artList_time' };
    var len1 = 6,
        len2 = 3;
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
        ar: 'https://app.enclavebooks.cn/v1_4/recommend', //article random  随机三篇
        homepage: 'https://app.enclavebooks.cn',
        special: 'http://test.enclavebooks.cn/v2/shareSpecial?id=',
        specialarticle: 'http://test.enclavebooks.cn/v2/shareSpecialArticle?id=',
        article: 'http://test.enclavebooks.cn/v2/shareArticle?id=',
    };
    var article_v1 = [{ id: 'new_article_v1', url: url.article },
        { id: 'special_aritcle_v1', url: url.specialarticle },
        { id: 'special_v1', url: url.special }
    ];
    article_v1.forEach(function(item) {
        $('#' + item.id).length > 0 && getRes_v1(item);
    })

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
    function renderDom(wrap, data, cb) {
        switch (wrap) {
            case artListUl: //文章列表的Dom
                artListUl.html('');
                $.each(data, function(index, item) {
                    var str = '<li>' +
                        '<a href="article.html?art_id=' + item.art_id + '" ><img src=' + item.art_thumb + ' alt=""></a>' +
                        '<a href="article.html?art_id=' + item.art_id + '" ><h3>' + item.art_title + '</h3></a>' +
                        '<a href="article.html?art_id=' + item.art_id + '" ><p class="des">' + item.art_description + '</p></a>' +
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
                    '<img src="' + data.editor_avatar + '" alt=""><span>' + data.art_editor + ' · ' + format(data.art_time * 1000) + '</span>' +
                    '</div>' + data.art_content.replace(/\/ueditor\/php/g, (url.homepage + "/ueditor/php")) +
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
                        '<a href="article.html?art_id=' + item.art_id + '" ><img src=' + item.art_thumb + ' alt=""></a>' +
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
                    var str = '<a href="article.html?art_id=' + item.art_id + '" ><li><div class="imgWrap">' +
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
                    var str = '<a href="article.html?art_id=' + item.art_id + '" ><li><div class="imgWrap">' +
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
                    '<span>' + data.art_editor + ' · ' + format(data.art_time * 1000) + '</span>' +
                    '</div>' + data.art_content.replace(/\/ueditor\/php/g, (url.homepage + "/ueditor/php")) +
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
        var localId = location.search.substring(1).split('=')[1];
        $.get(url.ad + 'art_id=' + localId, function(data) {
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
            if ($(document).height() < (doc.height() + headHeight)) {
                $obj.hasClass('fixedTop') && $obj.removeClass('fixedTop');
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
        location.search && switchIndexTab(tab, menu_tab);
    }


    function switchIndexTab(tab, menu_tab) {
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
        mask.parent().addClass('scrollLimit')
        doc.on("touchmove", function(e) {
            if (e.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!e.defaultPrevented) {
                    e.preventDefault();
                }
            }
            // e.preventDefault();
        });
    }

    function hideMask() {
        mask.fadeOut(100);
        mask.parent().removeClass('scrollLimit')
        doc.off("touchmove");
    }
    mWeChat.on('click', function() {
        showMask();
    })
    mask.on("click", function() {
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

    function randStr() {
        var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var len = s.length;
        var arr1 = [],
            arr2 = [];
        var newS = {};
        for (var i = 0; i < len1; i++) {
            arr1.push(s.charAt(randnum(0, len)));
        }
        for (var j = 0; j < len2; j++) {
            arr2.push(s.charAt(randnum(0, len)));
        }
        newS = {
            preFix: arr1.join(''),
            postFix: arr2.join('')
        };
        return newS;
    }

    function randnum(s, e) {
        var n = e - s;
        return Math.floor(Math.random() * n + s);
    }

    function devicePlatform() {
        var device = '';
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            if (/micromessenger/.test(ua)) {
                device = 'iOS_wechat';
            } else {
                device = 'iOS';
            }
        } else if (/android/.test(ua)) {
            if (/micromessenger/.test(ua)) {
                device = 'Android_wechat';
            } else {
                device = 'Android';
            }
        } else {
            device = 'Desktop';
        }
        return device;
    }

    function downLoad() {
        var device = devicePlatform();
        if (device == 'iOS') {
            window.location.href = downurl.iOS
        } else if (device == 'iOS_wechat') {
            showMask();
        } else if (device == 'Android' || device == 'Android_wechat') {
            window.location.href = downurl.android;
        } else {
            window.location.href = downurl.index;
        }
    }
    downApp && downApp.on('click', function(e) {
        e.preventDefault();
        downLoad();
    })
   
    // 文章详情新版本 增加JS

    //新版 通用请求api
    function getRes_v1(item) {
        var url = window.location.href;
        var id = url.split("?")[1].split("=")[1];
        $('#' + item.id).show().addClass('loadingBg');
        $.ajax({
                url: item.url + id,
                type: 'GET',
                timeout: 5000,
                error: function() {
                    setTimeout(function(){
                        window.location.href = 'error.html';
                    },2000)
                },
                success: function(data) {
                    var obj = { id: item.id, data: data, callback: afterRender };
                    if (!data) {
                        window.location.href = 'error.html';
                        return
                    }
                    if (data.code == 200) {
                        new enclave_rt(obj);
                        $('#' + item.id).hide().removeClass('loadingBg');
                    } else {
                        window.location.href = 'error.html';
                    }
                }
        });
}
//从后台读取完文件后再操作新的DOM
function afterRender() {
    new m_audio({ sel: $('.el-audio') });
    otherOperate_v1();
}

function otherOperate_v1() {
    var mart_head = $('.mdetail_head');
    var downApp = $('#downApp'); //顶部直接下载
    var lock_buy = $('#lock_buy'); //有锁的地方
    var order_buy = $('#order_buy'); //专栏订阅
    var openApp = $('#openApp'); //打开
    (mart_head.length != 0) && scrollFixed(mart_head);
    (downApp.length != 0) && downApp.on('click', function(e) {
        e.preventDefault();
        downLoad();
    });
    (lock_buy.length != 0) && lock_buy.on('click', function(e) {
        e.preventDefault();
        downLoad();
    });
    (order_buy.length != 0) && order_buy.on('click', function(e) {
        e.preventDefault();
        downLoad();
    });
    (openApp.length != 0) && openApp.on('click', function(e) {
        applink(e);
    })

}

function applink(e) {
    var path = e.target.href;
    var device = devicePlatform();
    if (device == 'iOS_wechat') {
        e.preventDefault();
        showMask();
        return;
    }
    window.location.href = e.target.href;
    if (device == 'iOS') {
        setTimeout(function() {
            window.location.href = downurl.iOS
        }, 2000)
    } else if (device == 'Android'|| device == 'Android_wechat') {
        setTimeout(function() {
            window.location.href = downurl.android;
        }, 2000)
    }
}


});
//渲染文章内容
$(function() {
    function renderTemplate(options) {
        var defaults = {
            id: 'new_article_v1', // new_article_v1  special_v1  special_aritcle_v1 
            data: options.data,
            homepage: 'https://app.enclavebooks.cn',
            articleBody: ''
        };
        this.articleWrap = $('<article class="shareArt"><div class="padding" id="articleCon"></div></article>');
        this.settings = $.extend(defaults, options);
        this._callback = this.settings.callback;
        this.body = $('#' + this.settings.id).parents('body');
        this.renderAll();
        this._callback && this._callback();
    }
    renderTemplate.prototype.renderAll = function() {
        var data = this.settings.data;
        this._v1_header(data);
        this.body.append(this.articleWrap); //复用;
        this.settings.articleBody = this.body.find('#articleCon');
        if (this.settings.id == 'new_article_v1') {
            this._v1_article_body(data);
            this._v1_article_comment(data);
        } else if (this.settings.id == 'special_v1') {
            this._v1_special_body(data);
            this._v1_special_preview(data);
            this._v1_article_comment(data); //和文章评论一样的DOM，复用
            this._v1_special_subscribe(data);
        } else if (this.settings.id == 'special_aritcle_v1') {
            this._v1_specialArt_body(data);
            this._v1_specialArt_comment(data);
        }

    };
    renderTemplate.prototype._v1_header = function(d) {
        var data = d.result;
        var currentPage = this.settings.id;
        var id = '';
        if (currentPage === 'new_article_v1') {
            id = data.article.artId
        } else if (currentPage === 'special_v1') {
            id = data.special.id
        } else if (currentPage === 'special_aritcle_v1') {
            id = data.artId
        }
        var link = {
            new_article_v1: 'enclave://article?id=' + id,
            special_v1: 'enclave://_special?id=' + id,
            special_aritcle_v1: 'enclave://special_article?id=' + id
        }
        var str = '<header class="mdetail_head">' +
            '<div class="head_wrap">  ' +
            '<div class="art_logo">' +
            '<a href="index.html"><img src="img/logo_new.svg" alt=""></a>' +
            '</div>' +
            '<div class="down_btn">' +
            '<a href="javascript:void(0)" class="download" id="downApp">直接下载</a>' +
            '<a href="' + link[currentPage] + '" class="downApp" id="openApp">打开</a>' +
            '</div>' +
            '</div>' +
            '</header>';
        this.body.append($(str))
    };
    //付费文章页 
    renderTemplate.prototype._v1_specialArt_body = function(d) {
        var data = d.result;
        var self = this;
        var str = '<img src="' + data.artThumb + '" alt="">' +
            '<h1>' + data.artTitle + '</h1>' +
            '<div class="avatar_wrap">' +
            '<span class="avatar">' +
            '<img src="' + data.artAvatar + '" alt="">' +
            '</span>' +
            '<span class="profile">' +
            '<div class="name blue">' + data.artEditor + '</div>' +
            '<div class="time">' + self.format(data.artTime * 1000) + '</div>' +
            '</span>' +
            '</div>' + data.artDescription;
        '</div>';
        var lock = '<div class="lock_tip" id="lock_buy">' +
            '<div class="img"><img src="img/unlock.svg" alt=""></div>' +
            '<div class="buy_text">购买专栏阅读剩余内容</div>' +
            '</div>';
        self.settings.articleBody.append($(str));
        this.body.append($(lock));
    };
    renderTemplate.prototype._v1_specialArt_comment = function(d) {
        var data = d.result.special;
        var specialWrap = '<div class="lock_owner"><div class="title">所属专栏</div><div class="l_box specialOwner"></div></div>';
        //this.settings.articleBody.append($(specialWrap));
        this.body.append($(specialWrap));
        var specialOwner = this.body.find('.specialOwner');
        var str = '<div class="l_thumb">' +
            '<img src="' + data.thumb + '" alt="">' +
            '</div>' +
            '<div class="l_intro">' +
            '<h4>' + data.title + '</h4>' +
            '<p>' + data.intro.slice(0, 50) + '</p>' +
            '<div class="l_foot">' +
            '<span class="lf_name">' + data.authorName + '</span>' +
            '<span class="lf_price">' + data.afterDiscountPrice + '飞币<del>' + data.originalPrice + '飞币</del></span>' +
            '</div>' +
            '</div>';
        specialOwner.append($(str));
    };
    //专栏页 
    renderTemplate.prototype._v1_special_body = function(d) {
        var data = d.result.special;
        var self = this;
        var str = '<div class="m_special_header">' +
            '<img src="' + data.thumb + '" alt="">' +
            '<div class="m_special_title">' +
            '<h1>' + data.title + '</h1>' +
            '<span>' + self.format(data.time * 1000) + '</span>' +
            '</div>' +
            '</div>' + data.specialColumnIntro;
        self.settings.articleBody.append($(str));
    };
    renderTemplate.prototype._v1_special_preview = function(d) {
        var data = d.result.special.preview;
        var self = this;
        var wrap = '<div class="commentBox"><div class="m_preview"><h1>试读</h1><ul class="m_preview_list"></ul></div></div>';
        this.body.append($(wrap));
        var preview = this.body.find('.m_preview_list');
        $.each(data, function(index, item) {
            var str = '<a href="special_article.html?art_id=' + item.artId + '" ><li>' +
                '<div class="summary">' +
                '<h4>' + item.artTitle + '</h4>' +
                '<p>' + item.artTitle + '</p>' +
                '</div>' +
                '<div class="thumbnail">' +
                '<img src="' + item.artThumb + '" alt="">' +
                '</div>' +
                '</li></a>';
            preview.append($(str));
        })
    };
    renderTemplate.prototype._v1_special_subscribe = function(d) {
        var data = d.result.special;
        var str = '<div class="m_subscribe_bar">' +
            '<div class="price">' + data.afterDiscountPrice + '飞币<del>' + data.originalPrice + '飞币</del></div>' +
            '<div class="order" id="order_buy">订阅</div>' +
            '</div>';
        this.body.append($(str));
    };
    //文章详情页 
    renderTemplate.prototype._v1_article_body = function(d) {
        var data = d.result.article;
        var self = this;
        var str = '<img src="' + data.artThumb + '" alt=""><h1>' + data.artTitle + '</h1>' +
            '<div class="avatar_wrap">' +
            '<span class="avatar">' +
            '<img src="' + data.artAvatar + '" alt="">' +
            '</span>' +
            '<span class="profile">' +
            '<div class="name blue">' + data.artEditor + '</div>' +
            '<div class="time">' + self.format(data.artTime * 1000) + '</div>' +
            '</span>' +
            '</div>' + data.artContent.replace(/\/ueditor\/php/g, (self.homepage + "/ueditor/php"));
        self.settings.articleBody.append($(str));
    };
    renderTemplate.prototype._v1_article_comment = function(d) {
        var data = d.result.comment;
        var self = this;
        var wrap = '<div class="commentBox"><div class="m_comment">' +
            '<h1>最新评论</h1><ul class="m_comment_list"></ul>' +
            '</div></div>';
        this.body.append($(wrap));
        var comment = this.body.find('.m_comment_list');
        $.each(data, function(index, item) {
            var str = '<li>' +
                '<div class="m_header avatar_wrap">' +
                '<span class="avatar"><img src="' + item.avatar + '" alt=""></span>' +
                '<span class="profile">' +
                '<div class="name">' + item.name + '</div>' +
                '<div class="time">' + self.format(item.time * 1000) + '</div>' +
                '</span>' +
                '</div>' +
                '<div class="m_body">' + item.content + '</div>' +
                '</li>'
            comment.append($(str));
        })
    };
    renderTemplate.prototype.format = function(seconds) {
        //seconds是整数，否则要parseInt转换
        var time = new Date(seconds);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        var add0 = function add0(m) { return m < 10 ? '0' + m : m }
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    };
    window.enclave_rt = renderTemplate;
}(window));
//处理音频播放
$(function() {
    function m_audio(cfg) {
        this.allAudio_P = cfg.sel;
        if (this.allAudio_P.length === 0) return;
        this.currentAudio = '';
        this.currentAudioJS = '';
        this.currentAudioId = '';
        this.currentAudioUrl = '';
        this.currentAudioOriginalUrl = '';
        this.currentAudioDuration = '';
        this.currentAudioSpanChild = '';
        this.removePlay = cfg.sel.find('img.el-audio-play');
        this.removeDel = cfg.sel.find('img.el-audio-delete');
        this.init();
    };
    m_audio.prototype = {
        init: function() {
            this.removePlay.remove();
            this.removeDel.remove();
            this._initDurationTime();
            this.renderAudioDom();
            this.bindAudioEvent();
        },
        _initDurationTime: function() {
            var self = this;
            this.allAudio_P.each(function(idx) {
                var time = $(this).attr('data-duration');
                $(this).find('span.el-audio-duration').text(self._formatDuration(time))
            })
        },
        renderAudioDom() {
            var self = this;
            this.allAudio_P.addClass('audio-play-box mp3_play');
            this.allAudio_P.each(function(idx) {
                var $this = $(this);
                self._setCurrentAudioInfo($this); //设备当前音频的信息
                var audio = new Audio();
                var attrObj = {
                    'data-id': self.currentAudioId,
                    'data-url': self.currentAudioUrl,
                    'data-original-url': self.currentAudioOriginalUrl,
                    'src': self.currentAudioUrl,
                    'loop': false,
                    'hidden': true
                }
                $(audio).attr(attrObj);
                $this.append($(audio));
            })
        },
        bindAudioEvent() {
            var self = this;
            self.allAudio_P.each(function(idx) {
                var $this = $(this);
                $this.on('click', function() {
                    self._setCurrentAudioInfo($this); //设备当前音频的信息
                    //console.log(self.currentAudioId);
                    if (self.currentAudioJS.paused) {
                        self._setAllAudioPause();
                        self.currentAudioJS.play()
                        self.calCountdown(self.currentAudio);
                        $(this).hasClass('mp3_play') && $(this).removeClass('mp3_play').addClass('mp3_pause');
                        return
                    }
                    self.currentAudioJS.pause();
                    $(this).hasClass('mp3_pause') && $(this).removeClass('mp3_pause').addClass('mp3_play')
                })
            })
        },
        _setAllAudioPause: function() {
            var self = this;
            self.allAudio_P.each(function(idx) {
                var audio = $(this).find('audio[data-id]').get(0);
                if (!audio.paused) {
                    audio.pause();
                    $(audio).parent().hasClass('mp3_pause') && $(this).removeClass('mp3_pause').addClass('mp3_play')
                }
            })
        },
        _setCurrentAudioInfo: function(audiop) {
            var self = this;
            self.currentAudio = audiop.find("audio[data-id]");
            self.currentAudioJS = self.currentAudio.get(0);
            self.currentAudioId = audiop.attr('data-id');
            self.currentAudioUrl = audiop.attr('data-url');;
            self.currentAudioOriginalUrl = audiop.attr('data-original-url');;
            self.currentAudioDuration = audiop.attr('data-duration');;
            self.currentAudioSpanChild = audiop.find("span.el-audio-duration");
        },
        updateRemainTime: function(audio, second) {
            var s = this._formatDuration(second);
            audio.siblings('span.el-audio-duration').text(s);
        },
        calCountdown: function(audio) {
            var self = this;
            audio.on("timeupdate", function() {
                var all = this.duration;
                var curr = this.currentTime;
                var diff = parseInt(all - curr);
                if (diff <= 0) {
                    audio.get(0).pause();
                    self.updateRemainTime(audio, 0);
                    self.initSingleAudio();
                } else {
                    if (!isNaN(diff)) {
                        self.updateRemainTime(audio, diff)
                    }
                }
            })
        },
        initSingleAudio: function() {
            var self = this;
            setTimeout(function() {
                var parent = self.currentAudio.parent();
                parent.hasClass('mp3_pause') && parent.removeClass('mp3_pause').addClass('mp3_play');
                self.currentAudioSpanChild.text(self._formatDuration(self.currentAudioDuration));
                self.currentAudio.attr('src', self.currentAudioUrl)
            }, 1000)
        },
        _formatDuration: function(second) {
            var m = Math.floor(second / 60);
            m = m < 10 ? ('0' + m) : m;
            var s = parseInt(second % 60);
            s = s < 10 ? ('0' + s) : s;
            return m + ':' + s;
        },
    }
    window.m_audio = m_audio;
}(window))