// FIXME: This will timeout in phantomjs probably due to iframe incompatibilities
test("default", function(assert) {
  var done = assert.async();
  var $player = $('#qunit-fixture').ytplayer();
  $player.on('ytplayer:ready', function(e, instance) {
    assert.ok(
      instance,
      "Player should emit ready event.'"
    );
    done();
  });
});