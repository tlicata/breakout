var Physics = require("physicsjs");

Physics(function (world) {

  var viewWidth = 500;
  var viewHeight = 300;
  var started = false;
  var rightKeyDown = false;
  var leftKeyDown = false;

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

  var paddleHeight = 8;
  var paddleWidth = 50;
  var paddle = Physics.body("rectangle", {
    x: (viewWidth/2),
    y: viewHeight - paddleHeight - 5,
    width: paddleWidth,
    height: paddleHeight,
    treatment: "static"
  });
  world.add(paddle);

  var ballRadius = 7;
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
    var rightLimit = viewWidth - paddleWidth/2;
    var leftLimit = paddleWidth / 2;
    var paddlePos = paddle.state.pos;
    var ballPos = ball.state.pos;
    var dist = 0;
    if (leftKeyDown && !rightKeyDown) {
      dist = -5;
    } else if (rightKeyDown && !leftKeyDown) {
      dist = 5;
    }
    if (paddlePos.x + dist > rightLimit) {
      dist = rightLimit - paddlePos.x;
    } else if (paddlePos.x + dist < leftLimit) {
      dist = paddlePos.x - leftLimit;
    }
    paddlePos.set(paddlePos.x + dist, paddlePos.y);
    if (!started) {
      ballPos.set(ballPos.x + dist, ballPos.y);
      ball.sleep(true);
    } else if (ballPos.y > viewHeight) {
      started = false;
      var middle = viewWidth / 2;
      paddlePos.set(middle, paddlePos.y);
      ballPos.set(middle, paddlePos.y - ballRadius);
      ball.state.vel.set(0, 0);
    }
    world.render();
  });

  Physics.util.ticker.on(function (time) {
    world.step(time);
  });
  Physics.util.ticker.start();

  window.addEventListener("keyup", function (event) {
    if (event.keyCode === 37) {
      leftKeyDown = false;
    } else if (event.keyCode === 39) {
      rightKeyDown = false;
    }
  });
  window.addEventListener("keydown", function (event) {
    if (event.keyCode === 37) {
      leftKeyDown = true;
    } else if (event.keyCode === 39) {
      rightKeyDown = true;
    } else if (event.keyCode === 13) {
      if (!started) {
        started = true;
        ball.state.vel.set(0.2, -0.2);
        ball.sleep(false);
      }
    }
  });
});
