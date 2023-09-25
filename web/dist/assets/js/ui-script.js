(function ($) {
  var userAgent = navigator.userAgent;
  var userAgentCheck = {
    ieMode: document.documentMode,
    isIos: Boolean(userAgent.match(/iPod|iPhone|iPad/)),
    isAndroid: Boolean(userAgent.match(/Android/)),
  };
  if (userAgent.match(/Edge/gi)) {
    userAgentCheck.ieMode = 'edge';
  }
  userAgentCheck.androidVersion = (function () {
    if (userAgentCheck.isAndroid) {
      try {
        var match = userAgent.match(/Android ([0-9]+\.[0-9]+(\.[0-9]+)*)/);
        return match[1];
      } catch (e) {
        console.log(e);
      }
    }
  })();

  // min 포함 max 불포함 랜덤 정수
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 랜덤 문자열
  var hashCodes = [];
  function uiGetHashCode(length) {
    var string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    var stringLength = string.length;

    length = typeof length === 'number' && length > 0 ? length : 10;

    function getCode(length) {
      var code = '';
      for (var i = 0; i < length; i++) {
        code += string[getRandomInt(0, stringLength)];
      }
      if (hashCodes.indexOf(code) > -1) {
        code = getCode(length);
      }
      return code;
    }

    result = getCode(length);
    hashCodes.push(result);

    return result;
  }

  // common
  var $win = $(window);
  var $doc = $(document);

  // swiperSet
  // https://swiperjs.com/swiper-api
  $.fn.swiperSet = function (customOption) {
    var defaultOption = {
      customClass: null,
      appendController: null,
      pageControl: false,
      nextControl: false,
      prevControl: false,
      playControl: false,
      pauseControl: false,
      scrollbarControl: false,
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

      var $items = $this.children();

      if (!$this.parent('.swiper-container').length) {
        $this.wrap('<div class="swiper-object"><div class="swiper-container"></div></div>');
      }
      $this.addClass('swiper-wrapper');
      $items.addClass('swiper-slide').each(function (i) {
        $(this).attr('data-swiper-set-slide-index', i);
      });

      var $container = $this.parent('.swiper-container');
      var $wrap = $container.parent('.swiper-object');
      var $appendController = $wrap;
      var length = $items.length;

      if (typeof option.customClass === 'string') {
        $wrap.addClass(option.customClass);
      }

      option.pagination = option.pagination || {};
      option.navigation = option.navigation || {};
      option.scrollbar = option.scrollbar || {};

      option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
      option.loop = length > 1 && option.loop ? option.loop : false;

      if (option.appendController) {
        $appendController = $(option.appendController);
      }

      if (length === 1) {
        $wrap.addClass('swiper-object-once');
      } else if (length <= 0) {
        $wrap.addClass('swiper-object-empty');
      }

      if (option.pageControl) {
        $appendController.append('<div class="swiper-pagination"></div>');
        option.pagination.el = $appendController.find('.swiper-pagination').get(0);
      }
      if (option.prevControl) {
        $appendController.append('<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">prev</span></button>');
        option.navigation.prevEl = $appendController.find('.swiper-button-prev').get(0);
      }
      if (option.nextControl) {
        $appendController.append('<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">next</span></button>');
        option.navigation.nextEl = $appendController.find('.swiper-button-next').get(0);
      }
      if (option.scrollbarControl) {
        $appendController.append('<div class="swiper-scrollbar"></div>');
        option.scrollbar.el = $appendController.find('.swiper-scrollbar').get(0);
      }
      if (option.playControl) {
        $appendController.append('<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">play</span></button>');
        option.playButton = $appendController.find('.swiper-button-play').get(0);
      }
      if (option.pauseControl) {
        $appendController.append('<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">pause</span></button>');
        option.pauseButton = $appendController.find('.swiper-button-pause').get(0);
      }
      if (option.autoplay && option.playControl) {
        $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
      } else if (!option.autoplay && option.pauseControl) {
        $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
      }

      if ($.isFunction(window.Swiper)) {
        var swiper = new Swiper($container.get(0), option);
        $this.data('swiper', swiper);

        if (option.playControl) {
          $(option.playButton).on('click.swiperSet', function () {
            swiper.autoplay.start();
          });
        }
        if (option.pauseControl) {
          $(option.pauseButton).on('click.swiperSet', function () {
            swiper.autoplay.stop();
          });
        }
        swiper.on('autoplayStart', function () {
          if (option.playControl) {
            $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
          }
          if (option.pauseControl) {
            $(option.pauseButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
          }
        });
        swiper.on('autoplayStop', function () {
          if (option.playControl) {
            $(option.playButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
          }
          if (option.pauseControl) {
            $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
          }
        });
      }
    });
  };

  // simplebar
  // https://grsmto.github.io/simplebar/
  // init ex: $(element).simplebar({/* customOptions */});
  // method ex: $(element).data('simplebar').recalculate();
  $.fn.simplebar = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('simplebar') || !$.isFunction(window.SimpleBar)) return;

      if ($.isFunction(window.SimpleBar)) {
        if (userAgentCheck.ieMode <= 10) {
          $this.css('overflow', 'auto');
        } else {
          var simplebar = new SimpleBar($this.get(0), option);
          $this.data('simplebar', simplebar);
        }
      }
    });

    return $(this);
  };

  // UiTabPanel
  var UiTabPanel = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      active: 'js-tabpanel-active',
      opened: 'js-tabpanel-opened',
    };
    _.options = option;
    _.wrap = $wrap;
    _.crrTarget = '';
    _.init();
    _.on();
  };
  $.extend(UiTabPanel.prototype, {
    init: function () {
      var _ = this;
      var initialOpen = typeof _.options.initialOpen === 'string' && _.options.initialOpen;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }

      if (_.opener.length && _.item.length) {
        _.hashCode = uiGetHashCode();

        if (!initialOpen) {
          initialOpen = _.opener.eq(0).attr('data-tab-open');
        }

        if (_.options.a11y) {
          _.initA11y();
        }

        _.open(initialOpen, false, function () {
          _.wrap.trigger('uiTabPanelInit');
        });
      }
    },
    on: function () {
      var _ = this;
      var openerFocus = false;
      var $focusOpener = null;

      if (_.opener.length && _.item.length) {
        _.opener.on('click.uiTabPanel' + _.hashCode, function (e) {
          var $this = $(this);
          var target = $this.attr('data-tab-open');
          _.open(target);

          if ($this.is('a')) {
            e.preventDefault();
          }
        });
        $doc.on('focusin.uiTabPanel' + _.hashCode, function (e) {
          var $panel = ($(e.target).is(_.item) && $(e.target)) || ($(e.target).closest(_.item).length && $(e.target).closest(_.item));

          if ($panel && !$panel.is(':hidden')) {
            _.open($panel.attr('data-tab'));
          }
        });
        _.opener
          .on('focus.uiTabPanel' + _.hashCode, function () {
            openerFocus = true;
            $focusOpener = $(this);
          })
          .on('blur.uiTabPanel' + _.hashCode, function () {
            openerFocus = false;
            $focusOpener = null;
          });
        $doc
          .on('keydown.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            if (_.options.a11y && openerFocus) {
              if ([13, 32, 35, 36, 37, 38, 39, 40].indexOf(keyCode) > -1) {
                e.preventDefault();
              }
            }
          })
          .on('keyup.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            var target = $focusOpener && $focusOpener.attr('data-tab-open');
            if (_.options.a11y && openerFocus) {
              switch (keyCode) {
                case 35:
                  _.goEnd();
                  break;
                case 36:
                  _.goStart();
                  break;
                case 37:
                  _.prev();
                  break;
                case 38:
                  _.prev();
                  break;
                case 39:
                  _.next();
                  break;
                case 40:
                  _.next();
                  break;
                case 13:
                  _.open(target);
                  break;
                case 32:
                  _.open(target);
                  break;
                default:
                  break;
              }
            }
          });
      }
    },
    open: function (target, focus, callback) {
      var _ = this;
      target = String(target);
      focus = focus instanceof Boolean ? (String(focus) === 'false' ? false : null) : focus;
      var $opener = _.opener.filter('[data-tab-open="' + target + '"]');
      var $panel = _.item.filter('[data-tab="' + target + '"]');

      if (!$panel.hasClass(_.className.opened)) {
        if (_.options.a11y) {
          _.setActiveA11y(target, focus);
        }

        _.crrTarget = target;
        _.opener.not($opener).removeClass(_.className.active);
        _.item.not($panel).removeClass(_.className.opened);
        $opener.addClass(_.className.active);
        $panel.addClass(_.className.opened).trigger('uiTabPanelChange');

        if (typeof callback === 'function') {
          callback();
        }
      }
    },
    indexOpen: function (i, focus) {
      var _ = this;
      target = Number(i);
      var target = _.opener.eq(i).attr('data-tab-open');

      _.open(target, focus);
    },
    next: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) + 1;
      if (i >= length) {
        i = 0;
      }
      _.indexOpen(i);
    },
    prev: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) - 1;
      if (i < 0) {
        i = length - 1;
      }
      _.indexOpen(i);
    },
    goStart: function () {
      var _ = this;
      _.indexOpen(0);
    },
    goEnd: function () {
      var _ = this;
      _.indexOpen(_.opener.length - 1);
    },
    initA11y: function () {
      var _ = this;

      _.opener.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab-open');

        $this
          .attr('role', 'tab')
          .attr('id', 'tabpanel-opener-' + target + '-' + _.hashCode)
          .attr('aria-controls', 'tabpanel-' + target + '-' + _.hashCode);
      });

      _.item.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab');
        var id = 'tabpanel-' + target + '-' + _.hashCode;

        $this.attr('role', 'tabpanel').attr('aria-labelledby', 'tabpanel-opener-' + target + '-' + _.hashCode);

        if (!$('#' + id).length) {
          $this.attr('id', 'tabpanel-' + target + '-' + _.hashCode);
        }
      });

      _.wrap.attr('role', 'tablist');
    },
    setActiveA11y: function (target, focus) {
      var _ = this;

      focus = focus === false ? false : true;

      _.opener.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab-open');

        if (crrTarget === target) {
          $this.attr('tabindex', '0').attr('aria-selected', 'true');
          if (focus) {
            $this.focus();
          }
        } else {
          $this.attr('tabindex', '-1').attr('aria-selected', 'false');
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab');

        if (crrTarget === target) {
          $this.removeAttr('hidden');
        } else {
          $this.attr('hidden', '');
        }
      });
    },
    addA11y: function () {
      var _ = this;

      if (!_.options.a11y) {
        _.options.a11y = true;
        _.initA11y();
        _.setActiveA11y(_.crrTarget);
      }
    },
    clearA11y: function () {
      var _ = this;

      if (_.options.a11y) {
        _.options.a11y = false;
        _.opener.removeAttr('role').removeAttr('id').removeAttr('aria-controls').removeAttr('tabindex').removeAttr('aria-selected');

        _.item.removeAttr('role').removeAttr('id').removeAttr('aria-labelledby').removeAttr('hidden');

        _.wrap.removeAttr('role');
      }
    },
  });
  $.fn.uiTabPanel = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      initialOpen: null,
      a11y: false,
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiTabPanel = this.uiTabPanel;

      if (typeof custom === 'object' && !uiTabPanel) {
        options = $.extend({}, defaultOption, custom);
        this.uiTabPanel = new UiTabPanel(this, options);
      } else if (typeof custom === 'string' && uiTabPanel) {
        switch (custom) {
          case 'addA11y':
            uiTabPanel.addA11y();
            break;
          case 'clearA11y':
            uiTabPanel.clearA11y();
            break;
          case 'open':
            uiTabPanel.open(other[0], other[1]);
            break;
          case 'indexOpen':
            uiTabPanel.indexOpen(other[0], other[1]);
            break;
          case 'next':
            uiTabPanel.next();
            break;
          case 'prev':
            uiTabPanel.prev();
            break;
          case 'goStart':
            uiTabPanel.goStart();
            break;
          case 'goEnd':
            uiTabPanel.goEnd();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiAccordion
  var UiAccordion = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-accordion-opened',
      active: 'js-accordion-active',
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiAccordion.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();
      _.getElements();

      if (_.layer.length && _.item.length && _.item.filter('[data-initial-open]').length) {
        _.item.each(function () {
          var $this = $(this);
          if ($this.attr('data-initial-open') === 'true') {
            _.open($this, 0);
          }
        });
      }

      _.options.onInit();
    },
    getElements: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer);
        } else {
          _.layer = _.options.layer;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }
    },
    on: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.on('click.uiAccordion' + _.hashCode, function () {
          _.toggle($(this).closest(_.item));
        });

        $doc
          .on('keydown.uiAccordion' + _.hashCode, function (e) {
            if (e.keyCode === 9 && _.blockTabKey) {
              e.preventDefault();
            }
          })
          .on('focusin.uiAccordion' + _.hashCode, function (e) {
            var $item = ($(e.target).is(_.layer) || $(e.target).closest(_.layer).length) && $(e.target).closest(_.item);

            if (_.options.focusInOpen && $item) {
              _.open($item, 0);
            }
          });
      }
    },
    off: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.off('click.uiAccordion' + _.hashCode);
        $doc.off('keydown.uiAccordion' + _.hashCode).off('focusin.uiAccordion' + _.hashCode);
      }
    },
    toggle: function ($item) {
      var _ = this;

      if ($item.hasClass(_.className.opened)) {
        _.close($item);
      } else {
        _.open($item);
      }
    },
    open: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if (!$item.hasClass(_.className.opened)) {
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', 'auto');
        $opener = $item.find(_.opener);
        $item.addClass(_.className.opened);
        $opener.addClass(_.className.active);
        $layer.addClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $layer
                .css({
                  height: 'auto',
                })
                .trigger('uiAccordionAfterOpened');
            }
          )
          .trigger('uiAccordionOpened', [beforeH, afterH]);

        if (_.options.once) {
          _.item.not($item).each(function () {
            _.close($(this));
          });
        }
      }
    },
    close: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if ($item.hasClass(_.className.opened)) {
        _.blockTabKey = true;
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', '');
        $opener = $item.find(_.opener);
        $item.removeClass(_.className.opened);
        $opener.removeClass(_.className.active);
        $layer.removeClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $layer
                .css({
                  display: '',
                  height: '',
                })
                .trigger('uiAccordionAfterClosed');
              _.blockTabKey = false;
            }
          )
          .trigger('uiAccordionClosed', [beforeH, afterH]);
      }
    },
    allClose: function () {
      var _ = this;

      _.item.each(function () {
        _.close($(this));
      });
    },
    update: function (newOptions) {
      var _ = this;

      _.off();
      $.extend(_.options, newOptions);
      _.getElements();
      _.on();
    },
  });
  $.fn.uiAccordion = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      layer: null,
      once: false,
      speed: 500,
      focusInOpen: true,
      onInit: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiAccordion = this.uiAccordion;

      if (typeof custom === 'object' && !uiAccordion) {
        options = $.extend({}, defaultOption, custom);
        this.uiAccordion = new UiAccordion(this, options);
      } else if (typeof custom === 'string' && uiAccordion) {
        switch (custom) {
          case 'allClose':
            uiAccordion.allClose();
            break;
          case 'close':
            uiAccordion.close(other[0], other[1]);
            break;
          case 'open':
            uiAccordion.open(other[0], other[1]);
            break;
          case 'update':
            uiAccordion.update(other[0]);
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiDropDown
  var UiDropDown = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-dropdown-opened',
      top: 'js-dropdown-top',
      bottom: 'js-dropdown-bottom',
    };
    _.css = {
      hide: {
        position: 'absolute',
        top: '',
        left: '',
        bottom: '',
        marginLeft: '',
        display: 'none',
      },
      show: {
        position: 'absolute',
        top: '100%',
        left: '0',
        display: 'block',
      },
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiDropDown.prototype, {
    init: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener).eq(0);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer).eq(0);
        } else {
          _.layer = _.options.layer;
        }
        _.layer.css(_.css.hide);
      }

      if (_.layer.length) {
        _.wrap.css('position', 'relative');
      }

      _.options.init();
    },
    on: function () {
      var _ = this;

      if (_.layer.length) {
        _.hashCode = uiGetHashCode();

        if (_.opener && _.opener.length && _.options.event === 'click') {
          _.opener.on('click.uiDropDown' + _.hashCode, function () {
            _.toggle();
          });
          $doc.on('click.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

            if (!check) {
              _.close();
            }
          });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.layer) || $(e.target).closest(_.layer).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        } else if (_.options.event === 'hover') {
          _.wrap
            .on('mouseenter.uiDropDown' + _.hashCode, function () {
              _.open();
            })
            .on('mouseleave.uiDropDown' + _.hashCode, function () {
              _.close();
            });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        }
        $win.on('resize.uiDropDown' + _.hashCode, function () {
          _.update();
        });
      }
    },
    update: function () {
      var _ = this;
      var docW = 0;
      var winH = 0;
      var wrapT = 0;
      var scrollTop = 0;
      var layerT = 0;
      var layerL = 0;
      var layerH = 0;
      var layerW = 0;
      var $overflow = null;
      var overflowT = 0;
      var overflowB = 0;
      var overflowL = 0;
      var overflowR = 0;
      var style = {
        marginTop: _.options.marginTop,
        marginLeft: _.options.marginLeft,
      };

      if (_.wrap.hasClass(_.className.opened)) {
        _.layer.css({
          top: '',
          left: '-999999px',
          right: '',
          bottom: '',
          marginLeft: '',
          marginRight: '',
        });
        _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

        docW = $doc.width();
        docH = $doc.height();
        winW = $win.width();
        winH = $win.height();
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();

        _.layer.css(_.css.show);

        if (_.options.align === 'right') {
          style.marginLeft = 0;
          style.marginRight = _.options.marginRight;
          _.layer.css({
            left: 'auto',
            right: '0',
          });
        } else if (_.options.align === 'center') {
          _.layer.css({
            left: '50%',
          });
        }

        wrapT = _.wrap.offset().top;
        layerT = _.layer.offset().top;
        layerL = _.layer.offset().left;
        trueLayerW = _.layer.outerWidth();
        layerH = _.layer.outerHeight() + _.options.marginTop + _.options.marginBottom;
        layerW = trueLayerW + _.options.marginLeft + _.options.marginRight;

        if (_.options.align === 'center') {
          layerL -= Math.ceil(trueLayerW / 2);
          style.marginLeft = -Math.ceil(trueLayerW / 2);
        }

        _.wrap.parents().each(function () {
          var $this = $(this);
          if ($this.css('overflow').match(/hidden|auto|scroll/) && !$this.is('html')) {
            $overflow = $this;
            return false;
          }
        });

        if ($overflow !== null && $overflow.length) {
          overflowT = $overflow.offset().top;
          overflowB = docH - (overflowT + $overflow.height());
          overflowL = $overflow.offset().left;
          overflowR = docW - (overflowL + $overflow.width());
        }

        if (winH - overflowB < layerT + layerH - scrollTop && wrapT - layerH - scrollTop - overflowT >= 0) {
          _.wrap.addClass(_.className.top);
          _.layer.css({
            top: 'auto',
            bottom: '100%',
          });
          style.marginTop = 0;
          style.marginBottom = _.options.marginBottom;
        } else {
          _.wrap.addClass(_.className.bottom);
        }

        if (docW - overflowR < layerL + layerW && docW - overflowL - overflowR - layerW > 0) {
          if (_.options.align === 'right') {
            style.marginRight = Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft -= Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else {
            style.marginLeft = -Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          }
        } else if (overflowL > layerL) {
          if (_.options.align === 'right') {
            style.marginRight = -Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft += Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else {
            style.marginLeft = Math.ceil(overflowL - layerL + _.options.marginLeft);
          }
        }

        _.layer.css(style);
      }
    },
    toggle: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.close();
      } else {
        _.open();
      }
    },
    open: function () {
      var _ = this;

      if (!_.wrap.hasClass(_.className.opened)) {
        _.wrap.addClass(_.className.opened).css('z-index', '1200');
        _.layer.css(_.css.show);
        _.update();
        _.layer.trigger('uiDropDownOpened');
      }
    },
    close: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
        _.layer.css(_.css.hide).trigger('uiDropDownClosed');
      }
    },
  });
  $.fn.uiDropDown = function (custom) {
    var defaultOption = {
      opener: null,
      layer: null,
      event: 'click',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      align: 'left',
      init: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiDropDown = this.uiDropDown;

      if (typeof custom === 'object' && !uiDropDown) {
        options = $.extend({}, defaultOption, custom);
        this.uiDropDown = new UiDropDown(this, options);
      } else if (typeof custom === 'string' && uiDropDown) {
        switch (custom) {
          case 'close':
            uiDropDown.close();
            break;
          case 'open':
            uiDropDown.open();
            break;
          case 'update':
            uiDropDown.update();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiTemplateForm
  var UiTemplateForm = function (customOptions) {
    var _ = this;
    var defaultOption = {
      container: null, // string : query selector : required
      addButton: null, // string : query selector : required
      removeButton: null, // string : query selector
      allSelect: null, // string : query selector
      defaultData: {},
      initData: [],
      min: 0,
      max: null, // number
      afterAddReRender: false,
      empty: null, // string : html
      template: function (data, index, templateFormObject) {
        return '<div>' + index + '</div>';
      },
      onInit: function (templateFormObject) {},
      onBeforeAdd: function (data, templateFormObject) {},
      onAdd: function (data, templateFormObject) {},
      onBeforeRemove: function (data, templateFormObject) {},
      onRemove: function (data, templateFormObject) {},
      onDataUpdate: function (oldDataArray, newDataArray, templateFormObject) {},
      onSelected: function (data, index, templateFormObject) {},
      onUnSelected: function (data, index, templateFormObject) {},
      onRender: function (templateFormObject) {},
    };

    _.className = {
      container: 'js-ui-template-form-container',
      item: 'js-ui-template-form-item',
      selected: 'js-ui-template-form-selected',
      checkbox: 'js-ui-template-form-checkbox',
      removeButton: 'js-ui-template-form-remove-button',
      empty: 'js-ui-template-form-empty',
    };
    _.options = $.extend({}, defaultOption, customOptions);
    _.dataArray = [];

    $.each(_.options.initData, function () {
      _.dataArray.push($.extend({}, _.options.defaultData, this));
    });

    if (_.options.container && _.options.addButton) {
      _.init();
      _.on();
      _.options.onInit(_);
      _.onInit(_);
    }
  };
  $.extend(UiTemplateForm.prototype, {
    init: function () {
      var _ = this;
      var length = _.dataArray.length;

      _.hashCode = uiGetHashCode();
      _.eventName = 'uiTemplateForm_' + _.hashCode;
      _.container = $(_.options.container);
      _.addButton = $(_.options.addButton);
      _.removeButton = null;
      _.items = [];

      if (_.options.removeButton) {
        _.removeButton = $(_.options.removeButton);
      }

      if (_.options.allSelect) {
        _.allSelect = $(_.options.allSelect);
      }

      _.container.addClass(_.className.container);

      $.each(_.dataArray, function (i) {
        _.addTemplate(this, i);
      });

      if (length < _.options.min) {
        for (var i = 0; i < _.options.min - length; i++) {
          _.add({});
        }
      }

      _.checkEmpty();
    },

    on: function () {
      var _ = this;

      _.addButton.on('click.' + _.eventName, function (e) {
        e.preventDefault();
        _.add({});
      });
      _.container.on('change.' + _.eventName, '.' + _.className.checkbox, function () {
        var $this = $(this);
        _.checkboxChange($this);
      });
      _.container.on('change.' + _.eventName + ' dp.change.' + _.eventName, '[name]', function () {
        var $this = $(this);
        _.inputChange($this);
      });
      _.container.on('click.' + _.eventName, '.' + _.className.removeButton, function () {
        var $this = $(this);
        _.buttonRemove($this);
      });

      if (_.removeButton) {
        _.removeButton.on('click.' + _.eventName, function (e) {
          e.preventDefault();
          _.selectedRemove();
        });
      }
      if (_.allSelect) {
        _.allSelect.on('change.' + _.eventName, function () {
          var $this = $(this);
          _.allSelected($this);
        });
      }
    },

    updateDisabled: function () {
      var _ = this;
      var length = _.dataArray.length;

      if (_.removeButton) {
        if (length <= _.options.min) {
          _.removeButton.prop('disabled', true).attr('disabled', '');
        } else {
          _.removeButton.prop('disabled', false).removeAttr('disabled');
        }
      }
      if (_.addButton && typeof _.options.max === 'number') {
        if (length >= _.options.max) {
          _.addButton.prop('disabled', true).attr('disabled', '');
        } else {
          _.addButton.prop('disabled', false).removeAttr('disabled');
        }
      }
    },

    checkEmpty: function () {
      var _ = this;
      var length = _.dataArray.length;
      var $empty = null;
      var $getEmpty = _.container.find('.' + _.className.empty);

      if (!length) {
        if (!$getEmpty.length && _.options.empty) {
          $empty = $(_.options.empty);
          $empty.addClass(_.className.empty);
          _.container.append($empty);
        }
      } else {
        $getEmpty.remove();
      }
    },

    setTemplateIndex: function ($item, data, index) {
      var _ = this;
      var keys = Object.keys(data);

      $item.data('index', index);
      $item.find('.' + _.className.checkbox).data('index', index);
      $item.find('.' + _.className.removeButton).data('index', index);
      $item.find('[name]').each(function () {
        var $this = $(this);
        var name = $this.attr('name');

        if ($.inArray(name, keys) >= 0) {
          $this.attr('name', name + '_' + index);
        }
      });
    },

    setTemplateValue: function ($item, data, index) {
      var _ = this;
      var keys = Object.keys(data);

      $.each(keys, function () {
        var $target = $item.find('[name="' + this + '_' + index + '"]');
        if (!($target.attr('type') === 'file')) {
          $target.val(data[this]);
        }
      });
    },

    add: function (data) {
      var _ = this;
      var length = _.dataArray.length;
      var newData = {};

      if (!(typeof _.options.max === 'number' && _.options.max <= length)) {
        newData = $.extend({}, _.options.defaultData, data);

        _.options.onBeforeAdd(newData, _);
        _.onBeforeAdd(newData, _);

        _.dataArray.push(newData);
        _.addTemplate(newData, length);
        _.checkEmpty();

        if (_.options.afterAddReRender) {
          _.reRender();
        }

        _.options.onAdd(newData, _);
        _.onAdd(newData, _);
      }
    },

    addTemplate: function (data, index) {
      var _ = this;
      var $newItem = $(_.options.template(data, index, _));

      $newItem.addClass(_.className.item);
      _.setTemplateIndex($newItem, data, index);
      _.setTemplateValue($newItem, data, index);

      _.container.append($newItem);
      _.items.push($newItem);

      if (_.allSelect) {
        _.allSelect.prop('checked', false).removeAttr('checked');
      }

      _.updateDisabled();

      uiJSCommon();

      _.options.onRender(_);
      _.onRender(_);
    },

    checkboxChange: function ($checkbox) {
      var _ = this;
      var $item = $checkbox.closest('.' + _.className.item);
      var index = $checkbox.data('index');
      var data = _.dataArray[index];
      var length = _.dataArray.length;
      var count = 0;

      if ($checkbox.is(':checked')) {
        $item.addClass(_.className.selected);
        _.options.onSelected(data, index, _);
        _.onSelected(data, index, _);
      } else {
        $item.removeClass(_.className.selected);
        _.options.onUnSelected(data, index, _);
        _.onUnSelected(data, index, _);
      }

      $.each(_.items, function () {
        if (this.find('.' + _.className.checkbox).is(':checked')) {
          count++;
        }
      });

      if (length <= count) {
        _.allSelect.prop('checked', true).attr('checked', '');
      } else {
        _.allSelect.prop('checked', false).removeAttr('checked');
      }
    },

    allSelected: function ($allCheckbox) {
      var _ = this;
      var $checkboxs = _.container.find('.' + _.className.checkbox);

      if ($allCheckbox.is(':checked')) {
        $checkboxs.prop('checked', true).attr('checked', '').trigger('change');
      } else {
        $checkboxs.prop('checked', false).removeAttr('checked').trigger('change');
      }
    },

    inputChange: function ($input) {
      var _ = this;
      var $item = $input.closest('.' + _.className.item);
      var index = $item.data('index');
      var data = _.dataArray[index];
      var name = $input.attr('name').replace(new RegExp('_' + index + '$'), '');
      var value = $input.val();
      var oldDataArray = [];

      if (typeof data[name] === 'string' && !(data[name] === value)) {
        $.each(_.dataArray, function () {
          oldDataArray.push($.extend({}, this));
        });

        data[name] = value;

        _.options.onDataUpdate(oldDataArray, _.dataArray, _);
        _.onDataUpdate(oldDataArray, _.dataArray, _);
      }
    },

    remove: function (indexArray) {
      var _ = this;
      var length = _.dataArray.length;
      var newDataArray = [];
      var newItems = [];
      var removeDataArray = [];
      var returnData = null;
      var removeIndexArray = [];
      var diffLength = 0;

      indexArray.sort();

      if ($.isArray(indexArray) && indexArray.length) {
        if (length - indexArray.length < _.options.min) {
          diffLength = _.options.min - (length - indexArray.length);
          $.each(indexArray, function (i) {
            if (i >= diffLength) {
              removeIndexArray.push(indexArray[i]);
            }
          });
        } else {
          removeIndexArray = indexArray;
        }
      }

      if (removeIndexArray.length) {
        $.each(_.dataArray, function (i) {
          if ($.inArray(i, removeIndexArray) < 0) {
            newDataArray.push(this);
            newItems.push(_.items[i]);
          } else {
            removeDataArray.push(this);
            _.items[i].remove();
          }
        });

        returnData = removeDataArray.length > 1 ? removeDataArray : removeDataArray[0];

        _.options.onBeforeRemove(returnData, _);
        _.onBeforeRemove(returnData, _);

        _.dataArray = newDataArray;

        $.each(newItems, function (i) {
          var $this = this;
          var data = newDataArray[i];
          var $newItem = $(_.options.template(data, i, _));

          $newItem.addClass(_.className.item);
          _.setTemplateIndex($newItem, data, i);
          _.setTemplateValue($newItem, data, i);

          $this.replaceWith($newItem);

          newItems[i] = $newItem;
        });

        _.items = newItems;

        if (_.allSelect) {
          _.allSelect.prop('checked', false).removeAttr('checked');
        }

        _.updateDisabled();
        _.checkEmpty();

        uiJSCommon();

        _.options.onRender(_);
        _.onRender(_);

        _.options.onRemove(returnData, _);
        _.onRemove(returnData, _);
      }
    },

    selectedRemove: function () {
      var _ = this;
      var indexArray = [];

      _.container.find('.' + _.className.checkbox + ':checked').each(function () {
        var index = $(this).data('index');
        indexArray.push(index);
      });

      if (indexArray.length) {
        _.remove(indexArray);
      }
    },

    buttonRemove: function ($button) {
      var _ = this;
      var index = $button.data('index');

      _.remove([index]);
    },

    removeAll: function () {
      var _ = this;
      var indexArray = [];

      $.each(_.dataArray, function (i) {
        if (i >= _.options.min) {
          indexArray.push(i);
        }
      });

      if (indexArray.length) {
        _.remove(indexArray);
      }
    },

    reRender: function () {
      var _ = this;

      $.each(_.items, function (i) {
        var $this = this;
        var data = _.dataArray[i];
        var $newItem = $(_.options.template(data, i, _));

        $newItem.addClass(_.className.item);
        _.setTemplateIndex($newItem, data, i);
        _.setTemplateValue($newItem, data, i);

        if ($this.find('.' + _.className.checkbox).is(':checked')) {
          $newItem
            .find('.' + _.className.checkbox)
            .prop('checked', true)
            .attr('checked', '');
        }

        $this.replaceWith($newItem);

        _.items[i] = $newItem;
      });

      uiJSCommon();

      _.options.onRender(_);
      _.onRender(_);
    },

    dataChange: function (index, data) {
      var _ = this;
      var newData = {};
      var $newItem = null;

      if (_.dataArray[index]) {
        newData = $.extend(_.dataArray[index], data);
        $newItem = $(_.options.template(newData, index, _));

        $newItem.addClass(_.className.item);
        _.setTemplateIndex($newItem, newData, index);
        _.setTemplateValue($newItem, newData, index);

        if (_.items[index].find('.' + _.className.checkbox).is(':checked')) {
          $newItem
            .find('.' + _.className.checkbox)
            .prop('checked', true)
            .attr('checked', '');
        }

        _.items[index].replaceWith($newItem);
        _.items[index] = $newItem;

        uiJSCommon();

        _.options.onRender(_);
        _.onRender(_);
      }
    },

    getData: function () {
      var _ = this;
      return _.dataArray;
    },

    replaceData: function (replaceData) {
      var _ = this;

      _.dataArray = [];
      _.items = [];
      _.container.empty();

      $.each(replaceData, function () {
        _.dataArray.push($.extend({}, _.options.defaultData, this));
      });

      $.each(_.dataArray, function (i) {
        _.addTemplate(this, i);
      });

      var length = _.dataArray.length;

      if (length < _.options.min) {
        for (var i = 0; i < _.options.min - length; i++) {
          _.add({});
        }
      }

      _.checkEmpty();
    },

    onInit: function (templateFormObject) {},
    onBeforeAdd: function (data, templateFormObject) {},
    onAdd: function (data, templateFormObject) {},
    onBeforeRemove: function (data, templateFormObject) {},
    onRemove: function (data, templateFormObject) {},
    onDataUpdate: function (oldDataArray, newDataArray, templateFormObject) {},
    onSelected: function (data, index, templateFormObject) {},
    onUnSelected: function (data, index, templateFormObject) {},
    onRender: function (templateFormObject) {},
  });
  window.UiTemplateForm = UiTemplateForm;

  // scrollbars width
  var scrollbarsWidth = {
    width: 0,
    set: function () {
      var _ = scrollbarsWidth;
      var $html = $('html');
      var $wrap = $('#wrap');
      $html.css('overflow', 'hidden');
      var beforeW = $wrap.width();
      $html.css('overflow', 'scroll');
      var afterW = $wrap.width();
      $html.css('overflow', '');
      _.width = beforeW - afterW;
    },
  };
  function checkScrollbars() {
    var $html = $('html');
    if (Boolean(scrollbarsWidth.width) && !$html.hasClass('is-scrollbars-width')) {
      $html.addClass('is-scrollbars-width');
    }
  }

  // scrollBlock
  var scrollBlock = {
    scrollTop: 0,
    scrollLeft: 0,
    className: {
      block: 'is-scroll-blocking',
    },
    block: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if (!$html.hasClass(_.className.block)) {
        scrollBlock.scrollTop = $win.scrollTop();
        scrollBlock.scrollLeft = $win.scrollLeft();

        $html.addClass(_.className.block);
        $win.scrollTop(0);
        $wrap.scrollTop(_.scrollTop);
        $win.scrollLeft(0);
        $wrap.scrollLeft(_.scrollLeft);
      }
    },
    clear: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if ($html.hasClass(_.className.block)) {
        $html.removeClass(_.className.block);
        $wrap.scrollTop(0);
        $win.scrollTop(_.scrollTop);
        $wrap.scrollLeft(0);
        $win.scrollLeft(_.scrollLeft);
      }
    },
  };
  window.uiJSScrollBlock = scrollBlock;

  // layer
  var uiLayer = {
    zIndex: 10000,
    open: function (target, opener, speed) {
      var _ = uiLayer;
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var hasScrollBlock = true;
      var isFocus = true;
      var isCycleFocus = true;
      var speed = typeof speed === 'number' ? speed : 350;
      var $label = null;
      var hashCode = '';
      var labelID = '';
      var $layers = $('[data-layer]');
      var $preOpenLayers = $layers.filter('.js-layer-opened').not($layer);
      var notOhterElements = 'script, link, style, base, meta, br, [aria-hidden], [inert], .js-not-inert, .js-not-inert *, [data-ui-js]';
      var $ohterElements = $('body')
        .find('*')
        .not('[data-layer], [data-layer] *, ' + notOhterElements);
      var $preLayersElements = $preOpenLayers.find('*').not(notOhterElements);

      $layers.parents().each(function () {
        $ohterElements = $ohterElements.not($(this));
      });

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        $label = $layer.find('h1, h2, h3, h4, h5, h6, p').eq(0);
        hashCode = (function () {
          var code = $layer.data('uiJSHashCode');
          if (!(typeof code === 'string')) {
            code = uiGetHashCode();
            $layer.data('uiJSHashCode', code);
          }
          return code;
        })();
        hasScrollBlock = (function () {
          var val = $layer.data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return hasScrollBlock;
          }
        })();
        isFocus = (function () {
          var val = $layer.data('focus');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return isFocus;
          }
        })();
        isCycleFocus = (function () {
          var val = $layer.data('cycle-focus');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return isCycleFocus;
          }
        })();

        _.zIndex++;
        $layer.trigger('layerBeforeOpened').attr('role', 'dialog').attr('aria-hidden', 'true').css('visibility', 'hidden').attr('hidden', '');
        if ($label.length) {
          labelID = (function () {
            var id = $label.attr('id');
            if (!(typeof id === 'string' && id.length)) {
              id = target + '-' + hashCode;
              $label.attr('id', id);
            }
            return id;
          })();
          $layer.attr('aria-labelledby', labelID);
        }
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);

        $ohterElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preLayersElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preOpenLayers.attr('aria-hidden', 'true').attr('inert', '').removeAttr('aria-modal');

        if (isCycleFocus && !$layer.children('.js-loop-focus').length) {
          $('<div class="js-loop-focus" tabindex="0"></div>')
            .on('focusin.uiLayer', function () {
              $layer.focus();
            })
            .appendTo($layer);
        }

        $layer
          .stop()
          .removeClass('js-layer-closed')
          .css({
            display: 'block',
            zIndex: _.zIndex,
          })
          .animate(
            {
              opacity: 1,
            },
            speed,
            function () {
              $layer.trigger('layerAfterOpened');
            }
          )
          .attr('tabindex', '0')
          .attr('aria-hidden', 'false')
          .attr('aria-modal', 'true')
          .css('visibility', 'visible')
          .removeAttr('hidden')
          .data('layerIndex', $('.js-layer-opened').length);

        if (isFocus) {
          $layer.focus();
        }

        if (hasScrollBlock) {
          scrollBlock.block();
        }

        if (Boolean(opener) && $(opener).length) {
          $layer.data('layerOpener', $(opener));
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          $layer.addClass('js-layer-opened').trigger('layerOpened');
        }, 0);
      }
    },
    close: function (target, speed) {
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var $opener = $layer.data('layerOpener');
      var $preOpenLayers = $('[data-layer].js-layer-opened').not($layer);
      var $preOpenLayerHasScrollBlock = $preOpenLayers.not(function () {
        var val = $(this).data('scroll-block');
        if (typeof val === 'boolean' && !val) {
          return true;
        } else {
          return false;
        }
      });
      var isScrollBlock = $html.hasClass(scrollBlock.className.block);
      var timer = null;
      var speed = typeof speed === 'number' ? speed : 350;
      var $ohterElements = $('body').find('[data-ui-js="hidden"]');
      var preOpenLayersHigherZIndex = (function () {
        var array = [];
        $preOpenLayers.each(function () {
          var zIndex = $(this).css('z-index');
          array.push(zIndex);
        });
        array.sort();
        return array[array.length - 1];
      })();
      var $preOpenLayer = $preOpenLayers.filter(function () {
        var zIndex = $(this).css('z-index');

        return zIndex === preOpenLayersHigherZIndex;
      });
      var $preOpenLayerOhterElements = $preOpenLayer.find('[data-ui-js="hidden"]');

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed')
          .css('display', 'block')
          .data('layerIndex', null)
          .attr('aria-hidden', 'true')
          .removeAttr('aria-modal')
          .animate(
            {
              opacity: 0,
            },
            speed,
            function () {
              $(this).css('display', 'none').css('visibility', 'hidden').attr('hidden', '').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if ($preOpenLayer.length) {
                $preOpenLayerOhterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
                $preOpenLayer.attr('aria-hidden', 'false').removeAttr('inert').attr('aria-modal', 'true');
              }

              if (!$preOpenLayers.length) {
                $html.removeClass('js-html-layer-opened');
                $ohterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
              }

              if (!$preOpenLayerHasScrollBlock.length && isScrollBlock) {
                scrollBlock.clear();
              }

              if ($opener && $opener.length) {
                $opener.focus();
                $layer.data('layerOpener', null);
              }

              $layer.trigger('layerAfterClosed');
            }
          )
          .trigger('layerClosed');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $html.addClass('js-html-layer-closed-animate');
        }, 0);
      }
    },
    checkFocus: function (e) {
      var $layer = $('[data-layer]')
        .not(':hidden')
        .not(function () {
          var isCycleFocus = $(this).data('cycle-focus');
          if (typeof isCycleFocus === 'boolean' && !isCycleFocus) {
            return true;
          } else {
            return false;
          }
        });
      var $target = $(e.target);
      var $closest = $target.closest('[data-layer]');
      var lastIndex = (function () {
        var index = 0;
        $layer.each(function () {
          var crrI = $(this).data('layerIndex');
          if (crrI > index) {
            index = crrI;
          }
        });
        return index;
      })();
      var checkLayer = $layer.length && !($target.is($layer) && $target.data('layerIndex') === lastIndex) && !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

      if (checkLayer) {
        $layer
          .filter(function () {
            return $(this).data('layerIndex') === lastIndex;
          })
          .focus();
      }
    },
  };
  window.uiJSLayer = uiLayer;

  $doc
    .on('focusin.uiLayer', uiLayer.checkFocus)
    .on('click.uiLayer', '[data-role="layerClose"]', function () {
      var $this = $(this);
      var $layer = $this.closest('[data-layer]');
      if ($layer.length) {
        uiLayer.close($layer.attr('data-layer'));
      }
    })
    .on('click.uiLayer', '[data-layer-open]', function (e) {
      var $this = $(this);
      var layer = $this.attr('data-layer-open');
      var $layer = $('[data-layer="' + layer + '"]');
      if ($layer.length) {
        uiLayer.open(layer);
        $layer.data('layerOpener', $this);
      }
      e.preventDefault();
    })
    .on('layerAfterOpened.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var layer = $this.attr('data-layer');
      var delay = Number($this.attr('data-layer-timer-close'));
      var timer = setTimeout(function () {
        uiLayer.close(layer);
        clearTimeout(timer);
      }, delay);
      $this.data('layer-timer', timer);
    })
    .on('layerBeforeClosed.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var timer = $this.data('layer-timer');
      clearTimeout(timer);
    });

  // input disabled class
  function checkDisabledClass($root) {
    if (!$root) {
      $root = $doc;
    }

    var $inputs = $root.find('.ui-input, .ui-select');

    $inputs.each(function () {
      var $this = $(this);
      var $parent = $this.parent('.ui-input-block, .ui-select-block');
      var disabledClassName = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var disabledHasClass = $parent.hasClass(disabledClassName);
      var readonlyClassName = 'is-readonly';
      var isReadonly = $this.is('[readonly]');
      var readonlyHasClass = $parent.hasClass(readonlyClassName);

      if (isDisabled && !disabledHasClass) {
        $parent.addClass(disabledClassName);
      } else if (!isDisabled && disabledHasClass) {
        $parent.removeClass(disabledClassName);
      }

      if (isReadonly && !readonlyHasClass) {
        $parent.addClass(readonlyClassName);
      } else if (!isReadonly && readonlyHasClass) {
        $parent.removeClass(readonlyClassName);
      }
    });
  }

  // fixBarSet
  function fixBarSet() {
    var $layoutWrap = $('.layout-wrap');
    var $top = $('.fix-top-wrap');
    var $fakeTop = $('.js-fake-top');
    var $bottom = $('.fix-bottom-wrap');
    var $fakeBottom = $('.js-fake-bottom');
    var topH = 0;
    var bottomH = 0;
    var fakeTopH = 0;
    var fakeBottomH = 0;

    if ($top.length && !$top.is(':hidden')) {
      topH = $top.outerHeight();
      if (!$fakeTop.length) {
        $layoutWrap.prepend('<div class="js-fake-top"></div>');
        $fakeTop = $('.js-fake-top');
      }
      fakeTopH = $fakeTop.height();
      if (!(topH === fakeTopH)) {
        $fakeTop.height(topH);
      }
    }
    if ($bottom.length && !$bottom.is(':hidden')) {
      bottomH = $bottom.outerHeight();
      if (!$fakeBottom.length) {
        $layoutWrap.append('<div class="js-fake-bottom"></div>');
        $fakeBottom = $('.js-fake-bottom');
      }
      fakeBottomH = $fakeBottom.height();
      if (!(bottomH === fakeBottomH)) {
        $fakeBottom.height(bottomH);
      }
    }
  }

  // fixBarScroll
  function fixBarScroll() {
    var $fixBar = $('.fix-top-wrap, .fix-bottom-wrap');
    var scrollX = $win.scrollLeft();

    $fixBar.css('margin-left', -scrollX);
  }

  // header scroll
  function headerScroll() {
    var $header = $('.header');
    var scrollTop = $win.scrollTop();
    var className = 'is-scroll';

    if (scrollTop > 0) {
      $header.addClass(className);
    } else {
      $header.removeClass(className);
    }
  }

  // checkbox tab
  var checkboxTab = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-checkbox-tab]:not(:checked)').each(function () {
        checkboxTab.update($(this));
      });
      $root.find('[data-checkbox-tab]:checked').each(function () {
        checkboxTab.update($(this));
      });
    },
    update: function ($input) {
      var name = $input.data('checkbox-tab');
      var $panel = $('[data-checkbox-tab-panel="' + name + '"]');
      var isChecked = $input.is(':checked');

      if (isChecked) {
        $panel.css('display', 'block');
      } else {
        $panel.css('display', 'none');
      }

      $panel.trigger('checkboxTabChange');
    },
  };
  $doc.on('change.checkboxTab', '[data-checkbox-tab]', function () {
    var $this = $(this);
    var group = $this.attr('data-checkbox-tab-group');
    var $groupSiblings = $('[data-checkbox-tab-group="' + group + '"]');
    var name = $this.attr('name');
    var $siblings = $('[name="' + name + '"]').not($this);

    if (typeof group === 'string') {
      $groupSiblings.not(':checked').each(function () {
        checkboxTab.update($(this));
      });
      $groupSiblings.filter(':checked').each(function () {
        checkboxTab.update($(this));
      });
    } else {
      if ($this.is('[type="radio"]')) {
        $siblings.each(function () {
          checkboxTab.update($(this));
        });
      }
      checkboxTab.update($this);
    }
  });

  // checkbox group
  var checkboxGroup = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-checkbox-group]').each(function () {
        checkboxGroup.update($(this));
      });
    },
    on: function () {
      $doc.on('change.uiJSCheckboxGroup', '[data-checkbox-group], [data-checkbox-group-child]', function (e, eventBy) {
        checkboxGroup.update($(this), eventBy);
      });
    },
    update: function ($input, eventBy) {
      var parentName = $input.attr('data-checkbox-group');
      var childName = $input.attr('data-checkbox-group-child');

      if (typeof childName === 'string' && childName.length) {
        checkboxGroup.updateChild(childName, eventBy);
      }
      if (typeof parentName === 'string' && parentName.length) {
        checkboxGroup.updateParent(parentName, eventBy);
      }
    },
    updateParent: function (name, eventBy) {
      var $parent = $('[data-checkbox-group=' + name + ']').not('[disabled]');
      var $child = $('[data-checkbox-group-child=' + name + ']').not('[disabled]');
      var checked = $parent.is(':checked');

      if (!(typeof eventBy === 'string' && eventBy === 'checkboxGroupUpdateChild')) {
        $child.each(function () {
          var $thisChild = $(this);
          var beforeChecked = $thisChild.is(':checked');

          if (checked) {
            $thisChild.prop('checked', true).attr('checked', '');
          } else {
            $thisChild.prop('checked', false).removeAttr('checked');
          }

          var afterChecked = $thisChild.is(':checked');

          if (beforeChecked !== afterChecked) {
            $thisChild.trigger('change');
          }
        });
      }
    },
    updateChild: function (name, eventBy) {
      var $parent = $('[data-checkbox-group=' + name + ']').not('[disabled]');
      var $child = $('[data-checkbox-group-child=' + name + ']').not('[disabled]');
      var length = $child.length;
      var checkedLength = $child.filter(':checked').length;

      $parent.each(function () {
        var $thisParent = $(this);
        var beforeChecked = $thisParent.is(':checked');

        if (length === checkedLength) {
          $thisParent.prop('checked', true).attr('checked', '');
        } else {
          $thisParent.prop('checked', false).removeAttr('checked');
        }

        var afterChecked = $thisParent.is(':checked');

        if (beforeChecked !== afterChecked) {
          $thisParent.trigger('change', 'checkboxGroupUpdateChild');
        }
      });
    },
  };
  checkboxGroup.on();

  // selet tab
  var selectTab = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.ui-select').each(function () {
        selectTab.update($(this));
      });
    },
    update: function ($select) {
      var $tapOption = $select.find('[data-select-tab]');

      if (!$tapOption.length) {
        return;
      }

      $tapOption.not(':selected').each(function () {
        var $this = $(this);
        var name = $this.attr('data-select-tab');
        var $panel = $('[data-select-tab-panel="' + name + '"]');

        $panel.css('display', 'none');
      });
      $tapOption.filter(':selected').each(function () {
        var $this = $(this);
        var name = $this.attr('data-select-tab');
        var $panel = $('[data-select-tab-panel="' + name + '"]');

        $panel.css('display', 'block');
      });
    },
  };
  $doc.on('change.selectTab', '.ui-select', function () {
    selectTab.update($(this));
  });

  // area disabled
  var areaDisabled = {
    className: {
      disabled: 'is-area-disabled',
    },
    selector: 'input, select, button, textarea, fieldset, optgroup',
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[type="checkbox"][data-area-disabled], [type="radio"][data-area-disabled]').each(function () {
        var $this = $(this);
        areaDisabled.eventCall($this);
      });
      $root.find('.js-area-disabled').each(function () {
        var $this = $(this);
        areaDisabled.selectUpdate($this);
      });
    },
    eventCall: function ($this) {
      var isRadio = $this.attr('type') === 'radio';
      var name = $this.attr('name');

      if (isRadio) {
        areaDisabled.update($('[name="' + name + '"]').not($this));
      }

      areaDisabled.update($this);
    },
    update: function ($input) {
      var target = $input.attr('data-area-disabled');
      var $inputSiblings = $('[data-area-disabled="' + target + '"]').not($input);
      var $target = $('[data-area-disabled-target="' + target + '"]');
      var isChecked = $input.is(':checked') && !($inputSiblings.length && $inputSiblings.not(':checked').length);
      var selector = areaDisabled.selector;

      if (isChecked) {
        $target.removeClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', false).removeAttr('disabled');
        }
        $target.find(selector).prop('disabled', false).removeAttr('disabled');
      } else {
        $target.addClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', true).attr('disabled', '');
        }
        $target.find(selector).prop('disabled', true).attr('disabled', '');
      }
      checkDisabledClass();
    },
    selectUpdate: function ($select) {
      var $options = $select.find('option');
      var $selectedOption = $options.filter(':selected');
      var target = $selectedOption.attr('data-area-disabled');
      var $target = $('[data-area-disabled-target="' + target + '"]');
      var selector = areaDisabled.selector;

      $options.not($selectedOption).each(function () {
        var $this = $(this);
        var thisTarget = $this.attr('data-area-disabled');
        var $thisTarget = $('[data-area-disabled-target="' + thisTarget + '"]');

        if (thisTarget) {
          $thisTarget.addClass(areaDisabled.className.disabled);
          if ($thisTarget.is(selector)) {
            $thisTarget.prop('disabled', true).attr('disabled', '');
          }
          $thisTarget.find(selector).prop('disabled', true).attr('disabled', '');
        }
      });

      if (target) {
        $target.removeClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', false).removeAttr('disabled');
        }
        $target.find(selector).prop('disabled', false).removeAttr('disabled');
      }

      checkDisabledClass();
    },
  };
  $doc
    .on('change.areaDisabled', '[type="checkbox"][data-area-disabled], [type="radio"][data-area-disabled]', function () {
      var $this = $(this);
      areaDisabled.eventCall($this);
    })
    .on('change.areaDisabled', '.js-area-disabled', function () {
      var $this = $(this);
      areaDisabled.selectUpdate($this);
    });

  // gnb
  var gnb = {
    hover: function ($this) {
      var name = $this.attr('data-gnb');
      var $otherItems = $('[data-gnb]').not($this);
      var $contents = $('[data-gnb-contents="' + name + '"]');
      var $otherContents = $('[data-gnb-contents]').not($contents);
      var $layer = $('.gnb-depth');
      var scroller = $('.gnb-depth__scroller').data('simplebar');

      function appendFakeFocus(className, $wrap, first) {
        var $el = $wrap.find('.' + className);
        if (!$el.length) {
          $el = $('<div tabindex="0" class="' + className + '"></div>');
          if (first) {
            $wrap.prepend($el);
          } else {
            $wrap.append($el);
          }
        }
      }

      appendFakeFocus('js-fake-first-focus', $layer, true);
      appendFakeFocus('js-fake-last-focus', $layer);

      if ($contents.length) {
        appendFakeFocus('js-fake-last-focus', $this);
        $layer.addClass('is-opened');
      } else {
        $layer.removeClass('is-opened');
      }
      if (!$this.hasClass('is-hover') && scroller) {
        scroller.getScrollElement().scrollTop = 0;
      }
      $otherItems.removeClass('is-hover');
      $this.addClass('is-hover');
      $otherContents.removeClass('is-show');
      $contents.addClass('is-show').attr('tabindex', '0');
    },
    leave: function () {
      var $layer = $('.gnb-depth');
      var $items = $('[data-gnb]');

      $items.removeClass('is-hover');
      $layer.removeClass('is-opened');
    },
    layerFirstFocus: function () {
      var $hoverItem = $('[data-gnb].is-hover');
      $hoverItem.prev().find('.gnb__link').focus();
    },
    layerLastFocus: function () {
      var $hoverItem = $('[data-gnb].is-hover');
      $hoverItem.next().find('.gnb__link').focus();
    },
    itemLastFocus: function () {
      var $showContents = $('[data-gnb-contents].is-show');
      $showContents.focus();
    },
  };
  $doc
    .on('mouseenter.uiGNB', '[data-gnb]', function () {
      gnb.hover($(this), 'hover');
    })
    .on('mouseleave.uiGNB', '.gnb', function () {
      gnb.leave();
    })
    .on('focusin.uiGNB', '[data-gnb]', function () {
      gnb.hover($(this));
    })
    .on('areaFocusOut.uiGNB', '.gnb', function () {
      gnb.leave();
    })
    .on('focusin.uiGNB', '.gnb-depth .js-fake-first-focus', function () {
      gnb.layerFirstFocus();
    })
    .on('focusin.uiGNB', '.gnb-depth .js-fake-last-focus', function () {
      gnb.layerLastFocus();
    })
    .on('focusin.uiGNB', '[data-gnb] .js-fake-last-focus', function () {
      gnb.itemLastFocus();
    });

  // datepicker
  function datepicker($root) {
    if (!$root) {
      $root = $doc;
    }
    $root.find('.js-datepicker-range').each(function () {
      var $this = $(this);
      var $min = $this.find('.js-datepicker-range__min');
      var $max = $this.find('.js-datepicker-range__max');

      $min.datetimepicker({
        locale: 'ko',
        format: 'YYYY-MM-DD',
        dayViewHeaderFormat: 'YYYY년 MMMM',
      });
      $max.datetimepicker({
        locale: 'ko',
        format: 'YYYY-MM-DD',
        dayViewHeaderFormat: 'YYYY년 MMMM',
        useCurrent: false,
      });
      $min.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
        $max.data('DateTimePicker').minDate(e.date);
      });
      $max.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
        $min.data('DateTimePicker').maxDate(e.date);
      });
    });

    $root.find('.js-datepicker').datetimepicker({
      locale: 'ko',
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY년 MMMM',
    });
  }
  function setTimeSelectRange($min, $max, min, max) {
    $min
      .find('option')
      .prop('selected', false)
      .removeAttr('selected')
      .filter('[data-option="' + min + '"]')
      .prop('selected', true)
      .attr('selected', '');
    $max
      .find('option')
      .prop('selected', false)
      .removeAttr('selected')
      .filter('[data-option="' + max + '"]')
      .prop('selected', true)
      .attr('selected', '');
  }
  $doc.on('click.uiDatepicker', '[data-datepicker-range]', function () {
    var $this = $(this);
    var $wrap = $this.closest('.js-datepicker-range');
    var $min = $wrap.find('.js-datepicker-range__min');
    var $max = $wrap.find('.js-datepicker-range__max');
    var $hourMin = $wrap.find('.js-datepicker-range__hour-select-min');
    var $hourMax = $wrap.find('.js-datepicker-range__hour-select-max');
    var $minuteMin = $wrap.find('.js-datepicker-range__minute-select-min');
    var $minuteMax = $wrap.find('.js-datepicker-range__minute-select-max');
    var range = $this.attr('data-datepicker-range');
    var val = Number(range.replace(/(-*[0-9]+) *((year|month|day)(s*))/g, '$1'));
    var unit = range.replace(/(-*[0-9]+) *((year|month|day)(s*))/g, '$2');
    var minDateTimePicker = $min.length ? $min.data('DateTimePicker') : null;
    var maxDateTimePicker = $max.length ? $max.data('DateTimePicker') : null;
    var now = moment();
    var to = moment().add(val, unit);
    var nowHour = now.hour();
    var nowMinute = now.minute();
    var isHour = $hourMin.length && $hourMax.length;

    if (minDateTimePicker && maxDateTimePicker) {
      if (val < 0) {
        if (!isHour) {
          to.add(1, 'day');
        }
        minDateTimePicker.date(to.format());
        maxDateTimePicker.date(now.format());
      } else if (0 < val) {
        if (!isHour) {
          to.add(-1, 'day');
        }
        minDateTimePicker.date(now.format());
        maxDateTimePicker.date(to.format());
      }
    }
    if (isHour) {
      setTimeSelectRange($hourMin, $hourMax, nowHour, nowHour);
    }
    if ($minuteMin.length && $minuteMax.length) {
      setTimeSelectRange($minuteMin, $minuteMax, nowMinute, nowMinute);
    }
  });

  // notice popup
  var noticePopupSlide = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.notice-popup').each(function () {
        var $this = $(this);
        var $list = $this.find('.notice-popup__list');
        var $controller = $this.find('.notice-popup__controller');
        var paginationType = $this.attr('data-pagination-type');

        $list.swiperSet({
          appendController: $controller,
          pageControl: true,
          nextControl: true,
          prevControl: true,
          pagination: {
            type: paginationType ? paginationType : 'bullets',
            clickable: true,
          },
          autoHeight: true,
          on: {
            init: noticePopupSlide.update,
            afterInit: function () {
              windowPopupResize();
            },
            slideChange: noticePopupSlide.update,
          },
        });
      });
    },
    update: function (swiper) {
      var index = swiper.realIndex;
      $('.js-notice-popup-title').removeClass('is-show').eq(index).addClass('is-show');
      $('.js-notice-popup-foot').removeClass('is-show').eq(index).addClass('is-show');
    },
  };

  // dashboard notice
  var dashboardNoticeSlide = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.dashboard-notice__list').swiperSet({
        nextControl: true,
        prevControl: true,
        loop: true,
      });
    },
  };

  // history tab
  var historyTab = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      var index = $('.history-tab__item.is-active').index();
      $root.find('.history-tab__list').swiperSet({
        slidesPerView: 'auto',
        freeMode: true,
        freeModeMomentumBounce: false,
        touchReleaseOnEdges: true,
        mousewheel: true,
        initialSlide: index,
      });
    },
  };

  // board tab scroll slide
  var boardTabScrollSlide = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.board-tab--scroll-slide').each(function () {
        var $this = $(this);
        var $controller = $this.find('.board-tab__controller');
        var $list = $this.find('.board-tab__list');

        $list.swiperSet({
          slidesPerView: 'auto',
          freeMode: true,
          freeModeMomentumBounce: false,
          touchReleaseOnEdges: true,
          mousewheel: true,
          appendController: $controller,
          prevControl: true,
          nextControl: true,
        });
      });
    },
  };
  $doc.on('uiTabPanelChange.boardTabScrollSlide', '.board-detail-wrap.js-ui-tab-panel', function () {
    var $this = $(this);
    var $boardTabScroller = $this.find('.board-tab--scroll-slide .board-tab__scroller');

    if (!$boardTabScroller.length) {
      return;
    }

    var $boardTabList = $this.find('.board-tab--scroll-slide .board-tab__list');
    var $boardTabActiveItem = $boardTabList.find('.board-tab__link.js-tabpanel-active').closest('.board-tab__item');
    var swiper = $boardTabList.data('swiper');
    var $panel = $this.find('.board-tab-panel');
    var index = $panel.index($panel.filter('.js-tabpanel-opened'));
    var isOverflow =
      $boardTabScroller.width() < $boardTabActiveItem.offset().left + $boardTabActiveItem.width() - $boardTabScroller.offset().left ||
      $boardTabScroller.offset().left > $boardTabActiveItem.offset().left;

    if (swiper && isOverflow) {
      swiper.slideTo(index);
    }
  });

  // page class
  function pageClass() {
    var $html = $('html');

    function addClass(className) {
      if (!$html.hasClass(className)) {
        $html.addClass(className);
      }
    }

    function removeClass(className) {
      if ($html.hasClass(className)) {
        $html.removeClass(className);
      }
    }

    if ($('.page-contents--full-layout').length) {
      addClass('full-layout');
    } else {
      removeClass('full-layout');
    }
    if ($('.page-contents--dark').length || $('.window-popup--dark').length) {
      addClass('theme-dark');
    } else {
      removeClass('theme-dark');
    }
    if ($('.login-wrap').length) {
      addClass('login-page');
    } else {
      removeClass('login-page');
    }
    if ($('.utility-wrap').length) {
      addClass('utility-page');
    } else {
      removeClass('utility-page');
    }
  }

  // file watch
  var fileWatch = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-file-watch]').each(function () {
        var $this = $(this);
        var val = $this.val();

        if (typeof val === 'string' && val.length) {
          fileWatch.update($this);
        }
      });
    },
    update: function ($input) {
      var name = $input.attr('data-file-watch');
      var $target = $('[data-file-watch-target="' + name + '"]');
      var val = $input.val();
      var match = null;

      if (typeof val === 'string' && val.length) {
        match = val.match(/[^\/\\]+$/);
        if (!(typeof match === null)) {
          val = match[0];
        }
        $input.addClass('is-inputed');
      } else {
        val = '';
        $input.removeClass('is-inputed');
      }

      $target.text(val);
    },
  };
  $doc.on('change.fileWatch', '[data-file-watch]', function () {
    fileWatch.update($(this));
  });

  // maxlength
  var maxlength = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-maxlength]').each(function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var length = val.length;
      var max = Number($input.data('maxlength'));

      if (length > max) {
        val = val.substring(0, max);
        $input.val(val);
      }
    },
    on: function () {
      $doc.on('keyup.uiJSMaxlength focusin.uiJSMaxlength focusout.uiJSMaxlength', '[data-maxlength]', function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
  };
  maxlength.on();

  // text count
  var textCount = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-text-count]').each(function () {
        var $this = $(this);
        textCount.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var count = val.length;
      var $count = $($input.data('text-count'));

      $count.text(count);
    },
    on: function () {
      $doc.on('keyup.uiJSTextCount focusin.uiJSTextCount focusout.uiJSTextCount', '[data-text-count]', function () {
        var $this = $(this);
        textCount.update($this);
      });
    },
  };
  textCount.on();

  // get byte
  function getByte(string) {
    var b, i, c;
    for (b = i = 0; (c = string.charCodeAt(i++)); b += c >> 11 ? 2 : c >> 7 ? 2 : 1);
    return b;
  }

  // cutToByte
  function cutToByte(string, maxByte) {
    var b, i, c;
    for (b = i = 0; (c = string.charCodeAt(i++)); b += c >> 11 ? 2 : c >> 7 ? 2 : 1) {
      if (b > maxByte) break;
    }
    return string.substring(0, i - 2);
  }

  // maxbyte
  var maxbyte = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-maxbyte]').each(function () {
        var $this = $(this);
        maxbyte.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var length = getByte(val);
      var max = Number($input.data('maxbyte'));

      if (length > max) {
        val = cutToByte(val, max);
        $input.val(val);
      }
    },
    on: function () {
      $doc.on('keyup.uiJSMaxbyte focusin.uiJSMaxbyte focusout.uiJSMaxbyte', '[data-maxbyte]', function () {
        var $this = $(this);
        maxbyte.update($this);
      });
    },
  };
  maxbyte.on();

  // byte count
  var byteCount = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-byte-count]').each(function () {
        var $this = $(this);
        byteCount.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var count = getByte(val);
      var $count = $($input.data('byte-count'));

      $count.text(count);
    },
    on: function () {
      $doc.on('keyup.uiJSByteCount focusin.uiJSByteCount focusout.uiJSByteCount', '[data-byte-count]', function () {
        var $this = $(this);
        byteCount.update($this);
      });
    },
  };
  byteCount.on();

  // window popup resize
  var windowPopupResizeTimer = null;
  var windowPopupResizeTimeAfter = null;
  function windowPopupResize() {
    clearTimeout(windowPopupResizeTimer);
    clearTimeout(windowPopupResizeTimeAfter);

    windowPopupResizeTimer = setTimeout(function () {
      var $wrap = $('.window-popup');
      var windowWidth = $win.width();
      var windowHeight = $win.height();
      var windowOuterWidth = window.outerWidth;
      var windowOuterHeight = window.outerHeight;
      var width = windowWidth;
      var height = 800;

      if ($wrap.length) {
        if (windowOuterWidth) {
          width = windowOuterWidth;
        }

        window.resizeTo(width, 1000);

        $wrap.css('height', 'auto');
        height = $wrap.outerHeight();

        if (height > 800) {
          height = 800;
        }

        if (windowOuterHeight) {
          height = windowOuterHeight - windowHeight + height + 2;
        }

        $wrap.css('height', '');

        console.log(height);

        windowPopupResizeTimeAfter = setTimeout(function () {
          window.resizeTo(width, height);
        }, 50);
      }
    }, 0);
  }
  window.uiJSWindowPopupResize = windowPopupResize;

  $doc.on('uiTabPanelInit.uiPopupResize', '.js-ui-tab-panel', function () {
    windowPopupResize();
  });

  // today widget
  var todayWidget = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.today-widget').each(function () {
        var $this = $(this);
        var timer = $this.data('todayWidget');

        if (timer) {
          clearInterval(timer);
        }

        timer = setInterval(function () {
          todayWidget.update($this);
        }, 100);

        $this.data('todayWidget', timer);
      });
    },
    update: function ($wrap) {
      var $time = $wrap.find('.today-widget__time');
      var $date = $wrap.find('.today-widget__date');
      var timeText = $time.text();
      var dateText = $date.text();
      var now = moment();
      var time = now.format('HH:mm:ss');
      var date = now.format('YYYY-MM-DD dddd');

      if (!(timeText === time)) {
        $time.text(time);
      }
      if (!(dateText === date)) {
        $date.text(date);
      }
    },
  };
  $doc.on('click.uiJSTodayWidget', '.js-today-widget-refresh', function () {
    todayWidget.init();
  });

  // dashboard setting
  var dashboardSetting = {
    classNames: {
      show: 'is-show',
    },
    init: function ($wrap) {
      var $checkboxs = $wrap.find('.ui-checkbox[data-type]');
      var initial = (function () {
        var data = $wrap.attr('data-initial');

        if (!data || !data.length) {
          return [];
        }

        var split = data.replace(/\s/g, '').split(',');

        if (!split[0].length) {
          return [];
        } else {
          return split;
        }
      })();

      dashboardSetting.clean($wrap);

      $.each(initial, function () {
        $checkboxs
          .filter('[value="' + this + '"]')
          .prop('checked', true)
          .attr('checked', '')
          .trigger('change');
      });
    },
    clean: function ($wrap) {
      var $checkboxs = $wrap.find('.ui-checkbox[data-type]');
      var $input = $wrap.find('.js-dashboard-setting-input');
      var $empty = $wrap.find('.dashboard-preview__empty');
      var $inner = $wrap.find('.dashboard-preview__inner');

      $checkboxs.prop('checked', false).removeAttr('checked');
      $input.val('');
      $empty.addClass(dashboardSetting.classNames.show);
      $inner.empty().removeClass(dashboardSetting.classNames.show);
    },
    update: function ($checkbox) {
      var $wrap = $checkbox.closest('.dashboard-setting');
      var $checkboxs = $wrap.find('.ui-checkbox[data-type]');
      var $input = $wrap.find('.js-dashboard-setting-input');
      var $empty = $wrap.find('.dashboard-preview__empty');
      var $inner = $wrap.find('.dashboard-preview__inner');
      var $items = $inner.find('.dashboard-preview__item');
      var inputVal = $input.val();
      var val = $checkbox.val();
      var type = $checkbox.attr('data-type');
      var text = $checkbox.attr('data-text');

      if ($checkboxs.filter(':checked').length > 10) {
        $checkbox.prop('checked', false).removeAttr('checked');
        return;
      }

      if ($checkbox.is(':checked')) {
        if (inputVal.length) {
          inputVal += ', ';
        }
        inputVal += val;

        if (!$empty.is(':hidden')) {
          $empty.removeClass(dashboardSetting.classNames.show);
        }
        if ($inner.is(':hidden')) {
          $inner.addClass(dashboardSetting.classNames.show);
        }

        $inner.append(dashboardSetting.template(type, text));
      } else {
        inputVal = inputVal.replace(new RegExp(val + '(, )*'), '').replace(/, $/, '');

        $items.filter('.dashboard-preview__item--' + type).remove();

        if ($items.length <= 1) {
          if ($empty.is(':hidden')) {
            $empty.addClass(dashboardSetting.classNames.show);
          }
          if (!$inner.is(':hidden')) {
            $inner.removeClass(dashboardSetting.classNames.show);
          }
        }
      }

      $input.val(inputVal);
    },
    template: function (type, text) {
      console.log(text, typeof text, text.match(/\\n/g));
      return (
        '<div class="dashboard-preview__item dashboard-preview__item--' +
        type +
        '">' +
        '<div class="dashboard-preview__block">' +
        '<div class="dashboard-preview__text">' +
        text.replace(/\\n/g, '<br>') +
        '</div>' +
        '</div>' +
        '</div>'
      );
    },
  };
  $doc
    .on('layerOpened.uiJSDashboardSetting', '.layer-dashboard-setting', function () {
      var $wrap = $(this).find('.dashboard-setting');
      if ($wrap.length) {
        dashboardSetting.init($wrap);
      }
    })
    .on('change.uiJSDashboardSetting', '.dashboard-setting .ui-checkbox[data-type]', function () {
      dashboardSetting.update($(this));
    })
    .on('click.uiJSDashboardSetting', '.js-dashboard-setting-clean', function () {
      var $wrap = $(this).closest('.dashboard-setting');
      if ($wrap.length) {
        dashboardSetting.clean($wrap);
      }
    });

  // common js
  function uiJSCommon($root) {
    if (!$root) {
      $root = $doc;
    }

    pageClass();
    checkScrollbars();
    fixBarSet();
    checkDisabledClass($root);
    checkboxGroup.init($root);
    checkboxTab.init($root);
    selectTab.init($root);
    areaDisabled.init($root);
    maxlength.init($root);
    textCount.init($root);
    maxbyte.init($root);
    byteCount.init($root);

    $root.find('.ui-scroller').simplebar({ autoHide: false });

    $root.find('.js-ui-tab-panel').each(function () {
      var $this = $(this);
      var initial = $this.attr('data-initial');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-tab-panel');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('[data-tab]').filter(filter);
      var $openers = $this.find('[data-tab-open]').filter(filter);

      $this.uiTabPanel({
        a11y: true,
        item: $items,
        opener: $openers,
        initialOpen: initial,
      });
    });

    $root.find('.js-ui-accordion').each(function () {
      var $this = $(this);
      var once = $this.attr('data-once') === 'true';
      var focusInOpen = !($this.attr('data-focus-open') === 'false');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-accordion');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('.js-ui-accordion__item').filter(filter);
      var $openers = $this.find('.js-ui-accordion__opener').filter(filter);
      var $layers = $this.find('.js-ui-accordion__layer').filter(filter);

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
          once: once,
          focusInOpen: focusInOpen,
        });
      }
    });

    $root.find('.tooltip.js-ui-dropdown').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
      marginLeft: 10,
      marginRight: 10,
    });
    $root.find('.tooltip.js-ui-dropdown-hover').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
      marginLeft: 10,
      marginRight: 10,
    });
    $root.find('.js-ui-dropdown:not(.tooltip)').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
    });
    $root.find('.js-ui-dropdown-hover:not(.tooltip)').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
    });

    $root.find('.gnb-depth__list').each(function () {
      var $this = $(this);
      var $items = $this.find('.gnb-depth__item');
      var $openers = $this.find('.gnb-depth__opener');
      var $layers = $this.find('.gnb-depth__sub');

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $items.filter('.is-active').attr('data-initial-open', 'true');
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      }
    });

    datepicker($root);

    noticePopupSlide.init($root);
    historyTab.init($root);
    fileWatch.init($root);
    boardTabScrollSlide.init($root);
    uiTree.init($root);
    todayWidget.init($root);
    dashboardNoticeSlide.init($root);
  }
  window.uiJSCommon = uiJSCommon;

  // uiJSResize
  function uiJSResize() {
    fixBarSet();
  }
  window.uiJSResize = uiJSResize;

  // area focus
  function areaFocus(area) {
    $doc
      .on('focus.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.addClass('is-focus').trigger('areaFocusIn');
      })
      .on('blur.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.data(
          'areaFocusTimer',
          setTimeout(function () {
            $this.removeClass('is-focus').trigger('areaFocusOut');
          }, 100)
        );
      });
  }
  areaFocus('.ui-select-block');
  areaFocus('.ui-input-block');
  areaFocus('.gnb');
  areaFocus('.js-auto-search');

  // inputed
  function inputedCheck($input, parent) {
    var val = $input.val();
    var $wrap = $input.closest(parent);

    if ($wrap.length) {
      if (typeof val === 'string' && val.length > 0) {
        $wrap.addClass('is-inputed');
      } else {
        $wrap.removeClass('is-inputed');
      }
    }
  }
  $doc.on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.ui-input', function () {
    inputedCheck($(this), '.ui-input-block');
  });

  // input delete
  $doc.on('click.inputDelete', '.ui-input-delete', function () {
    var $this = $(this);
    var $input = $this.closest('.ui-input-block').find('.ui-input');

    $input.val('').trigger('focus');
  });

  // layer opened scroll to start
  $doc
    .on('layerOpened.layerOpenedScrollToStart', '.layer-wrap', function () {
      var $this = $(this);
      var scroller = $this.find('.ui-scroller').data('simplebar');

      if (scroller) {
        scroller.getScrollElement().scrollTop = 0;
        scroller.getScrollElement().scrollLeft = 0;
      }
    })
    .on('uiDropDownOpened.layerOpenedScrollToStart', '.js-ui-dropdown, .js-ui-dropdown-hover', function () {
      var $this = $(this);
      var scroller = $this.find('.ui-scroller').data('simplebar');

      if (scroller) {
        scroller.getScrollElement().scrollTop = 0;
        scroller.getScrollElement().scrollLeft = 0;
      }
    });

  // toggle active
  $doc.on('click.uiToggleActive', '.js-toggle-active', function () {
    var $this = $(this);
    var isDummyLink = $this.is('a') && !($this.attr('href') && $this.attr('href').length);

    if ($this.hasClass('is-active')) {
      $this.removeClass('is-active');
    } else {
      $this.addClass('is-active');
    }

    if (isDummyLink) {
      e.preventDefault();
    }
  });

  // tree
  var uiTree = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.ui-tree').each(function () {
        uiTree.fillUpdate($(this));
      });
    },
    fillUpdate: function ($wrap) {
      var $doc = $wrap.find('.ui-tree__doc');
      var $item = $wrap.find('.ui-tree__item.is-active');

      if (!$item.length) {
        return;
      }

      var $block = $item.find('.ui-tree__block');
      var $fill = $doc.find('.ui-tree__fill');

      if (!$fill.length) {
        $fill = $('<div class="ui-tree__fill"></div>');
        $doc.append($fill);
      }

      $fill.css({
        top: $item.offset().top - $doc.offset().top,
        height: $block.outerHeight(),
      });
    },
  };
  $doc.on('click.uiTree', '.ui-tree__link:not(.js-no-script)', function (e) {
    var $this = $(this);
    var $wrap = $this.closest('.ui-tree');
    var $item = $this.closest('.ui-tree__item');
    var $block = $this.closest('.ui-tree__block');
    var $items = $wrap.find('.ui-tree__item').not($item);
    var $contents = $('.ui-tree-contents');
    var isDummyLink = $this.is('a') && !($this.attr('href') && $this.attr('href').length);

    if (!$item.hasClass('is-active')) {
      $items.removeClass('is-active');
      $item.addClass('is-active');
    }

    if (!$contents.attr('tabindex')) {
      $contents.attr('tabindex', '0');
    }

    if ($block.hasClass('ui-tree__block--directory')) {
      if ($item.hasClass('is-opened')) {
        $item.removeClass('is-opened');
      } else {
        $item.addClass('is-opened');
      }
    } else {
      $contents.focus();
    }

    uiTree.fillUpdate($wrap);

    if (isDummyLink) {
      e.preventDefault();
    }
  });

  // nav tab
  $doc.on('click.uiNavTab', '.js-nav-tab .nav-tab__link:not(.js-no-script)', function (e) {
    var $this = $(this);
    var $wrap = $this.closest('.js-nav-tab');
    var $item = $this.closest('.nav-tab__item');
    var $items = $wrap.find('.nav-tab__item').not($item);
    var isDummyLink = $this.is('a') && !($this.attr('href') && $this.attr('href').length);

    if (!$item.hasClass('is-active')) {
      $items.removeClass('is-active');
      $item.addClass('is-active');
    }

    if (isDummyLink) {
      e.preventDefault();
    }
  });

  // prevent default
  $doc.on('click.uiPreventDefault', '.js-prevent-default', function (e) {
    e.preventDefault();
  });

  // situation management tab
  $doc.on('uiTabPanelChange.uiSituationManagementTab', '.js-situation-management-tab', function () {
    var $activePanel = $(this).find('[data-tab].js-tabpanel-opened');
    var activeName = $activePanel.attr('data-tab');

    $('.js-situation-management-menu-1, .js-situation-management-menu-2').css('display', 'none');

    if (activeName.match(/situationManagement2\-[345]/)) {
      $('.js-situation-management-menu-2').css('display', 'block');
    } else {
      $('.js-situation-management-menu-1').css('display', 'block');
    }
  });

  // tab panel next, prev
  $doc
    .on('click.uiJSTabPanel', '.js-ui-tab-panel-next', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-tab-panel');

      $wrap.uiTabPanel('next');

      e.preventDefault();
    })
    .on('click.uiJSTabPanel', '.js-ui-tab-panel-prev', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-tab-panel');

      $wrap.uiTabPanel('prev');

      e.preventDefault();
    });

  // dropdown
  $doc.on('click.uiJSDropdown', '.js-ui-dropdown__closer', function () {
    var $this = $(this);
    var $wrap = $this.closest('.js-ui-dropdown');

    $wrap.uiDropDown('close');
  });

  // input number up/down
  var inputNumber = {
    update: function ($wrap, sum) {
      var $input = $wrap.find('.ui-input');
      var val = $input.val();
      var num = 0;

      if (val && val.length && val.match(/\d/g)) {
        num = Number(val.replace(/\D/g, ''));
        if (val.match(/^-/)) {
          num = -num;
        }
      }

      $input.val(num + sum);
    },
    getSum: function ($button) {
      var data = $button.attr('data-sum');
      if (data && data.length && data.match(/\d/g)) {
        data = Number(data.replace(/\D/g, ''));
      } else {
        data = 1;
      }
      return data;
    },
  };
  $doc
    .on('click.uiInputUpDown', '.ui-input-block--number .ui-input-block__up-button', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-block--number');
      var sum = inputNumber.getSum($this);

      inputNumber.update($wrap, sum);
    })
    .on('click.uiInputUpDown', '.ui-input-block--number .ui-input-block__down-button', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-block--number');
      var sum = inputNumber.getSum($this);

      inputNumber.update($wrap, -sum);
    });

  // auto search
  $doc
    .on('keyup.uiAutoSearch', '.js-auto-search', function (e) {
      var $this = $(this);
      var $input = $this.find('.js-auto-search__input');
      var $links = $this.find('.js-auto-search__link');
      var keyCode = e.keyCode;
      var isUp = keyCode === 38;
      var isDown = keyCode === 40;
      var index = $links.index($links.filter(':focus'));
      var length = $links.length;

      if (isUp || isDown) {
        if (isUp && index >= 0) {
          index--;
        } else if (isDown) {
          index++;
          if (index >= length) {
            index = length - 1;
          }
        }

        if (index < 0) {
          $input.focus();
        } else {
          $links.eq(index).focus();
        }
      }
    })
    .on('keydown.uiAutoSearch', '.js-auto-search', function (e) {
      var keyCode = e.keyCode;
      if (keyCode === 38 || keyCode === 40) {
        e.preventDefault();
      }
    })
    .on('click.uiAutoSearch', '.js-auto-search__link', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-auto-search');
      var $input = $wrap.find('.js-auto-search__input');
      var value = $this.attr('data-value');

      $input.val(value).focus().trigger('keydown').trigger('keypress').trigger('keyup');
    });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    moment.locale('ko');

    if (userAgentCheck.isIos) {
      $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no');
      $html.addClass('is-ios-os');
    }

    if (userAgentCheck.isAndroid) {
      $html.addClass('is-android-os');
    }

    $html.addClass('is-ready');

    scrollbarsWidth.set();
    uiJSCommon();
    headerScroll();

    // css set
    /*
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-top-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-bottom-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '</style>'
      );
    }
    */

    // resize
    uiJSResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      var $html = $('html');
      $html.addClass('is-load');
      uiJSResize();
      windowPopupResize();
    })
    .on('scroll.uiJS', function () {
      fixBarScroll();
      headerScroll();
    })
    .on('resize.uiJS', function () {
      uiJSResize();
      fixBarScroll();
      headerScroll();
    })
    .on('orientationchange', function () {
      uiJSResize();
      fixBarScroll();
      headerScroll();
    });
})(jQuery);
