(function (factory) {
    if (typeof exports === 'object') {
        var $ = require('jquery');
        window.jQuery = $;
        require('bootstrap-modal');
        factory(require('jquery'));
    }
    else {
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    var ModalRemote = function (el, options) {
        this.options = $.extend({}, ModalRemote.defaultOptions, options);
        this.$el = $(el);
        this.$body = this.$el.find('.modal-body');
        this.xhr = null;
        this.init();
    };

    ModalRemote.prototype.init = function () {
        // #1 Cancel XHR request if user kills the modal
        this.$el.on('hide.bs.modal', function (event) {
            if (this.xhr !== null) {
                this.xhr.abort();
            }
            // Remove just in case.
            this.$el.removeClass('loading');
        }.bind(this));

        this.show();
    };

    ModalRemote.prototype.show = function () {
        this.$body.html('<p>Loading</p>');
        this.$el.modal('show').addClass('loading');

        this.doRequest();
    };

    ModalRemote.prototype.doRequest = function () {
        // Store the xhr so we can cancel the request if user cancels
        // the modal before ajax request finishes.
        var url = this.options.url;

        if (url === null) {
            throw "NO URL";
        }

        var onContentLoaded = $.isFunction(this.options.callbacks.onContentLoaded)
            ? this.options.callbacks.onContentLoaded
            : this.onContentLoaded.bind(this);

        var xhrOptions = {
            url: url,
            type: 'get',
            dataType: this.options.endpointDataType,
            cache: false,
            context: this
        };

        if (this.options.params) {
            xhrOptions.data = this.options.params;
        }

        this.xhr = $.ajax(xhrOptions)
            .done(onContentLoaded)
            .fail(function (jqXHR, errorReason) {
                if (errorReason !== 'abort') {
                    window.console.error('Could not load the modal:' + errorReason);
                }
                this.$body.removeClass('loading');
            }.bind(this));
    };

    ModalRemote.prototype.hide = function () {
        this.$el.modal('hide');
    };

    ModalRemote.prototype.onContentLoaded = function (data) {
        this.$body.html(data.html);
        this.$el
        // As we are modifying the content, we should tell
        // bs.modal its content has been modified so it can adjust
        // scrollbars if needed.
            .modal('handleUpdate')
            .removeClass('loading');
    };

    ModalRemote.defaultOptions = {
        /**
         * URL
         */
        url: null,

        endpointDataType: 'json',

        /**
         * Callbacks
         */
        callbacks: {
            onContentLoaded: null
        }
    };

    $.fn.modalRemote = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        //return this.each( function(){

        var $this = $(this);
        var data = $this.data('ModalRemote');
        var options = typeof option === 'object' && option;

        if (!data) {
            $this.data('ModalRemote', (data = new ModalRemote(this, options)));
        }
        else if (typeof(nOptions) === 'object') {
            // Update options
            data.options = $.extend(data.options, options);
            data.show();
        }
        // @todo If needed, implement way to call internal methods
        else if (typeof nOptions==='string') {
            data[nOptions](args);
        } else if (options.show) {
            data.show(args);
        }

        return this;
    };
}));