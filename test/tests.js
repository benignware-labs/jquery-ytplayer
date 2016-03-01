test("default", function(assert) {
  assert.ok(
    $('#qunit-fixture').ytplayer().data('ytplayer'),
    "Instance should have been created.'"
  );
});