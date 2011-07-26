/*
 * UI Truncator
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function ($, undefined) {
    $.widget("ui.truncator", {
        
        /************************
         * Options.
         ************************/
        
        options: {
            selectors: {
                html: ".ui-truncator-html",
                block: ".ui-truncator-html-block",
                fade: ".ui-truncator-html-fade",
                toggle: ".ui-truncator-html-toggle",
                more: ".ui-truncator-html-more",
                less: ".ui-truncator-html-less",
                str: ".ui-truncator-str",
                yellow: ".ui-truncator-html-fade-yellow",
                blue: ".ui-truncator-html-fade-blue"
            },
            classes: {
                base: "ui-truncator",
                html: "ui-truncator-html",
                block: "ui-truncator-html-block",
                fade: "ui-truncator-html-fade",
                toggleBlock: "ui-truncator-html-toggle-block",
                toggle: "ui-truncator-html-toggle",
                more: "ui-truncator-html-more",
                less: "ui-truncator-html-less",
                str: "ui-truncator-str",
                yellow: "ui-truncator-html-fade-yellow",
                blue: "ui-truncator-html-fade-blue",
                enabled: "ui-truncator-enabled",
                disabled: "ui-truncator-disabled"
            },
            // Configs.
            type: "string",
            strLimit: 60,
            strSuffix: "...",
            minHeight: 90,
            fadeColor: "yellow",
            moreLabel: "More",
            lessLabel: "Less"
        },
        
        /************************
         * Instance Members.
         ************************/
        
        mode: null,
        baseClass: null,
        selectors: null,
        classes: null,
        
        /************************
         * Methods.
         ************************/
        
        /**
         * Public. Destroy method is used to clean up
         * any modifications the widget made to the DOM.
         */
        destroy: function () {
            this._destroy();
            
            // In jQuery UI 1.8, you must invoke the 
            // destroy method from the base widget.
            $.Widget.prototype.destroy.call(this);
        },
        
        /**
         * Public. Disables truncation.
         */
        disable: function () {
            this._disable();
        },
        
        /**
         * Public. Enables truncation.
         */
        enable: function () {
            this._enable();
        },
        
        /**
         * Public. Refreshes the UI.
         */
        refresh: function () {
            this._refresh();
        },
        
        /**
         * Public. Updates the strLimit option.
         */
        strLimit: function (newValue) {
            if (newValue === undefined) {
                return this._strLimit();
            }//end:if.
            this._setOption("strLimit", newValue);
        },
        
        /**
         * Public. Updates the strSuffix option.
         */
        strSuffix: function (newValue) {
            if (newValue === undefined) {
                return this._strSuffix();
            }//end:if.
            this._setOption("strSuffix", newValue);
        },
        
        /**
         * Public. Updates the fadeColor option.
         */
        fadeColor: function (newValue) {
            if (newValue === undefined) {
                return this._fadeColor();
            }//end:if.
            this._setOption("fadeColor", newValue);
        },
        
        /**
         * Public. Updates the moreLabel option.
         */
        moreLabel: function (newValue) {
            if (newValue === undefined) {
                return this._moreLabel();
            }//end:if.
            this._setOption("moreLabel", newValue);
        },
        
        /**
         * Public. Updates the lessLabel option.
         */
        lessLabel: function (newValue) {
            if (newValue === undefined) {
                return this._lessLabel();
            }//end:if.
            this._setOption("lessLabel", newValue);
        },
        
        /**
         * Public. Updates minHeight option.
         */
        minHeight: function (newValue) {
            if (newValue === undefined) {
                return this._minHeight();
            }//end:if.
            this._setOption("minHeight", newValue);
        },
        
        /**
         * Public. Returns original string value.
         */
        getOriginalStr: function () {
            if (this.mode === "html") {
                return;
            }//end:if.
            
            return $.trim(this.element.data("str").original);
        },
        
        /**
         * Public. Sets the original string property on
         * the root widget element.
         */
        setOriginalStr: function (newValue) {
            if (this.mode === "html" || newValue === undefined || typeof newValue !== "string") {
                return;
            }//end:if.
            this._setOption("setOriginalStr", newValue);
        },
        
        /**
         * Public. Returns html.
         */
        getHTML: function () {
            if (this.mode === "string") {
                return;
            }//end:if.
            
            return $.trim(this.element.data("html"));
        },
        
        /**
         * Internal. Disables truncation.
         */
        _disable: function () {
            // Determine mode.
            if (this.mode === "string") {
                if (!this.element.hasClass(this.classes.disabled)) {
                    this._revertTruncateStr();
                    this.element.addClass(this.classes.disabled);
                }//end:if.
            } else if (this.mode === "html") {
                if (!this.element.parent().hasClass(this.classes.disabled)) {
                    this._revertTruncateHTML();
                    this.element.parent().addClass(this.classes.disabled);
                }//end:if.
            }//end:if.
        },
        
        /**
         * Internal. Destroys & removes widget.
         */
        _destroy: function () {
            // Scope.
            var elemStr, block, wrapper, fade, toggle;
            
            // Determine mode.
            if (this.mode === "string") {
                elemStr = (this.element.data("str") === undefined) ? this.element.html() : this.element.data("str").original;
                this.element
                    .attr("title", elemStr)
                    .html(elemStr)
                    .removeClass(this.classes.str)
                    .removeClass(this.classes.base)
                    .removeAttr("class")
                    .removeData("str");
            } else if (this.mode === "html") {
                block = this.element;
                wrapper = block.parent();
                toggle = wrapper.find(this.selectors.toggle);
                fade = wrapper.find(this.selectors.fade);
                
                // Remove.
                toggle.unbind("click", this._toggleHandler)
                    .removeData("state")
                    .removeData("enabled")
                    .remove();
                fade.remove();
                block.removeAttr("style")
                    .removeClass(this.classes.block)
                    .removeData("html")
                    .unwrap();
            }//end:if.
        },
        
        /**
         * Internal. Enables truncation.
         */
        _enable: function () {
            // Determine mode.
            if (this.mode === "string") {
                if (this.element.hasClass(this.classes.disabled)) {
                    this.element.removeClass(this.classes.disabled);
                    this._truncateSwitcher();
                }//end:if.
            } else if (this.mode === "html") {
                if (this.element.parent().hasClass(this.classes.disabled)) {
                    this.element.parent().removeClass(this.classes.disabled);
                    this._truncateSwitcher();
                }//end:if.
            }//end:if.
        },
        
        /**
         * Internal. Re-draws the UI.
         */
        _refresh: function () {
            // Determine mode.
            if (this.mode === "string") {
                if (!this.element.hasClass(this.classes.disabled)) {
                    this._revertTruncateStr();
                    this._truncateSwitcher();
                }//end:if.
            } else if (this.mode === "html") {
                if (!this.element.parent().hasClass(this.classes.disabled)) {
                    this._revertTruncateHTML();
                    this._truncateSwitcher();
                }//end:if.
            }//end:if.
        },
        
        /**
         * Internal. Applies truncation on a string.
         */
        _applyTruncateStr: function () {
            // Scope.
            var elemStr, truncatedStr;
            
            // Initialize.
            elemStr = $.trim((this.element.data("str") === undefined) ? this.element.html() : this.element.data("str").original);
            truncatedStr = $.trim((elemStr.substring(0, (this.options.strLimit - this.options.strSuffix.length)) + this.options.strSuffix));
            
            // Apply.
            this.element
                .data("str", {original: elemStr, truncated: truncatedStr})
                .attr("title", elemStr)
                .html(truncatedStr);
        },
        
        /**
         * Internal. Reverts truncation on a string.
         */
        _revertTruncateStr: function () {
            // Scope & initialize.
            var elemStr = $.trim((this.element.data("str") === undefined) ? this.element.html() : this.element.data("str").original);
            
            // Revert.
            this.element
                .attr("title", elemStr)
                .html(elemStr)
                .data("str", {original: elemStr, truncated: null});
        },
        
        /**
         * Manages the link that opens & closes
         * the truncated html block.
         */
        _toggleHandler: function (evt) {
            // Scope;
            var that, elem, fade, toggle, opt, more, less;
            
            // Initialize;
            that = evt.data.that;
            elem = evt.data.that.element;
            fade = evt.data.fade;
            opt = evt.data.that.options;
            toggle = $(this);
            more = toggle.find(opt.selectors.more);
            less = toggle.find(opt.selectors.less);
            
            if (toggle.data("state") === "closed") {
                // When closed, open.
                fade.hide();
                elem.height("auto");
                more.hide();
                less.show();
                toggle.data("state", "open");
                that._trigger("onShowMore");
            } else if (toggle.data("state") === "open") {
                fade.show();
                elem.height(opt.minHeight);
                more.show();
                less.hide();
                toggle.data("state", "closed");
                that._trigger("onShowLess");
            }//end:if.
        },
        
        /**
         * Internal. Applys truncation on an html block.
         */
        _applyTruncateHTML: function () {
            // Scope.
            var wrapper, block, fade, toggle, more, less;
            
            // Initialize.
            wrapper = this.element.parent();
            block = wrapper.find(this.selectors.block);
            fade = wrapper.find(this.selectors.fade);
            toggle = wrapper.find(this.selectors.toggle);
            more = toggle.find(this.selectors.more);
            less = toggle.find(this.selectors.less);
            
            // Apply.
            block.css({"height": this.options.minHeight}).data("html", $.trim(this.element.html()));
            fade.css({"height": this.options.minHeight}).show();
            
            // Toggle.
            if (!toggle.data("enabled")) {
                toggle.bind("click", {
                    that: this,
                    wrapper: wrapper,
                    fade: fade
                }, this._toggleHandler)
                .data("enabled", true)
                .show();
            }//end:if.
            
            // More & less.
            more.show();
            less.hide();
        },
        
        /**
         * Internal. Reverts truncation on an html block.
         */
        _revertTruncateHTML: function () {
            // Scope.
            var wrapper, block, fade, toggle, more, less;
            
            // Initialize.
            wrapper = this.element.parent();
            block = wrapper.find(this.selectors.block);
            fade = wrapper.find(this.selectors.fade);
            toggle = wrapper.find(this.selectors.toggle);
            more = toggle.find(this.selectors.more);
            less = toggle.find(this.selectors.less);
            
            // Revert.
            block.removeAttr("style").data("html", $.trim(this.element.html()));
            fade.css({"height": "auto"}).hide();
            toggle.unbind("click", this._toggleHandler)
                .data("enabled", false)
                .data("state", "closed")
                .hide();
                
            // More & less.
            more.hide();
            less.hide();
        },
        
        /**
         * Internal. Based upon the widget mode, this method
         * determines whether or not we need to truncate the
         * element in question.
         */
        _truncateSwitcher: function () {
            // Scope.
            var elemHeight, elemContent, minHeight, elemStr;
            
            // Determine mode.
            if (this.mode === "string") {
                elemStr = (this.element.data("str") === undefined) ? this.element.html() : this.element.data("str").original;
                
                if (elemStr.length >= this.options.strLimit) {
                    this._applyTruncateStr();
                } else {
                    this._revertTruncateStr();
                }//end:if.
            } else if (this.mode === "html") {
                // Capture heights.
                elemHeight = this.element.height();
                minHeight = this.options.minHeight;
                
                // Capture content.
                elemContent = $.trim(this.element.html());
                
                // When height is a number and is
                // less than or equal to zero.
                if (typeof elemHeight === "number") {
                    if (elemHeight <= 0) {
                        elemHeight = this.options.minHeight;
                    }
                }//end:if.
                
                // When height is equal to undefined or null.
                if (elemHeight === undefined || null) {
                    elemHeight = this.options.minHeight;
                }//end:if.
                
                // Apply / remove truncation.
                if (elemHeight >= minHeight && elemContent !== "") {
                    this._applyTruncateHTML();
                } else {
                    this._revertTruncateHTML();
                }//end:if.
            }//end:if.
        },
        
        /**
         * Internal. Adds all DOM containers needed to truncate a string.
         */
        _initTruncateStr: function () {
            this.element
                .addClass(this.classes.base)
                .addClass(this.classes.str)
                .data("str", {original: $.trim(this.element.html()), truncated: null});
        },
        
        /**
         * Internal. Adds all DOM containers needed to truncate an HTML block.
         * All elements are hidden by default.
         */
        _initTruncateHTML: function () {
            // Scope.
            var that, wrapperHTML, fadeHTML, toggleHTML,
            wrapper, fade, toggle;
            
            // Initialize.
            that = this;
            // Markup.
            wrapperHTML = '<div class="' + this.classes.base + " " + this.classes.html + '"></div>';
            fadeHTML = '<div class="' + this.classes.fade + " " + this.classes[this.options.fadeColor] + '">&nbsp;</div>';
            toggleHTML = 
                '<div class="' + this.classes.toggleBlock + '">' + 
                    '<a href="javascript:;" class="' + this.classes.toggle + '" title="' + this.options.moreLabel + '">' + 
                        '<span class="' + this.classes.more + '">' + this.options.moreLabel + '</span>' + 
                        '<span class="' + this.classes.less + '">' + this.options.lessLabel + '</span>' + 
                    '</a>' + 
                '</div>';
            
            // Add wrapper.
            this.element.data("html", $.trim(this.element.html())).wrap(wrapperHTML);
            wrapper = this.element.closest(this.selectors.html);
            
            // Apply element styling.
            this.element.addClass(this.classes.block)
                .css({"height": "auto", "overflow": "hidden"});
            
            // Add Fade.more
            wrapper.append(fadeHTML);
            fade = wrapper.find(this.selectors.fade)
                .css({
                    "position": "absolute",
                    "top": 0, "left": 0,
                    "right": 0, "height": "auto"
                }).hide();
                
            // Add Toggle.
            wrapper.append(toggleHTML);
            toggle = wrapper.find(this.selectors.toggle)
                .data("enabled", false)
                .data("state", "closed")
                .hide();
        },
        
        /**
         * Internal. Determines the widget mode and prepares
         * the DOM based upon the mode set.
         */
        _initDOM: function () {
            // Determine mode.
            if (this.mode === "string") {
                this._initTruncateStr();
            } else if (this.mode === "html") {
                this._initTruncateHTML();
            }//end:if.
            
            // Apply/revert truncation.
            this._truncateSwitcher();
        },
        
        /**
         * Internal. Called when a user sets an option value
         * via the option method.
         */
        _setOption: function (key, value) {
            // strLimit.
            if (key === "strLimit") {
                this.options.strLimit = value;
                this._strLimit();
                this._refresh();
            }//end:if.
            
            // strSuffix.
            if (key === "strSuffix") {
                this.options.strSuffix = value;
                this._strSuffix();
                this._refresh();
            }//end:if.
            
            // minHeight.
            if (key === "minHeight") {
                this.options.minHeight = value;
                this._minHeight();
                this._refresh();
            }//end:if.
            
            // fadeColor.
            if (key === "fadeColor") {
                this.options.fadeColor = value;
                this._fadeColor();
                this._refreshFadeColor();
            }//end:if.
            
            // moreLabel.
            if (key === "moreLabel") {
                this.options.moreLabel = value;
                this._moreLabel();
                this._refreshMoreLabel();
            }//end:if.
            
            // lessLabel.
            if (key === "lessLabel") {
                this.options.lessLabel = value;
                this._lessLabel();
                this._refreshLessLabel();
            }//end:if.
            
            // setOriginalStr.
            if (key === "setOriginalStr") {
                this.element.data("str", {original: $.trim(value), truncated: null});
                this._refresh();
            }//end:if.
            
            // In jQuery UI 1.8, you have to manually
            // invoke the _setOption method from the base widget.
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        
        /**
         * Internal. Normalizes the type option.
         */
        _type: function () {
            // Scope.
            var type = this.options.type.toLowerCase();
            
            // Normalize.
            if (typeof type !== "string") {
                type = "string";
            } else if (type !== "string" && type !== "html") {
                type = "string";
            }//end:if.
            
            // Set
            this.options.type = type;
            return this.options.type;
        },
        
        /**
         * Internal. Normalizes the strLimit option.
         */
        _strLimit: function () {
            // Scope.
            var strLimit = this.options.strLimit;
            
            // Normalize.
            if (typeof strLimit !== "number") {
                strLimit = 60;
            }//end:if.
            
            // Set.
            this.options.strLimit = strLimit;
            return this.options.strLimit;
        },
        
        /**
         * Internal. Normalizes the strSuffix option.
         */
        _strSuffix: function () {
            // Scope.
            var strSuffix = this.options.strSuffix;
            
            // Normalize.
            if (typeof strSuffix !== "string") {
                strSuffix = "...";
            }//end:if.
            
            // Set.
            this.options.strSuffix = strSuffix;
            return this.options.strSuffix;
        },
        
        /**
         * Internal. Returns the value of the minHeight
         * option. There is no need to normalize the
         * minHeight property. This property is applied
         * to the jQuery height() method and it accepts
         * a wide range of types.
         */
        _minHeight: function () {
            return this.options.minHeight;
        },
        
        /**
         * Internal. Normalizes the fadeColor option.
         */
        _fadeColor: function () {
            // Scope.
            var fadeColor = this.options.fadeColor.toLowerCase();
            
            // Normalize.
            if (typeof fadeColor !== "string") {
                fadeColor = "yellow";
            } else if (fadeColor !== "yellow" && fadeColor !== "blue") {
                fadeColor = "yellow";
            }//end:if.
            
            // Set.
            this.options.fadeColor = fadeColor;
            return this.options.fadeColor;
        },
        
        /**
         * Updates the UI with fade color.
         */
        _refreshFadeColor: function () {
            // Scope.
            var fade = this.element.parent().find(this.selectors.fade);
            fade.removeClass(this.classes.blue)
                .removeClass(this.classes.yellow)
                .addClass(this.classes[this.options.fadeColor]);
        },
        
        /**
         * Internal. Normalizes the moreLabel option.
         */
        _moreLabel: function () {
            // Scope.
            var moreLabel = this.options.moreLabel;
            
            // Normalize.
            if (typeof moreLabel !== "string") {
                moreLabel = "More";
            }//end:if.
            
            // Set.
            this.options.moreLabel = moreLabel;
            return this.options.moreLabel;
        },
        
        /**
         * Updates the UI with more label.
         */
        _refreshMoreLabel: function () {
            // Scope.
            var more = this.element.parent().find(this.selectors.more);
            more.attr("title", this.options.moreLabel)
                .html(this.options.moreLabel);
        },
        
        /**
         * Internal. Normalizes the lessLabel option.
         */
        _lessLabel: function () {
            // Scope.
            var lessLabel = this.options.lessLabel;
            
            // Normalize.
            if (typeof lessLabel !== "string") {
                lessLabel = "Less";
            }//end:if.
            
            // Set.
            this.options.lessLabel = lessLabel;
            return this.options.lessLabel;
        },
        
        /**
         * Updates the UI with less label.
         */
        _refreshLessLabel: function () {
            // Scope.
            var less = this.element.parent().find(this.selectors.less);
            less.attr("title", this.options.lessLabel)
                .html(this.options.lessLabel);
        },
        
        /**
         * Internal. Normalizes options.
         */
        _normalizeOptions: function () {
            this.mode = this._type();
            this._strLimit();
            this._strSuffix();
            this._fadeColor();
            this._moreLabel();
            this._lessLabel();
        },
        
        /**
         * Internal. Set up the widget. This method gets run
         * once, immediately after instantiation.
         */
        _create: function () {
            this.selectors = this.options.selectors;
            this.classes = this.options.classes;
            this._normalizeOptions();
            this._initDOM();
        }
    });
})(jQuery);