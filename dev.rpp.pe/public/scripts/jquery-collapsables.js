/*!
 * jquery-collapsables v1.0
 * Copyright 2013, Juan-Pablo Scaletti (@jpscaletti)
 * MIT License
**/
(function($) {

function isTarget(test, target) {
    return test === target || !!$(target).find(test).length;
}

function isTouch() {
    return $('html').hasClass('touch');
}

function fireOn($el) {
    if (isTouch()) {
        return 'click';
    }
    return $el.attr('data-event') || 'click';
}


var Collapse = function(el, opts) {
    var self = this;
    var $el = this.$el = $(el);
    opts = opts || {};

    this.$target = $(opts.target || $el.attr('data-collapse'));
    this.textOpen = opts.textOpen || $el.attr('data-text-open');
    this.textClose = opts.textClose || $el.attr('data-text-close');
    this.classOpen = opts.classOpen || $el.attr('data-class-open') || 'active';
    this.timeout = opts.timeout || 150;

    var tclose = null;

    function setupHover() {
        var onMouseOver = function(e) {
            clearTimeout(tclose);
            self.show();
        };

        var onMouseOut = function(e) {
            var toTarget = isTarget(e.toElement, self.$target[0]);
            var toEl = isTarget(e.toElement, self.$el[0]);
            if (!(toTarget || toEl)) {
                tclose = setTimeout(function(){
                    self.hide();
                }, self.timeout);
            }
        };

        $el.hover(onMouseOver, onMouseOut);
        self.$target.hover(onMouseOver, onMouseOut);

        $el.on('click touchStart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    function setupClick() {
        $el.on('click touchStart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.toggle();
            return false;
        });
    }

    if (isTouch()){
        self.event = 'click';
    } else {
        self.event = opts.event || fireOn($el)
    }
    self.event === 'hover' ? setupHover() : setupClick();
};


Collapse.prototype = {
    constructor: Collapse,
    speed: 400,
    easing: 'easeOutExpo',

    show: function() {
        if (this.$target.is(':visible')) {
            return;
        }
        this.$el.trigger('collapse.before_show');
        this.$el.addClass(this.classOpen);
        var self = this;
        if (self.textOpen) {
            self.$el.find('a').text(self.textOpen);
        }
        this.$target.stop(true, true)
            .slideDown({
                duration: this.speed,
                easing: this.easing,
                complete: function() {
                    self.$target.addClass(self.classOpen);
                    self.$el.trigger('collapse.show');
                }
            });
    },

    hide: function() {
        if (!this.$target.is(':visible')) {
            return;
        }
        var self = this;
        this.$el.removeClass(this.classOpen);
        if (self.textClose) {
            self.$el.find('a').text(self.textClose);
        }
        this.$target.stop(true, true)
            .slideUp({
                duration: this.speed,
                easing: this.easing,
                complete: function() {
                    self.$target.removeClass(self.classOpen);
                    self.$el.trigger('collapse.hide');
                }
            });
    },

    toggle: function() {
        if (this.$target.is(':visible')) {
            this.hide();
        } else {
            this.show();
        }
    }
};

$.fn.collapse = function(opts){
    opts = opts || {};
    return this.each(function() {
        var $this = $(this);
        var data = $this.data('collapsable');
        if (!data) {
            $this.data('collapsable', new Collapse(this, opts));
        }
    });
};

$.fn.collapse.Constructor = Collapse;

}(window.jQuery));
