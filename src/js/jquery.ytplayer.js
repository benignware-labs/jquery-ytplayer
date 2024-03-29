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
  
  var
    location = window.location;
  
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
        return deferred.promise();
      }
      
      // FIXME: Add listeners
      
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
      $wrapper = null,
      $embed = null,
      player = null,
      playerReady = false,
      triggerPlay = false,
      opts = {},
      pauseTimeout = null;
      
    function applyStateClass(state) {
      if (typeof opts.playerStatePrefix === 'string' || opts.playerStatePrefix) {
        states.forEach(function(name, index) {
          if (name) {
            $element.toggleClass(opts.playerStatePrefix ? opts.playerStatePrefix + name : name, state === index - 1);
          }
        });
      }
    }
    
    function setState(newState) {
      var playerState = player && player.getPlayerState && player.getPlayerState();
      if (newState !== state || newState !== playerState) {
        // State Change
        
        // Apply State CSS-Class
        applyStateClass.call(this, newState);
        
        // Trigger option callback
        if (opts.events && opts.events.onStateChange) {
          opts.events.onStateChange.apply(this, [{data: newState}]);
        }
        
        // Trigger event
        $element.trigger('ytplayer:statechange', newState);
        
        // Apply new state
        state = newState;
        
        // Process options
        if ('ontouchstart' in window && opts.fullScreen === 'auto' && (state === 2 || state === 0)) {
          // Paused
          // exit fullscreen
          exitFullScreen();
        }
      }
    }
      
    function updatePlayer(options) {
      var
        deferred = $.Deferred();
     
      loadYTPlayerAPI().done(function(YT) {
        //if (!player) {
          // Load Player
          // TODO: Check if options have changed
          // TODO: Use setOption method of player
          if ($embed && $embed.length) {
            $embed.remove();
          }
          var
            embedClass = 'ytplayer-embed',
            wrapperClass = 'ytplayer-wrapper';
          // Create player element
          $embed = $('<div class="' + embedClass + '"></div>');
          $wrapper = $('<div class="' + wrapperClass + '"></div>').append($embed).prependTo($element);
          var opts = $.extend(true, {}, options, {
            events: {
              'onReady': function() {
                if (!playerReady) {
                  playerReady = true;
                  if (triggerPlay) {
                    // Playing was requested
                    instance.playVideo();
                  }
                  if (options.events && options.events.onReady) {
                    options.events.onReady.apply(this, arguments);
                  }
                  $element.trigger('ytplayer:ready', instance);
                  deferred.resolve(player);
                }
              },
              'onStateChange': function(e) {
                var
                  state = e.data;
                setState(e.data);
              }
            }
          });
          player = new YT.Player($embed[0], opts);
        /*} else {
          // Player exists
          for (var name in options) {
            player.setOption(name, options[name]);
          }
        }*/
        if (options.fullScreen && options.fullScreen !== 'auto' || options.fullScreen === 'auto' && 'ontouchstart' in window) {
          requestFullScreen();
        } else {
          exitFullScreen();
        }
      });
      
      return deferred.promise();
    }
    
    /**
     * Updates the component
     * @param {Object} options
     */
    this.update = function(options) {
      opts = $.extend(true, opts, options);
      // Update logic
      // Init Player
      updatePlayer(opts).done(function() {
        // Update Player Ready
      });
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.playVideo = function() {
      // Start video
      window.clearTimeout(pauseTimeout);
      triggerPlay = true;
      if (!playerReady) {
        setState(3);
      }
      if (player && player.playVideo) {
        player.playVideo();
        // Playing
      }
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.stopVideo = function() {
      triggerPlay = false;
      window.clearTimeout(pauseTimeout);
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
      // Pause video
      window.clearTimeout(pauseTimeout);
      pauseTimeout = window.setTimeout(function() {
        if (!triggerPlay && state === 2 && player && player.getPlayerState && player.getPlayerState() !== 2 && player.pauseVideo) {
          player.pauseVideo();
        }
      }, 50);
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
      //return player && player.getPlayerState ? player.getPlayerState() : state;
      return state;
    };
    
    /**
     * Example method
     * @param {String} bar
     */
    this.setOption = function(name, value) {
      this.update({
        name: value
      });
    };
    
    this.toggleFullScreen = function() {
      toggleFullScreen();
    };
    
    function isFullScreen() {
      return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    }
    
    function requestFullScreen() {
      var impl = element.webkitEnterFullscreen || element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen;
      if (impl) {
        impl.bind(element)();
      }
    }
    
    function exitFullScreen() {
      $element.css({
        width: '',
        height: ''
      });
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    
    function toggleFullScreen() {
      if (isFullScreen()) {
        exitFullScreen();
      } else {
        requestFullScreen();
      }
    }
    
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e) {
      var isWebkit = 'WebkitAppearance' in document.documentElement.style;
      // Now do something interesting
      if (isWebkit) {
        if (isFullScreen()) {
          $element.css({
            position: 'absolute',
            top: '50%',
            transform: 'translate(0,-50%)',
            WebkitTransform: 'translate(0,-50%)',
            MozTransform: 'translate(0,-50%)',
            MsTransform: 'translate(0,-50%)',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100vw'
          });
        } else {
          $element.css({
            position: '',
            top: '',
            transform: '',
            WebkitTransform: '',
            MozTransform: '',
            MsTransform: '',
            width: '',
            height: ''
          });
        }
      }
    });
    
    // TODO: Wrap player methods


   // Apply Initial State CSS-Class
   //applyStateClass.call(this, state);

   // Initial update
   this.update($.extend(true, {
      // Plugin Defaults:
      embedClass: 'ytplayer-embed',
      wrapperClass: 'ytplayer-wrapper',
      fullScreen: 'auto',
      // YouTube Defaults
      playerStatePrefix: 'ytplayer-state-',
      playerVars: {
        enablejsapi: 1,
        origin: location.protocol.match(/http/) ? location.protocol + "://" + location.hostname + (location.port ? ":" + location.port : '') : undefined,
        modestbranding: 0,
        controls: 1,
        showinfo: 0, // http://stackoverflow.com/questions/12537535/embedded-youtube-video-showinfo-incompatible-with-modestbranding
        rel: 0,
        iv_load_policy: 3,
        nologo: 1,
        autohide: 1,
        fs: 1,
        playsinline: 0
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
  $.fn.ytplayer = function() {
    var
      args = [].slice.call(arguments),
      result = this;
    this.each(function() {
      var r = (function(instance) {
        // Update or init plugin
        $(this).data('ytplayer', instance = instance ? typeof args[0] === 'object' && instance.update(args[0]) && instance || instance : new YTPlayer(this, args[0]));
        // Call method
        // TODO: Serve as wrapper for player object too
        if (typeof args[0] === 'string' && typeof instance[args[0]] === 'function') {
          var r = instance[args[0]].apply(instance, args.slice(1));
          if (result === this && typeof r !== 'undefined') {
            result = r;
          }
        } 
      }).call(this, $(this).data('ytplayer'));
    });
    return result;
  };

}));