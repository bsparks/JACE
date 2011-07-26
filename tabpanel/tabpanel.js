/*
 * UNI Tabpanel @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function ($, undefined) {
    $.widget("uni.tabpanel", {
        
        // Options.
        options: {
            sample: "Hello"
        },
        
        // Set up the widget. This gets run once,
        // immediately after instantiation.
        _create: function () {
            console.log("_create: ", this);
        },
        
        // This gets run every time.
        _init: function () {
            console.log("_init: ", arguments);
        },
        
        test: function () {
            console.log("test");
        }
    });
})(jQuery);