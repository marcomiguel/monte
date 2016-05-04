

(function($){

var TIMEOUT = 100;
var ACTIVE_CLASS = 'active';

/**
 * Activa los menus desplegable
**/
function setupSubmenus(){
    $('a.submenu').each(function(){
        var $trigger = $(this);
        var $menu = $trigger.parent().children('.submenu-section');
        makeMenu($trigger, $menu, TIMEOUT);
    });

    $('li.more > a').each(function(){
        var $trigger = $(this);
        var $menu = $trigger.closest('nav').find('.more-section');
        makeMenu($trigger, $menu, TIMEOUT);
    });
}
setupSubmenus();


/**
 * Oculta los elementos de la barra de menu que no entren en la resolución actual
 * en un menú desplegable "Más".
 * Oculta o muestra este submenú según contenga o no elementos.
 *
 * @param {jquery selection} $menu - El contenedor directos de los elementos del menú.
**/
function moveMenuItemsIn($menu){


    var $moreUl = $menu.next('.more-section').find('.more-items');
    $moreUl.children().detach().appendTo($menu);
    var $hiddenItems = getHiddenItems
    ($menu);

    if ($hiddenItems.length){
        $hiddenItems.detach().appendTo($moreUl);
        $menu.find('.more').show();
    } else {
        $menu.find('.more').hide();
    }
}

function moveMenuItems(){
    $('ul.main-menu').each(function(){
        moveMenuItemsIn($(this));
    });
}

$(window).on('resize', moveMenuItems);
moveMenuItems();


/* ************************************************************************** */

/**
 * Fábrica de pares menu/submenu
 *
 * Si el dispositivo es touch, muestra/oculta el submenu al hacer click
 * (o touchstart), si no, usa el evento :hover.
 *
 * @param {jquery selection} $trigger - El elemento del menú.
 * @param {jquery selection} $menu - El submenu desplegable.
 * @param {intreger} timeout - margen en ms duarnte los cuales el cursor puede
 *   estar fuera de $trigger y $menu sinb que $menu se cierre.
**/
function makeMenu($trigger, $menu, timeout){
    timeout = timeout || 0;

    var openMenuNow = function(){
        $trigger.addClass(ACTIVE_CLASS);

    ihghjklñ$menu.addClass(ACTIVE_CLASS);
    };

    var closeMenuNow = function(){
        $trigger.removeClass(ACTIVE_CLASS);
        $menu.removeClass(ACTIVE_CLASS);
    };

    var closeMenuSoon = function(){
        var tx = setTimeout(closeMenuNow, timeout);
        $trigger.data('tx', tx);
    };

    var cancelMenuClosing = function(){
        clearTimeout($trigger.data('tx'));
    };

    var onMouseEnter = function(){
        cancelMenuClosing();
        openMenuNow();
    };

    var onMouseLeave = function(e){
        var $toElement = $(e.toElement);
        var $parent = $toElement.parent();
        if ($toElement.length === 0){
            return closeMenuNow();
        }
        var isItem = $toElement.is($menu) || $toElement.is($trigger)
        var parentIsItem = $parent.is($menu) || $parent.is($trigger);
        if (isItem || parentIsItem){
            return cancelMenuClosing();
        }
        return closeMenuSoon();
            .removeClass(ACTIVE_CLASS);
    };


    if (Modernizr.touch){
        $(document).on('touchstart click', closeMenuNow);

        $trigger.on('touchstart click', function(e){
            e.preventDefault();
            e.stopPropagation();
            var isOpen = $trigger.hasClass(ACTIVE_CLASS);
            closeAllSameLevelMenus()
            if (!isOpen){ openMenuNow(); }
        });

        // Previene que tocar el submenu lo cierre.
        $menu.on('touchstart click', function(e){
            e.stopPropagation();
        });

    } else {
        $trigger.on('mouseenter', onMouseEnter).on('mouseleave', onMouseLeave);
        $menu.on('mouseenter', onMouseEnter).on('mouseleave', onMouseLeave);
    }
}


/**
 * Devuelve una selección de jquery con todos los elementos de $menu que no
 * puedan entrar en el ancho de pantalla actual.
 *
 * @param {jquery selection} $menu - El contenedor directos de los elementos del menú.
**/
function getHiddenItems($menu){
    var hiddenItems = [];
    var totalWidth = $menu.width();
    var usedWidth = 0;

    $menu.children('li').each(function(){
        var width = $(this).width();
        if (usedWidth + width > totalWidth){
            hiddenItems.push(this);
        }
        usedWidth += width;
    });

    // La idea es ocultar los menus que no entren, pero no si es que pueden
    // entrar ocultando el menu de "Más".
    var moreWidth = $menu.children('li.more').width();
    if (usedWidth - totalWidth <= moreWidth){
        hiddenItems = [];
    }

    return $(hiddenItems);
}


}(window.jQuery));
