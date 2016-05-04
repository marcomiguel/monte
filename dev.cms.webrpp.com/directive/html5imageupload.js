

//HTML5 UPLOAD IMAGE
app.directive('html5uploadimage', function($timeout) {
  return {
    restrict: 'EA',
    scope: {
        widthImage:'@',
        heightImage:'@',
        resize:'@',
        url:'@',
        ajax:'@',
        originalsize:'@',
        image:'@',
        editstart:'@',
        reset:'='
    },
    //replace: true,
    //template: '<div class="dropzone" style="width:{{width}};height:{{height}}"><input type="file" name="thumb" /></div>',
    link: function (scope, element, attrs) {
        var objInit = {
            width : attrs.widthImage,
            height : attrs.heightImage,
            //editstart : attrs.editstart,
            //resize : true,
            ajax : attrs.ajax,
            //url : CMSDATA.URLELEMENTS,
            //data : { },
            onAfterProcessImage: function() {
                var thumb_values_edit = angular.element('input[name="thumb_values_edit"]'),
                thumb_values = angular.element('input[name="thumb_values"]');
                thumb_values_edit.data('json', thumb_values.data('json'));
                var json = angular.fromJson(thumb_values.data('json'));
                scope.$emit('objimagen', json);
        	},
        	onAfterCancel: function() {
                var thumb_values_edit = angular.element('input[name="thumb_values_edit"]');
                thumb_values_edit.data('json', '');
                scope.$emit('objimagen', undefined);
        	}
        };
        var htmlDirective = '<div class="dropzone"><input type="file" name="thumb" /></div>';
        //Init
        var elm = angular.element(element);
        elm.html('').html(htmlDirective);
        elm.children('.dropzone').html5imageupload(objInit);
        //Observe
        scope.$watch('reset', function(newValue, oldValue) {
            if(newValue != oldValue){
                objInit.width = attrs.widthImage;
                objInit.height = attrs.heightImage;
                objInit.ajax = attrs.ajax;
                if(attrs.image != '' || attrs.image != ' '){
                    //objInit.originalsize = attrs.originalsize;
                    objInit.image = attrs.image;
                    //objInit.editstart = attrs.editstart;
                }else{
                    delete objInit['originalsize'];
                    delete objInit['image'];
                    //delete objInit['editstart'];
                }
                elm.html('').html(htmlDirective);
                elm.children('.dropzone').html5imageupload(objInit);
            }
        });
    }
  };
});
