$(function(){
function m_audio(cfg){
	this.allAudio_P=cfg.sel;
    if(this.allAudio_P.length===0)return;
	this.currentAudio='';
	this.currentAudioJS='';
	this.currentAudioId='';
	this.currentAudioUrl='';
	this.currentAudioOriginalUrl='';
	this.currentAudioDuration='';
	this.currentAudioSpanChild='';
	this.removePlay=cfg.sel.find('img.el-audio-play');
	this.removeDel=cfg.sel.find('img.el-audio-delete');
	this.init();
};
m_audio.prototype={
	init:function(){
		this.removePlay.remove();
		this.removeDel.remove();
		this._initDurationTime();
		this.renderAudioDom();
		this.bindAudioEvent();
    },
    _initDurationTime:function(){
    	var self = this;
    	this.allAudio_P.each(function(idx){
    		var time = $(this).attr('data-duration');
    		$(this).find('span.el-audio-duration').text(self._formatDuration(time))
    	})
    },
    renderAudioDom(){
    	var self = this;
    	this.allAudio_P.addClass('audio-play-box mp3_play');
        this.allAudio_P.each(function(idx){
        	var $this = $(this);
        	self._setCurrentAudioInfo($this);//设备当前音频的信息
            var audio= new Audio();
            var attrObj = {
            	'data-id':self.currentAudioId,
            	'data-url':self.currentAudioUrl,
            	'data-original-url':self.currentAudioOriginalUrl,
            	'src':self.currentAudioUrl,
            	'loop':false,
            	'hidden':true
            }
            $(audio).attr(attrObj);
            $this.append($(audio));
        })
    },
    bindAudioEvent(){
    	var self= this;
    	self.allAudio_P.each(function(idx){
            var $this = $(this);
            $this.on('click',function(){
            	self._setCurrentAudioInfo($this);//设备当前音频的信息
                //console.log(self.currentAudioId);
                if(self.currentAudioJS.paused){
                	self._setAllAudioPause();
                    self.currentAudioJS.play()
                    self.calCountdown(self.currentAudio);
                    $(this).hasClass('mp3_play')&&$(this).removeClass('mp3_play').addClass('mp3_pause');
                    return 
                }
                self.currentAudioJS.pause();
                $(this).hasClass('mp3_pause')&&$(this).removeClass('mp3_pause').addClass('mp3_play')
            })
        })
    },
    _setAllAudioPause:function(){
    	var self = this;
    	self.allAudio_P.each(function(idx){
    		var audio = $(this).find('audio[data-id]').get(0);
    		if(!audio.paused){
    			audio.pause();
    			$(audio).parent().hasClass('mp3_pause')&&$(this).removeClass('mp3_pause').addClass('mp3_play')
    		}
    	})
    },
    _setCurrentAudioInfo:function(audiop){
    	var self = this;
    	self.currentAudio=audiop.find("audio[data-id]");
		self.currentAudioJS=self.currentAudio.get(0);
		self.currentAudioId=audiop.attr('data-id');
		self.currentAudioUrl=audiop.attr('data-url');;
		self.currentAudioOriginalUrl=audiop.attr('data-original-url');;
		self.currentAudioDuration=audiop.attr('data-duration');;
		self.currentAudioSpanChild=audiop.find("span.el-audio-duration");
    },
    updateRemainTime:function(audio,second){
        var s = this._formatDuration(second);
       	audio.siblings('span.el-audio-duration').text(s);
    },
    calCountdown:function(audio){
    	var self = this;
        audio.on("timeupdate",function() {
            var all =this.duration;
            var curr=this.currentTime;
            var diff = parseInt(all-curr);
            if (diff <= 0) {
                audio.get(0).pause();
                self.updateRemainTime(audio,0);
                self.initSingleAudio();
            } else {
                if (!isNaN(diff)) {
                    self.updateRemainTime(audio,diff)
                }
            }
        })
    },
    initSingleAudio:function(){
    	var self = this;
    	setTimeout(function(){
            var parent = self.currentAudio.parent();
            parent.hasClass('mp3_pause')&&parent.removeClass('mp3_pause').addClass('mp3_play');
            self.currentAudioSpanChild.text(self._formatDuration(self.currentAudioDuration));
            self.currentAudio.attr('src',self.currentAudioUrl)
        },1000)
    },
    _formatDuration:function(second){
        var m = Math.floor(second / 60);
        m = m < 10 ? ( '0' + m ) : m;
        var s = parseInt(second % 60);
        s = s < 10 ? ( '0' + s ) : s;
        return m + ':' + s;
    },
}
window.m_audio = m_audio;
}(window))