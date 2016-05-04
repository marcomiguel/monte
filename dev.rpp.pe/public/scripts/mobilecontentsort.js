(function($){


var BREAKPOINT = 768;
var $win = $(window);
var $col1 = $('#col-1');
var $col2 = $('#col-2');

function twoToOneColumn() {
    if ($col2.children().length === 0) return;

    var $col1Items = $col1.find('article, .pub');
    var $col2Items = $col2.find('article, .pub');
    var numItemsToInclude = $col2Items.length;

    for (var i=0; i < numItemsToInclude; i++){
        var $col2item = $col2Items.eq(i);
        var $col1item = $col1Items.eq(i);
        if ($col1item.length){
            $col2item.insertAfter($col1item);
        } else {
            $col1.append($col2item);
        }
    }
}


function oneToTWoColumns(){
    if ($col2.children().length) return;

    $col1.find('article, .pub').filter(':odd').appendTo($col2);
}


function resortContents(){
    if ($win.width() < BREAKPOINT){
        twoToOneColumn();
    } else {
        oneToTWoColumns();
    }
}

$win.on('resize', resortContents);
resortContents()


}(window.jQuery));