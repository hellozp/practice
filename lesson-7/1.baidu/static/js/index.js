$(function () {
    /*
     * 皮肤相关操作
     * */
    (function (doc) {
        var skin = $('#skin');
        var skins = $('#skins');
        var imgs = $('[data-skin-img]');
        var opacity = $('#opacity');
        var skinPreviewImg = $('#skinPreviewImg');
        var skinPreview = $('#skinPreview');
        var skinBg = $('#skinBg');

        //加载上一次的皮肤设置
        (function () {
            var src = getStorage('baidu_skin_src');
            var item = null;
            if (src) {
                item = src.split('=');
                skinBg.css('background-image', "url(" + item[0] + ")");
                skinPreview.css('background-position', '0 0');
                var selected = $(imgs[item[1]]);
                skinPreviewImg.attr('src', selected.attr('src'));
                selected.parent().addClass('selected');
                opacity.css('visibility', 'visible');
            }
        })();

        //点击图片效果
        imgs.click(function () {
            opacity.css('visibility', 'visible');
            skinPreviewImg.attr('src', $(this).attr('src'));
            var src = $(this).data('src');
            skinBg.css('background-image', "url(" + src + ")");
            skins.find('.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            setStorage('baidu_skin_src', src + '=' + $(this).parent().index());
        }).hover(function () {
            skinPreviewImg.attr('src', $(this).attr('src'));
            skinPreview.css('background-position', '0 0');
        }, function () {
            var selected = skins.find('.selected');
            if (selected.length > 0) {
                skinPreviewImg.attr('src', selected.find('img').attr('src'));
                skinPreview.css('background-position', '0 0');
            } else {
                skinPreviewImg.attr('src', '');
                skinPreview.css('background-position', '-275px 0');
            }
        });

        //取消皮肤
        $('#closeSkin').click(function () {
            skinBg.css('background-image', "url()");
            skinPreviewImg.attr('src', '');
            skins.find('.selected').removeClass('selected');
            skinPreview.css('background-position', '-275px 0');
            setStorage('baidu_skin_src', '');
            setStorage('baidu_opacity', 80);
            $('#main').css('opacity', 1);
            $('#opacityVal').html('100%');
            $('#opacitySlide').css('left', 80);
        });

        //开启皮肤
        $('#showSkin').click(function (e) {
            skin.css('top', 0);
            e.preventDefault();
            e.stopPropagation();
        });
        //收起皮肤
        $('#skinClose').click(function (e) {
            skin.css('top', -500);
            e.preventDefault();
        });

        //透明度设置
        (function () {
            //设置初始函数
            var scale = function (btn, bar, title, option) {
                this.btn = document.getElementById(btn);
                this.bar = document.getElementById(bar);
                this.title = document.getElementById(title);
                this.fn = option.fn || function () {
                        console.log('您没有传入回调函数！')
                    };
                if (option.scroll) {
                    this.step = document.getElementById(option.scroll);
                }
                this.max = option.max || 0;
                this.value = (option.value > option.max ? option.max : option.value) || 0;

                option.init && option.init(this.value);

                this.init();
            };
            //设置鼠标函数
            scale.prototype = {
                init: function () {
                    var f = this, g = document, b = window, m = Math;

                    f.btn.style.left = f.value - 7 + 'px';
                    f.title.innerHTML = parseInt(f.value / 80 * 100) + '%';

                    f.btn.onmousedown = function (e) {
                        var x = (e || b.event).clientX;
                        var l = this.offsetLeft;
                        var max = f.bar.offsetWidth - this.offsetWidth;
                        g.onmousemove = function (e) {
                            var thisX = (e || b.event).clientX;
                            var to = m.min(max, m.max(-2, l + (thisX - x)));
                            f.btn.style.left = to + 'px';
                            f.ondrag(m.round(m.max(0, to / max) * f.max), to);
                            b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                        };
                        g.onmouseup = function () {
                            this.onmousemove = null;
                        };
                    };
                },
                ondrag: function (pos, x) {
                    this.step && (this.step.style.width = Math.max(0, x) + 'px');
                    this.title.innerHTML = parseInt(pos / 80 * 100) + '%';
                    this.fn(pos);
                    setStorage('baidu_opacity', pos);
                }
            };
            //调用
            new scale('opacitySlide', 'opacityLine', 'opacityVal', {
                scroll: 'opacityScroll'
                , value: getStorage('baidu_opacity')
                , max: 80
                , fn: function (pos) {
                    //TODO 只透明新闻模块
                    $('#main').css('opacity', pos / 80);
                }
                , init: function (pos) {
                    //TODO 只透明新闻模块
                    $('#main').css('opacity', pos / 80);
                }
            });
        })();

        //自动收起
        $(doc).click(function (e) {
            if ($(e.target).parents('#skin').length === 0) {
                skin.css('top', -500);
            }
        });
    })(document);
});