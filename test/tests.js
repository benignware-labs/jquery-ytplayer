test("default", function(assert) {
  assert.ok(
    $('#qunit-fixture').ytPlayer().data('ytPlayer'),
    "Instance should have been created.'"
  );
});