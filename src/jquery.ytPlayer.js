/* global YT */
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
  
  
  var camelize = function(string) {
    return string.replace(/(\-[a-z])/g, function($1) { return $1.toUpperCase().replace('-',''); });
  };
  
  // Load YouTube-API
  var loadYTPlayerAPI = (function() {
    var
      URL  ="https://www.youtube.com/iframe_api";
    return function() {
      var
        deferred = $.Deferred(),
        _onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady,
        tag, firstScriptTag;
        
      if (window.YT) {
        // Already loaded, resolve immediately
        deferred.resolve(window.YT);
        return;
      }
      
      // Register global callback
      window.onYouTubeIframeAPIReady = function() {
        // Call overridden method
        if (_onYouTubeIframeAPIReady) {
          _onYouTubeIframeAPIReady.apply(this, arguments);
        }
        // Resolve promise
        deferred.resolve(window.YT);
      };
      
      // This code loads the IFrame Player API code asynchronously.
      tag = document.createElement('script');
      tag.src = URL;
      firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      return deferred.promise();
    };
  })();
  
  /**
   * JQuery YTPlayer
   */
    
  function YTPlayer(element, options) {
    // Init plugin instance
    var
      instance = this,
      states = ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'],
      state = -1,
      $element = $(element),
      $embed = null,
      player = null,
      playerReady = false,
      triggerPlay = false,
      opts = {};
      
      
    function setState(newState) {
      if (newState !== state) {
        if (opts.events && opts.events.onStateChange) {
          opts.events.onStateChange.apply(this, arguments);
        }
        state = newState;
        states.forEach(function(name, index) {
          if (name) {
            $element.toggleClass(opts.playerStateClassPrefix + name, state === index - 1);
          }
        });
      }
    }
      
    function updatePlayer(options) {
      var
        deferred = $.Deferred();
        
      if (playerReady) {
        deferred.resolve(player);
        return deferred.promise();
      }
        
      loadYTPlayerAPI().done(function() {
        // Load Player
        // TODO: Check if options have changed
        if ($embed && $embed.length) {
          $embed.remove();
        }
        // Create player element
        $embed = $('<div class="yt-player-embed"></div>').prependTo($element);
        var opts = $.extend(true, {}, options, {
          events: {
            'onReady': function() {
              if (!playerReady) {
                playerReady = true;
                if (triggerPlay) {
                  // Playing was requested
                  instance.playVideo();
                }
                deferred.resolve(player);
                if (options.events && options.events.onReady) {
                  options.events.onReady.apply(this, arguments);
                }
                $element.trigger('ytplayer:ready', arguments);
              }
            },
            'onStateChange': function(e) {
              setState(e.data);
              $element.trigger('ytplayer:statechange', arguments);
            }
          }
        });
        player = new YT.Player($embed[0], opts);
      });
      
      return deferred.promise();
    }
    
    /**
     * Updates the component
     * @param {Object} options
     */
    this.update = function(options) {
      $.extend(true, opts, options);
      // Update logic
      // Init Player
      updatePlayer(opts).done(function() {
        // Player Ready
      });
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.playVideo = function() {
      // Start video
      triggerPlay = true;
      if (!playerReady) {
        setState(3);
      }
      if (player && player.playVideo) {
        player.playVideo();
      }
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.stopVideo = function() {
      triggerPlay = false;
      // Stop video
      setState(-1);
      if (player && player.stopVideo) {
        player.stopVideo();
      }
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.pauseVideo = function() {
      setState(2);
      triggerPlay = false;
      // Start video
      if (player && player.pauseVideo) {
        player.pauseVideo();
      }
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.togglePlay = function() {
      // Start video
      var state = this.getPlayerState();
      if (state === 1) {
        this.pauseVideo();
      } else {
        this.playVideo();
      }
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.getPlayerState = function() {
      // Start video
      return player && player.getPlayerState ? player.getPlayerState() : state;
    };
    
    
    // TODO: Wrap player methods


   this.update($.extend(true, {
      // Plugin Defaults:
      playerStateClassPrefix: '',
      playerVars: {
        modestbranding: 1,
        controls: 0,
        //showinfo: 0, // http://stackoverflow.com/questions/12537535/embedded-youtube-video-showinfo-incompatible-with-modestbranding
        rel: 0,
        iv_load_policy: 3,
        nologo: 1,
        autohide: 1,
        fs: 0
      }
    }, options, (function(options) {
      var
        name,
        result = {};
      for (name in options) {
        result[camelize(name)] = options[name];
      }
      return result;
    })($element.data())));
  }
  
  
  
  
  // Add Plugin to registry
  $.fn.ytPlayer = function() {
    var
      args = [].slice.call(arguments),
      result = this;
    this.each(function() {
      return (function(instance) {
        // Update or init plugin
        $(this).data('ytPlayer', instance = instance ? typeof args[0] === 'object' && instance.update(args[0]) && instance || instance : new YTPlayer(this, args[0]));
        // Call method
        // TODO: Serve as wrapper for player object too
        result = typeof args[0] === 'string' && typeof instance[args[0]] === 'function' ? instance[args[0]].apply(instance, args.slice(1)) : result;
        // Return undefined or chaining element
        return typeof result !== 'undefined' ? result : this;
      }).call(this, $(this).data('ytPlayer'));
    });
    return result;
  };

}));