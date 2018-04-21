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
		if(currentPage==='new_article_v1'){
			id=data.article.artId
		}else if(currentPage==='special_v1'){
			id=data.special.id
		}else if(currentPage==='special_aritcle_v1'){
			id = data.artId
		}
    	var link = {
    		new_article_v1:'enclave://article?id='+id, 
    		special_v1:'enclave://_special?id='+id, 
    		special_aritcle_v1:'enclave://special_article?id='+id
    	}
        var str = '<header class="mdetail_head">' +
            '<div class="head_wrap">  ' +
            '<div class="art_logo">' +
            '<a href="index.html"><img src="img/logo_new.svg" alt=""></a>' +
            '</div>' +
            '<div class="down_btn">' +
            '<a href="javascript:void(0)" class="download" id="downApp">直接下载</a>' +
            '<a href="'+link[currentPage]+'" class="downApp" id="openApp">打开</a>' +
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
}(window))