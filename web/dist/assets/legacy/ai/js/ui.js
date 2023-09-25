var userAgent = navigator.userAgent;
var userAgentCheck = {
  ieMode: document.documentMode,
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
      //console.log(e);
    }
  }
})();

// scroll
scrollYOption = {
  scrollInertia: 200,
  scrollbarPosition: 'outside',
};
function scrollYInit($target) {
  $target.each(function () {
    var $this = $(this);
    $this.mCustomScrollbar(scrollYOption);
  });
}
function scrollXInit($target) {
  $target.each(function () {
    var $this = $(this);
    $this.mCustomScrollbar({
      axis: 'x',
      scrollInertia: 200,
      mouseWheel: {
        preventDefault: true,
      },
    });
  });
}
function scrollXYInit($target) {
  $target.each(function () {
    var $this = $(this);
    $this.mCustomScrollbar({
      axis: 'yx',
      scrollInertia: 200,
    });
  });
}
function scrollUpdate($target) {
  $target.mCustomScrollbar('update');
}

// grid size setting
function gridSize() {
  $('.con-box').each(function () {
    var $grid = $(this).closest('.grid-con');
    var $title = $grid.find('.con-top');
    if (!$grid.hasClass('hauto')) {
      if ($title.hasClass('has-thead')) {
        var theadH = $title.find('.con-tbl-list').outerHeight(true);
        if ($grid.hasClass('tab-wrap')) {
          theadH = $title.find('.con-tbl-list.is-active').outerHeight(true);
        }
        $title.css('padding-bottom', theadH + 'px');
      }
      var titleH = $title.outerHeight(true);
      $(this).css({
        top: titleH + 'px',
        width: Math.floor($grid.width()) + 'px',
        height: $grid.height() - titleH + 'px',
      });
    }
  });
}

// input
function inputUpdate($input) {
  var $wrap = $input.parent();

  if ($input.is(':disabled')) {
    $wrap.addClass('is-disabled');
  }
  if ($input.is('[readonly]')) {
    $wrap.addClass('is-readonly');
  }
}
function inputInit() {
  $('.item-input input').each(function () {
    var $this = $(this);
    inputUpdate($this);
  });
}

