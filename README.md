# angular-lazy-load-driective

类似于jquery的lazy-load, 使用使用angular.js的项目，单独封装成指令方便使用


说明：

* yxj-image-container 指令用于图片列表容器元素
* yxj-image-preload 指令用于img元素


使用:

```
  <div ng-controller="myCtrl" class="list yxj-image-container">
    <div class="item" ng-repeat="src in images">
      <img class="yxj-image-preload" ng-src="{{src}}" alt="">
    </div>
  </div>

```
