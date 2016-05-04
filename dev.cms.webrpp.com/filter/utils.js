//Filter Strip HTML
app.filter('htmlAddBlock', function($sce) {
    //var regex = /(<([^>]+)>)/igm, Todos
    var regex = /<(?!\s*\/?(strong|em|b|i|a)\b)[^>]+>/igm; //If strong|em|b|i|a
    var regexLH = /\n/igm;
    return function(text) {
        var text = text || '';
        text = text.replace(regex, '');
        text = text.replace(regexLH, '<br />' );
        return $sce.trustAsHtml(text);
    };
});

app.filter('htmlUnSafe', function($sce) {
    return function(text) {
        var text = text || '';
        return $sce.trustAsHtml(text);
    };
});

app.filter('htmlToPlaintext', function() {
    return function(text) {
        var text = text;
        //return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        return text?angular.element(String(text)).text().trim():'';
    };
});

app.filter('htmlEmbed', function($sce) {
    return function(text) {
        var text = text || '';
        return $sce.trustAsHtml(text);
    };
});

app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

app.filter('eventdate', function($filter) {
  return function(input) {
    return $filter('date')(new Date(input).getTime(), "dd/MM/yyyy hh:mm a");
  };
});

app.filter('urlResource',['$sce',function($sce){
    return function(url){
        return $sce.trustAsResourceUrl(url);        
    };
}]);
