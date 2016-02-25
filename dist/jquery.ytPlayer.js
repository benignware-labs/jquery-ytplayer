(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  
  /**
   * JQuery YTPlayer
   */
    
  function YTPlayer(element, options) {
    // Init plugin instance
    var
      $element = $(element),
      opts = {};
    
    /**
     * Updates the component
     * @param {Object} options
     */
    this.update = function(options) {
      $.extend(opts, options);
      // Update logic
      $element.html(opts.foo);
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.foo = function(bar) {
      $.extend(opts, options);
      // Method logic
      $element.html(bar || opts.foo);
    };

    
    // Initial update
    this.update($.extend(true, {
      // Plugin Defaults:
      foo: 'Bar'
    }, options, $element.data()));
  }
  
  // Add Plugin to registry
  $.fn.ytPlayer = function() {
    var
      args = [].slice.call(arguments);
    return this.each(function() {
      return (function(instance) {
        var
          result;
        // Update or init plugin
        $(this).data('ytPlayer', instance = instance ? typeof args[0] === 'object' && instance.update(args[0]) && instance || instance : new YTPlayer(this, args[0]));
        // Call method
        result = typeof args[0] === 'string' && typeof instance[args[0]] === 'function' ? instance[args[0]].apply(instance, args.slice(1)) : result;
        // Return undefined or chaining element
        return typeof result !== 'undefined' ? result : this;
      }).call(this, $(this).data('ytPlayer'));
    });
  };

}));