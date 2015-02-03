var Physics = require("physicsjs");

Physics(function (world) {

  var viewWidth = 500;
  var viewHeight = 300;
  var started = false;

  var renderer = Physics.renderer("canvas", {
    el: "game",
    width: viewWidth,
    height: viewHeight,
    meta: false,
    styles: {
      circle: {
        strokeStyle: "white",
        lineWidth: 1,
        fillStyle: "white",
        angleIndicator: "white"
      },
      rectangle: {
        fillStyle: "white"
      }
    }
  });
  world.add(renderer);

  var paddleHeight = 10;
  var paddleWidth = 60;
  var paddle = Physics.body("rectangle", {
    x: (viewWidth/2),
    y: viewHeight - paddleHeight - 5,
    width: paddleWidth,
    height: paddleHeight,
    treatment: "static"
  });
  world.add(paddle);

  var ballRadius = 10;
  var ball = Physics.body("circle", {
    x: paddle.state.pos.x,
    y: paddle.state.pos.y - ballRadius,
    radius: ballRadius,
    restitution: 1,
    cof: 0
  });
  world.add(ball);

  var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight + 200);
  world.add(Physics.behavior("edge-collision-detection", {
    aabb: viewportBounds,
    restitution: 1,
    cof: 0
  }));
  world.add(Physics.behavior("body-impulse-response"));
  world.add(Physics.behavior("body-collision-detection"));
  world.add(Physics.behavior("sweep-prune"));

  world.on("step", function(){
    world.render();
  });

  Physics.util.ticker.on(function (time) {
    world.step(time);
  });
  Physics.util.ticker.start();

  window.addEventListener("keydown", function (event) {
    var pos = paddle.state.pos;
    var ballPos = ball.state.pos;
    var moveBy;
    if (event.keyCode === 37) {
      moveBy = pos.x - Math.max(paddleWidth / 2, pos.x - 20);
      pos.set(pos.x - moveBy, pos.y);
      if (!started) {
        ballPos.set(ballPos.x - moveBy, ballPos.y);
      }
    } else if (event.keyCode === 39) {
      moveBy = Math.min(viewWidth - (paddleWidth/2), pos.x + 20) - pos.x;
      pos.set(pos.x + moveBy, pos.y);
      if (!started) {
        ballPos.set(ballPos.x + moveBy, ballPos.y);
      }
    } else if (event.keyCode === 13) {
      if (!started) {
        started = true;
        ball.state.vel.set(0.2, -0.2);
        ball.sleep(false);
      }
    }
  });
});
