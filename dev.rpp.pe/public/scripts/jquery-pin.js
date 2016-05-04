/*!
 * jQuery-Pin
 * https://github.com/webpop/jquery.pin
 *
 * Copyright (c) 2013, Mathias Biilmann All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/
(function($) {

$.fn.pin = function(options) {
    var scrollY = 0,
        elements = [],
        disabled = false,
        $window = $(window);

    options = options || {};

    var recalculateLimits = function() {
        for (var i = 0, len = elements.length; i < len; i++) {
            var $this = elements[i];

            if (options.minWidth && $window.width() <= options.minWidth) {
                if ($this.parent().is(".pin-wrapper")) {
                    $this.unwrap();
                }
                $this.css({
                    width: "",
                    left: "",
                    top: "",
                    position: ""
                });
                if (options.activeClass) {
                    $this.removeClass(options.activeClass);
                }
                disabled = true;
                continue;
            } else {
                disabled = false;
            }

            var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
            var offset = $this.offset();
            var containerOffset = $container.offset();
            var parentOffset = $this.offsetParent().offset();

            if (!$this.parent().is(".pin-wrapper")) {
                $this.wrap("<div class='pin-wrapper'>");
            }

            var pad = $.extend({
                top: 0,
                bottom: 0
            }, options.padding || {});

            $this.data("pin", {
                pad: pad,
                from: (options.containerSelector ? containerOffset.top : offset.top) - pad.top,
                to: containerOffset.top + $container.height() - $this.outerHeight() - pad.bottom,
                end: containerOffset.top + $container.height(),
                parentTop: parentOffset.top
            });

            $this.css({
                width: $this.outerWidth()
            });
            $this.parent().css("height", $this.outerHeight());
        }
    };

    var onScroll = function() {
        if (disabled) return;

        scrollY = $window.scrollTop();

        var elmts = [];
        for (var i = 0, len = elements.length; i < len; i++) {
            var $this = $(elements[i]),
                data = $this.data("pin");

            if (!data) { // Removed element
                continue;
            }

            elmts.push($this);

            var from = data.from - data.pad.bottom,
                to = data.to - data.pad.top;

            if (from + $this.outerHeight() > data.end) {
                $this.css('position', '');
                continue;
            }

            if (from < scrollY && to > scrollY) {
                !($this.css("position") == "fixed") && $this.css({
                    left: $this.offset().left,
                    top: data.pad.top
                }).css("position", "fixed");
                if (options.activeClass) {
                    $this.addClass(options.activeClass);
                }
            } else if (scrollY >= to) {
                $this.css({
                    left: "",
                    top: to - data.parentTop + data.pad.top
                }).css("position", "absolute");
                if (options.activeClass) {
                    $this.addClass(options.activeClass);
                }
            } else {
                $this.css({
                    position: "",
                    top: "",
                    left: ""
                });
                if (options.activeClass) {
                    $this.removeClass(options.activeClass);
                }
            }
        }
        elements = elmts;
    };

    var update = function() {
        recalculateLimits();
        onScroll();
    };

    this.each(function() {
        var $this = $(this),
            data = $(this).data('pin') || {};

        if (data && data.update) {
            return;
        }
        elements.push($this);
        $("img", this).one("load", recalculateLimits);
        data.update = update;
        $(this).data('pin', data);
    });

    $window.scroll(onScroll);
    $window.resize(function() {
        update();
    });
    recalculateLimits();

    $window.load(update);

    return this;
};

})(jQuery);
