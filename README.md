jquery-ytplayer
==============

> Wrapper for the YouTube-IFrame-API

Usage
-----

Include dependencies

```html
<script src="https://code.jquery.com/jquery-2.2.1.min.js"></script>
<script src="src/jquery.ytplayer.min.js"></script>
```

Provide some markup

```html
<div class="ytplayer" data-video-id="bHQqvYy5KYo"> </div>
```

Initialize Plugin

```js
$('.ytplayer').ytplayer();
```

Options
-------
<table>
  <tr>
    <th>Name</th><th>Description</th>
  </tr>
  <tr>
    <td>videoId</td><td>YouTube-Video-Id</td>
  </tr>
  <tr>
    <td>width</td><td>Pass width to iframe</td>
  </tr>
  <tr>
    <td>height</td><td>Pass height to iframe</td>
  </tr>
  <tr>
    <td>playerVars</td><td>Pass Parameters to the YouTube-IFrame-API: https://developers.google.com/youtube/player_parameters</td>
  </tr>
  <tr>
    <td>fullScreen</td><td>Triggers FullScreen mode when executed in a user interaction context. Defaults to `auto` which will play the video in fullscreen automatically on touch devices.</td>
  </tr>
  <tr>
    <td>events</td><td>An object with callback functions. Supported types are `onReady` and `onStateChange`.</td>
  </tr>
</table>


Methods
-------
<table>
  <tr>
    <th>Name</th><th>Description</th>
  </tr>
  <tr>
    <td>playVideo</td><td>Start video playback</td>
  </tr>
  <tr>
    <td>pauseVideo</td><td>Pause video playback</td>
  </tr>
  <tr>
    <td>stopVideo</td><td>Stop video playback</td>
  </tr>
  <tr>
    <td>togglePlay</td><td>Toggle video playback</td>
  </tr>
  <tr>
    <td>toggleFullScreen</td><td>Toggle fullscreen mode</td>
  </tr>
</table>

Events
------
<table>
  <tr>
    <th>Name</th><th>Description</th>
  </tr>
  <tr>
    <td>ytplayer:ready</td><td>Dispatched when the player is ready</td>
  </tr>
  <tr>
    <td>ytplayer:statechange</td><td>Dispatched when the player state has changed. Second argument refers to the state id: https://developers.google.com/youtube/js_api_reference#Events</td>
  </tr>
</table>

## Changelog

* v0.0.1 - Initial Release