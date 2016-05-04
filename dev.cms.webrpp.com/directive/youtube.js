//Render video youtube
app.directive('youtube', function($sce, $mdDialog) {
  return {
    restrict: 'EA',
    scope: { code:'@', autoplay:'@', timestamp:'@', id:'@' },
    replace: true,
    template: '<div style="margin:0 auto; display:inline-block;"><iframe width="560" height="315" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope, element, attrs) {
        //console.log(scope, element, attrs);
        //Video Youtube
        attrs.$observe('code',function(val){
            if (val) {
                var _id = (attrs.id)?attrs.id:'',
                _timestamp = (attrs.timestamp)?'&start=' + attrs.timestamp:'',
                _autoplay = (attrs.autoplay)?'&autoplay=' + (attrs.autoplay):'';
                scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' +  _id + '?rel=0' + _timestamp + _autoplay);
            }else{
                scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/undefined');
            }
        });
    }
  };
});
