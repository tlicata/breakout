var Physics = require("physicsjs");

Physics(function (world) {

  var viewWidth = 500;
  var viewHeight = 300;

  var renderer = Physics.renderer("canvas", {
    el: "game",
    width: viewWidth,
    height: viewHeight,
    meta: false
  });
  world.add(renderer);

  var ball = Physics.body("circle", {
    x: 50,
    y: 30,
    vx: 0.2,
    vy: 0.01,
    radius: 20
  });
  world.add(ball);

  var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
  world.add(Physics.behavior("edge-collision-detection", {
    aabb: viewportBounds,
    restitution: 1,
    cof: 0
  }));
  world.add(Physics.behavior("body-impulse-response"));

  world.on("step", function(){
    world.render();
  });

  Physics.util.ticker.on(function (time) {
    world.step(time);
  });
  Physics.util.ticker.start();
});
