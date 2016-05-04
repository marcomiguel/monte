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
        console.log(text, 'text EMBED');
        return $sce.trustAsHtml(text);
    };
});
