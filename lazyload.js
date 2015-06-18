
myApp.directive('yxjImageContainer', function($compile){
  return {
    restrict: 'AC',
    controller: ['$scope', '$element', function($scope,$element){
      $element.data('yxjImageContainer', $element);
    }]
  };
});

myApp.directive('yxjImagePreload', function($compile,$window){
  return {
      restrict: 'AC',
      replace: true,
      template: '<div><img></div>',
      scope: {
        ngSrc: '@'
      },
      link: function(scope, element, attrs) {
        var container = element.inheritedData('yxjImageContainer'),
            loaded = false,
            offset = 20; //判断可以加载的偏移量
        if(!container) {
          //container = angular.element(attrs.mfImageContainere || $window);
        }
        attrs.mfImageLoaded = false;
        element.addClass('loading');
        element[0].style['minHeight'] = '50px';

        //获取容器的滚动距离
        var _getContainerScrollTop = function() {
          if(container.scrollTop && container.scrollTop()) {
            return container.scrollTop();
          }
          var first = container[0];
          if (first && first.pageYOffset !== undefined) {
            return first.pageYOffset;
          }
          else if (first && first.scrollTop) {
            return first.scrollTop;
          }
          return document.documentElement.scrollTop || 0;
        };
        //获取容器高度
        var _getContainerInnerHeight = function() {
          if(container.innerHeight) {
            return container.innerHeight;
          }

          var first = container[0];
          if(first && first.innerHeight) {
            return first.innerHeight;
          } else if(first && first.clientHeight) {
            return first.clientHeight;
          }
          return document.documentElement.clientHeight || 0;
        };

        //获取元素top
        var _getElementOffset = function() {
          if(element.offset){
            return element.offset().top;
          }
          var box = element[0].getBoundingClientRect();
          return box.top + _getContainerScrollTop() - document.documentElement.clientTop;
        };
        var _getElementOffsetContainer = function() {
          if(element.offset) {
            return element.offset().top - container.offset().top;
          }
          return element[0].getBoundingClientRect().top - container[0].getBoundingClientRect().top;
        };

        //加载图片
        var _renderImage = function() {
          loaded = true;
          var imageDom = angular.element(element[0].querySelector('img'));
          imageDom[0].src = attrs['ngSrc'];

          imageDom.on('load', function() {
            element.removeClass('loading');
            imageDom.css('visibility', 'visible');
          }).on('error', function() {
            element.addClass('loading');
            imageDom.css('visibility', 'hidden');
          });
          container && container.off('scroll', _onViewChange);
        };

        var _onViewChange = function(bool) {
          var height = _getContainerInnerHeight(),
              scroll = _getContainerScrollTop(),
              eleOffset = container[0] === $window ? _getElementOffset() : _getElementOffsetContainer(),
              windownBottom = container[0] === $window ? height + scroll: height;

          var remaining = eleOffset - windownBottom,
              shouldLoad = remaining <= offset;
          if(shouldLoad && !loaded) {
            _renderImage();
          }
        };

        if(!container) {
          _renderImage();
        }else {
          //bind scroll event
          container.on('scroll', _onViewChange);
          //手动触发一次滚动
          container[0].scrollTop = 1;
        }
      }
    };
});