// datepicker
function datepickerInit() {
  $('.item-input-date input').datepicker({
    showMonthAfterYear: true,
    monthNames: ['.01', '.02', '.03', '.04', '.05', '.06', '.07', '.08', '.09', '.10', '.11', '.12'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    dateFormat: 'yy.mm.dd',
  });
}

//select
function selectUpdate($select) {
  var $wrap = $select.parent();
  var val = $select.get(0).value;
  var className = 'is-selected';
  var isClass = $wrap.hasClass(className);

  if (val === '-1' && isClass) {
    $wrap.removeClass(className);
  } else if (val !== '-1' && !isClass) {
    $wrap.addClass(className);
  }
  if ($select.is(':disabled')) {
    $wrap.addClass('is-disabled');
  }
}
function selectInit() {
  $('.item-select select').each(function () {
    var $this = $(this);
    selectUpdate($this);
  });
}

// tab
function tabInit() {
  var $dataTab = $('[data-tab]');
  var tabOnContents = [];
  $dataTab.each(function () {
    if ($(this).parent().is('.is-active')) {
      tabOnContents.push($(this).data('tab'));
    }
  });
  $.each(tabOnContents, function (key, value) {
    var $content = $('[data-tab-content=' + value + ']');
    $content.addClass('is-active');
  });
  $dataTab.on('click', function () {
    var tabGroup = [];
    var data = $(this).data('tab');
    $(this)
      .closest('.tab-menu, .js-tab-menu')
      .find('[data-tab]')
      .each(function () {
        if ($.inArray($(this).data('tab'), tabGroup) == -1) {
          tabGroup.push($(this).data('tab'));
        }
        $(this).parent().removeClass('is-active');
      });
    $.each(tabGroup, function (key, value) {
      var $content = $('[data-tab-content=' + value + ']');
      $content.removeClass('is-active');
    });
    var $content = $('[data-tab-content=' + data + ']');
    $content.addClass('is-active');
    $(this).parent().addClass('is-active');

    gridSize();

    if ($(this).closest('.tab-wrap, .js-tab-menu').hasClass('grid-con')) {
      if ($(this).closest('.grid-con').find('.con-box').hasClass('scroll-y')) {
        var $scroll = $(this).closest('.grid-con').find('.con-box.scroll-y');
        $scroll.mCustomScrollbar('destroy');
        scrollYInit($scroll);
      }
    }
  });
}

// accordion
function accordionInit() {
  var $dataAccordion = $('[data-accordion]');
  $dataAccordion.each(function () {
    var $this = $(this);
    var data = $this.data('accordion');
    var open = $this.data('initial-open');
    var $content = $('[data-accordion-content=' + data + ']');
    if (open) {
      $this.addClass('is-active');
      $content.addClass('is-active').css('height', 'auto');
    }
    $this.on('click', function () {
      var dataBasicH = $content.data('basic-height');
      var basicH = dataBasicH ? dataBasicH : 0;
      if ($content.outerHeight(true) == basicH) {
        $content.css('height', 'auto');
        var contentH = $content.height();
        $this.addClass('is-active');
        $content
          .addClass('is-active')
          .css('height', basicH + 'px')
          .animate(
            {
              height: contentH + 'px',
            },
            200,
            function () {
              gridSize();
            }
          );
      } else {
        $this.removeClass('is-active');
        $content.removeClass('is-active').animate(
          {
            height: basicH + 'px',
          },
          200,
          function () {
            gridSize();
          }
        );
      }
    });
  });
}

// bar chart
function chartBar() {
  $('.chart-bar-group').each(function () {
    var $bar = $(this).find('.bar');
    var per = $bar.data('gauge');
    $bar.css('width', per + '%');
  });
}

// vertical bar chart
function vChartBar() {
  $('.chart-vbar-group').each(function () {
    var $bar = $(this).find('.bar');
    var per = $bar.data('gauge');
    $bar.css('height', per + '%');
  });
}

// rate chart
function chartRate() {
  $('.chart-rate-group').each(function () {
    var $bar = $(this).find('.bar');
    var rate = $bar.data('rate');
    if (rate < 0) {
      rate = Math.abs(rate);
      $(this).addClass('opposite');
    }
    $bar.css('width', rate + '%');
  });
}

// keyword circle chart
function chartCircle() {
  var keywordRate = [];
  var $keywordBox = $('.keyword-box');
  var $keyword = $keywordBox.find('.keyword');
  $keywordBox.addClass('layout-num' + $keyword.length);
  $keyword.each(function () {
    var rate = $(this).data('keyword-rate');
    keywordRate.push(rate);
  });
  var max = keywordRate[0];
  for (i = 0; i < keywordRate.length; i++) {
    if (max < keywordRate[i]) {
      max = keywordRate[i];
    }
  }
  $keyword.each(function () {
    var $this = $(this);
    var rate = $this.data('keyword-rate');
    var rank = $this.data('keyword-rank');
    var calc = rate / max;
    var mincalc;
    setTimeout(function () {
      mincalc = 0.1;
      $this.addClass('on');
      if (calc > mincalc) {
        $this.find('.circle').css({
          transform: 'translate(-50%, -50%) scale(' + calc + ')',
          '-ms-transform': 'translate(-50%, -50%) scale(' + calc + ')',
        });
      } else {
        $this.find('.circle').css({
          transform: 'translate(-50%, -50%) scale(' + mincalc + ')',
          '-ms-transform': 'translate(-50%, -50%) scale(' + mincalc + ')',
        });
      }
    }, rank * 200);
    mincalc = 0.7;
    if (calc > mincalc) {
      $this.find('.text').css('font-size', calc + 'rem');
    } else {
      $this.find('.text').css('font-size', '0.7rem');
    }
  });
}

function alertListHeight() {
  // 210218 추가
  var $sectionAside = $('.section-aside');
  var $alertList = $sectionAside.find('.alert-type-box.scroll-y');
  if ($alertList.length) {
    var excludedItems = ['.list-search-box', '.tab-menu-box', '.list-top-info', '.pagination-box'];
    var excludedItemsHeight = 0;
    for (var i = 0; i < excludedItems.length; i++) {
      var $target = $sectionAside.find(excludedItems[i]);
      var outerH = $target.outerHeight(true);
      if (outerH && $target.css('display') != 'none') {
        excludedItemsHeight += outerH;
      }
    }
    var calcHeight = $sectionAside.height() - excludedItemsHeight;
    $alertList.css({
      'max-height': calcHeight + 'px',
    });
    scrollUpdate($alertList);
  }
}

function jsCommon() {
  tabInit();
  gridSize();
  selectInit();
  inputInit();
  datepickerInit();
  accordionInit();
  alertListHeight(); // 210218 추가
  scrollYInit($('.scroll-y'));
  scrollXYInit($('.scroll-xy'));
  scrollXInit($('.scroll-x'));
  uiJSTree.init();
}

(function ($) {
  // var common
  var $win = $(window);
  var $doc = $(document);

  $(document).on('click', '[href="#"]', function () {
    return false;
  });

  // input
  $doc
    .on('focus.uiInput', '.item-input input', function () {
      var $this = $(this);
      var $wrap = $this.parent();
      $wrap.addClass('is-focus');
    })
    .on('blur.uiInput', '.item-input input', function () {
      var $this = $(this);
      var $wrap = $this.parent();
      $wrap.removeClass('is-focus');
    });

  // select
  $doc
    .on('change.uiSelect', '.item-select select', function () {
      var $this = $(this);
      selectUpdate($this);
    })
    .on('focus.uiSelect', '.item-select select', function () {
      var $this = $(this);
      var $wrap = $this.parent();
      $wrap.addClass('is-focus');
    })
    .on('blur.uiSelect', '.item-select select', function () {
      var $this = $(this);
      var $wrap = $this.parent();
      $wrap.removeClass('is-focus');
    });

  // popup - new window
  $('.new-link').on('click', function () {
    var target = $(this).data('popup');
    var popW = $(this).data('popup-width');
    var popH = $(this).data('popup-height');
    var leftPosition = (screen.width - popW) / 2;
    var topPosition = (screen.height - popH) / 2;
    window.open(target + '.html', '_blank', 'left=' + leftPosition + ', top=' + topPosition + ', width=' + popW + ', height=' + popH + ', scrollbars=no,resizable=no');
  });

  function toggleHeight(btn, wrapper, detail, siblingsClose, docClose) {
    var thisClass = btn.split('.')[1];
    var $thisSortBox = $(btn).closest(wrapper);
    var $thisSortList;
    $thisSortBox.each(function () {
      $thisSortList = $(this).find(detail);
      if ($(this).hasClass('opened')) {
        $thisSortList.show();
      }
    });
    $(document).on('click', $(btn), function (e) {
      var $target = $(e.target);
      if (!$target.is(':disabled')) {
        if ($target.hasClass(thisClass) || $target.parents().hasClass(thisClass)) {
          $thisSortBox = $target.closest(wrapper);
          $thisSortList = $thisSortBox.find(detail);
          if ($thisSortBox.is('.opened')) {
            $thisSortBox.removeClass('opened');
            $thisSortList.slideUp(200);
          } else {
            if (siblingsClose) {
              $target.addClass('toggle-selected');
              $(wrapper).each(function () {
                $(this).removeClass('opened');
                $(this).find(detail).slideUp(200);
                if ($(this).find('.toggle-selected').length) {
                  $(this).addClass('opened');
                  $(this).find(detail).slideDown(200);
                  $(wrapper).find('.toggle-selected').removeClass('toggle-selected');
                }
              });
            }
          }
        }
      }
    });
    if (docClose) {
      $(document).on('click', function (e) {
        var $target = $(e.target);
        if (!$target.parents().is($thisSortBox)) {
          $thisSortBox.removeClass('opened');
          $thisSortBox.find(detail).slideUp(200);
        }
      });
    }
  }

  // slide
  var $profileSlide = $('.profile-slide');
  if ($profileSlide.length) {
    $profileSlide.on('init', function (event, slick) {
      $(this).append('<div class="slick-slider-count"><p class="slick-slider-count-item"><span class="current">1</span>/<span class="total">' + slick.slideCount + '</span></p></div>');
    });
    $profileSlide.slick({
      arrows: true,
      infinite: true,
    });
    $profileSlide.on('afterChange', function (event, slick, currentSlide, nextSlide) {
      $('.slick-slider-count .current').html(currentSlide + 1);
    });
  }
  if ($('.ai-slide').length) {
    $('.ai-slide').slick({
      dots: false,
      arrows: true,
      infinite: false,
    });
  }

  // tooltip
  $('.tooltip-item')
    .on('mouseenter', function () {
      var $this = $(this);
      var $tooltipWrap = $this.closest('.tooltip-wrap');
      var $tooltip = $this.siblings('.tooltip-box');
      var scrT = $win.scrollTop();
      $('.wrap').append($tooltip);
      $tooltip.removeClass('right bottom fit-top fit-side');
      $tooltip.css({
        display: 'block',
        top: '',
        right: '',
        bottom: '',
        left: '',
      });
      if ($doc.height() - $this.offset().top < $tooltip.outerHeight(true)) {
        $tooltip.addClass('bottom');
        $tooltip.css({
          bottom: $doc.height() - $this.offset().top - ($doc.height() - $win.height() - scrT),
        });
      } else {
        if ($tooltipWrap.hasClass('fit-top')) {
          $tooltip.addClass('fit-top').css({
            top: $this.offset().top - $tooltip.outerHeight(true) - scrT,
          });
        } else {
          $tooltip.css({
            top: $this.offset().top + $this.outerHeight() - scrT,
          });
        }
      }
      if ($win.width() - $this.offset().left < $tooltip.outerWidth(true)) {
        $tooltip.addClass('right');
        if ($tooltipWrap.hasClass('fit-side')) {
          $tooltip.addClass('fit-side').css({
            right: $win.width() - $this.offset().left,
          });
        } else {
          $tooltip.css({
            right: $win.width() - $this.offset().left - $this.width(),
          });
        }
      } else {
        if ($tooltipWrap.hasClass('fit-side')) {
          $tooltip.addClass('fit-side').css({
            left: $this.offset().left + $this.width(),
          });
        } else {
          $tooltip.css({
            left: $this.offset().left,
          });
        }
      }
    })
    .on('mouseleave', function () {
      var $this = $(this);
      var $tooltip = $('.wrap > .tooltip-box');
      $this.after($tooltip);
      $tooltip.css({
        display: 'none',
      });
    });

  var searchH;
  $('.btn-ico-search:not(.btn-ico-only)').on('click', function () {
    var $this = $(this);
    var $search = $this.closest('.contents').find('.search-box, .list-search-box');
    if ($search.length) {
      if (!$search.hasClass('opened')) {
        $search.show();
        searchH = $search.outerHeight(false);
        $search.hide();
        $this.removeClass('btn-point btn-ico-search').addClass('btn-point-white-2 btn-ico-cancel').text('상세 검색 닫기');
        $search.addClass('opened').slideDown(300);
      } else {
        $this.removeClass('btn-point-white-2 btn-ico-cancel').addClass('btn-point btn-ico-search').text('상세 검색');
        $search.removeClass('opened').slideUp(300);
      }
    }
    var $sectionAside = $('.section-aside');
    if ($(this).parents().is($sectionAside)) {
      var $alertTypeBox = $sectionAside.find('.alert-type-box.scroll-y');
      var currentMaxH = parseInt($alertTypeBox.css('max-height'));
      if ($search.hasClass('opened')) {
        $alertTypeBox.css('max-height', currentMaxH - searchH);
      } else {
        $alertTypeBox.css('max-height', currentMaxH + searchH);
      }
      setTimeout(function () {
        scrollUpdate($alertTypeBox);
      }, 300);
    }
  });

  // bookmark toggle
  $('.main-top-info .btn-ico-bookmark').on('click', function () {
    $(this).toggleClass('disabled');
  });

  // alert type toggle
  $('body').on('click', '.type-item-box', function () {
    if ($(this).is('button')) {
      $('.type-item-box').closest('.section-aside').find('.alert-type-item').removeClass('selected').find('input').prop('checked', false);
      var $box = $(this).parent('.alert-type-item');
      var $input = $box.find('input');
      $box.addClass('selected');
      if (!$input.is(':disabled')) {
        $input.prop('checked', true);
      }
    }
  });

  // grid pattern toggle height
  var $gridPattern = $('.grid-pattern');
  var $gridPatternList = $gridPattern.find('.pattern-item');
  var $gridPatternBtn = $gridPattern.find('.btn-more');
  var patternListMax = 7;
  if ($gridPatternList.length > patternListMax) {
    $gridPattern.addClass('is-more');
    $gridPatternBtn.text($gridPatternList.length - patternListMax);
  }
  $gridPatternBtn.on('click', function () {
    if (!$(this).is('.is-active')) {
      $(this).text('닫기');
    } else {
      $(this).text($gridPatternList.length - patternListMax);
    }
  });

  // alarm center
  $('.notice-group .btn-notice, .notice-group .btn-close').on('click', function () {
    var $wrap = $(this).closest('.notice-group');
    var $center = $wrap.find('.notice-center');
    if ($(this).is('.btn-notice')) {
      $wrap.addClass('opened');
    } else {
      $wrap.removeClass('opened');
    }
    if ($wrap.hasClass('opened')) {
      $center.fadeIn(200);
    } else {
      $center.fadeOut(200);
    }
  });
  $('.notice-list-box .btn-delete').on('click', function () {
    $(this).closest('.notice-list-item').remove();
  });

  // move pattern
  $('.grid-move-pattern .btn-select').on('click', function () {
    $('.grid-move-pattern .person-item').removeClass('is-selected');
    $(this).closest('.person-item').addClass('is-selected');
  });

  // tbl list selected
  $('.tbl-list.type-select').each(function () {
    var $radio = $(this).find('.item-radio.item-radio-single input:checked');
    if ($radio.length) {
      $radio.closest('tr').addClass('selected');
    }
  });
  $('.tbl-list.type-select .item-radio.item-radio-single input').on('change', function () {
    $(this).closest('tr').addClass('selected').siblings().removeClass('selected');
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
  window.uiJSTree = uiTree;

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

  // dom ready
  $(function () {
    if (userAgentCheck.ieMode) {
      $('html').addClass('is-ie ie-' + userAgentCheck.ieMode);
    }
    var $inputs = $('input, textarea');
    if ($inputs.length) {
      $inputs.placeholder();
    }

    jsCommon();
    toggleHeight('.btn-2depth', '.lnb-item', '.lnb-2depth', true);
    toggleHeight('.btn-dropdown', '.dropdown-group', '.dropdown-box', true, true);
  });

  // win load, scroll, resize
  $win
    .on('load', function () {
      chartBar();
      vChartBar();
      chartRate();
      chartCircle();
    })
    .on('scroll', function () {
      //
    })
    .on('resize', function () {
      gridSize();
      alertListHeight(); // 210218 추가
    });
})(jQuery);
