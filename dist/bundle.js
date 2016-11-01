(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _snakeGame = require("./snake-game");

var _snakeGame2 = _interopRequireDefault(_snakeGame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var width = Math.min(window.innerWidth, 1000);
var height = width * 0.8;

var game = new _snakeGame2.default({
  width: width,
  height: height,
  fps: 15,
  rows: 80,
  columns: 100
});

document.body.appendChild(game.canvas);

},{"./snake-game":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directionOpposites;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var directions = exports.directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
};

// used to keep the user from doing an in-place 180 (and losing immediately)
var directionOpposites = exports.directionOpposites = (_directionOpposites = {}, _defineProperty(_directionOpposites, directions.UP, directions.DOWN), _defineProperty(_directionOpposites, directions.DOWN, directions.UP), _defineProperty(_directionOpposites, directions.LEFT, directions.RIGHT), _defineProperty(_directionOpposites, directions.RIGHT, directions.LEFT), _directionOpposites);

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var controls = {
  up: function up(keyCode) {
    return keyCode === 38 || keyCode === 87;
  },
  down: function down(keyCode) {
    return keyCode === 40 || keyCode === 83;
  },
  left: function left(keyCode) {
    return keyCode === 37 || keyCode === 65;
  },
  right: function right(keyCode) {
    return keyCode === 39 || keyCode === 68;
  }
};

exports.default = controls;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PI2 = Math.PI * 2;

var Food = function () {
  function Food(_ref) {
    var x = _ref.x,
        y = _ref.y,
        _ref$color = _ref.color,
        color = _ref$color === undefined ? "#E06F8B" : _ref$color;

    _classCallCheck(this, Food);

    this.x = x;
    this.y = y;
    this.color = color;
  }

  _createClass(Food, [{
    key: "onCollision",
    value: function onCollision(game) {
      game.feedSnake(this);
    }
  }, {
    key: "render",
    value: function render(game) {
      var context = game.context,
          cellWidth = game.cellWidth,
          cellHeight = game.cellHeight;
      var x = this.x,
          y = this.y,
          color = this.color;

      var radius = cellWidth / 2;

      context.save();
      context.fillStyle = color;
      context.beginPath();
      context.arc(x * cellWidth + radius, y * cellHeight + radius, radius, 0, PI2);
      context.fill();
      context.restore();
    }
  }]);

  return Food;
}();

exports.default = Food;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _snake = require("./snake");

var _snake2 = _interopRequireDefault(_snake);

var _food = require("./food");

var _food2 = _interopRequireDefault(_food);

var _wall = require("./wall");

var _wall2 = _interopRequireDefault(_wall);

var _userInterface = require("./user-interface");

var _userInterface2 = _interopRequireDefault(_userInterface);

var _controls = require("./controls");

var _controls2 = _interopRequireDefault(_controls);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnakeGame = function () {
  function SnakeGame(_ref) {
    var width = _ref.width,
        height = _ref.height,
        rows = _ref.rows,
        columns = _ref.columns,
        _ref$fps = _ref.fps,
        fps = _ref$fps === undefined ? 15 : _ref$fps,
        _ref$backgroundColor = _ref.backgroundColor,
        backgroundColor = _ref$backgroundColor === undefined ? "#1B2632" : _ref$backgroundColor;

    _classCallCheck(this, SnakeGame);

    this.width = width; // canvas width
    this.height = height; // canvas height
    this.rows = rows; // number of horizontal cells
    this.columns = columns; // number of vertical cells
    this.fps = fps;
    this.backgroundColor = backgroundColor;
    this.cellWidth = width / columns;
    this.cellHeight = height / rows;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.ui = new _userInterface2.default();
    this.addEventListeners();
    this.reset();
  }

  _createClass(SnakeGame, [{
    key: "reset",
    value: function reset() {
      var columns = this.columns,
          rows = this.rows;

      this.gameover = false;
      this.started = false;
      this.score = 0;
      this.collidables = [];
      this.turnDirection = null; // used to queue up changes in direction to avoid multiple turns in a single frame
      this.snake = new _snake2.default({ // snake starts at the center
        tailLength: 3,
        x: Math.floor(columns / 2),
        y: Math.floor(rows / 2)
      });
      this.placeFood();
      this.addWalls();
      this.render();
      clearInterval(this.gameInterval);
    }
  }, {
    key: "end",
    value: function end() {
      this.gameover = true;
    }
  }, {
    key: "addWalls",
    value: function addWalls() {
      var columns = this.columns,
          rows = this.rows;

      for (var x = 0; x < columns; x++) {
        var left = new _wall2.default({ x: x, y: 0 });
        var right = new _wall2.default({ x: x, y: rows - 1 });
        this.collidables.push(left, right);
      }
      for (var y = 0; y < columns; y++) {
        var top = new _wall2.default({ x: 0, y: y });
        var bottom = new _wall2.default({ x: columns - 1, y: y });
        this.collidables.push(top, bottom);
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      var UP = 87;
      var DOWN = 83;
      var LEFT = 65;
      var RIGHT = 68;
      var snake = this.snake,
          started = this.started,
          gameover = this.gameover;
      var keyCode = event.which;


      if (_controls2.default.up(keyCode)) this.turnDirection = _constants.directions.UP;else if (_controls2.default.down(keyCode)) this.turnDirection = _constants.directions.DOWN;else if (_controls2.default.left(keyCode)) this.turnDirection = _constants.directions.LEFT;else if (_controls2.default.right(keyCode)) this.turnDirection = _constants.directions.RIGHT;

      if (!started) {
        this.start();
      }
      if (gameover) {
        this.reset();
      }
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }, {
    key: "placeFood",
    value: function placeFood() {
      var columns = this.columns,
          rows = this.rows;

      var food = new _food2.default({
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
      });
      this.collidables.push(food);
    }
  }, {
    key: "feedSnake",
    value: function feedSnake(food) {
      this.score += 1;
      this.snake.grow(6);
      food.destroyed = true;
      this.placeFood();
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      var fps = this.fps;

      this.started = true;
      this.gameInterval = setInterval(function () {
        _this.step();
        _this.render();
      }, 1000 / fps);
      return this;
    }
  }, {
    key: "step",
    value: function step() {
      var _this2 = this;

      var snake = this.snake,
          collidables = this.collidables,
          turnDirection = this.turnDirection,
          columns = this.columns,
          rows = this.rows,
          gameover = this.gameover;


      if (!gameover) {
        var collisions = collidables.filter(function (c) {
          return c.onCollision && snake.isHeadAt(c);
        });
        collisions.forEach(function (collider) {
          return collider.onCollision(_this2);
        });

        if (turnDirection) {
          snake.setDirection(turnDirection);
          this.turnDirection = null;
        }
        if (snake.canStep(columns, rows)) {
          snake.step();
        } else {
          this.gameover = true;
        }

        this.collidables = this.collidables.filter(function (c) {
          return !c.destroyed;
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var snake = this.snake,
          collidables = this.collidables,
          ui = this.ui,
          width = this.width,
          height = this.height,
          backgroundColor = this.backgroundColor,
          context = this.context;

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);

      collidables.forEach(function (c) {
        return c.render(_this3);
      });
      snake.render(this);
      ui.render(this);
    }
  }]);

  return SnakeGame;
}();

exports.default = SnakeGame;

},{"./constants":2,"./controls":3,"./food":4,"./snake":6,"./user-interface":7,"./wall":8}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("./constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snake = function () {
  function Snake(_ref) {
    var x = _ref.x,
        y = _ref.y,
        direction = _ref.direction,
        _ref$tailLength = _ref.tailLength,
        tailLength = _ref$tailLength === undefined ? 3 : _ref$tailLength,
        _ref$color = _ref.color,
        color = _ref$color === undefined ? "#44891A" : _ref$color;

    _classCallCheck(this, Snake);

    this.segments = [{ x: x, y: y }]; // add the head segment
    this.growCount = tailLength; // the tail will grow as the snake begins to move
    this.direction = direction;
    this.color = color;
  }

  // returns the coordinates the snake's head is going to move into


  _createClass(Snake, [{
    key: "getNextPosition",
    value: function getNextPosition() {
      var _segments$ = this.segments[0],
          x = _segments$.x,
          y = _segments$.y;

      switch (this.direction) {
        case _constants.directions.UP:
          return { x: x, y: y - 1 };
        case _constants.directions.DOWN:
          return { x: x, y: y + 1 };
        case _constants.directions.LEFT:
          return { x: x - 1, y: y };
        case _constants.directions.RIGHT:
          return { x: x + 1, y: y };
      }
    }

    // returns true if the snake's head is at the passed coordinates

  }, {
    key: "isHeadAt",
    value: function isHeadAt(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      var _segments$2 = this.segments[0],
          hx = _segments$2.x,
          hy = _segments$2.y;

      return x === hx && y === hy;
    }

    // returns whether or not the snake is about to run into a wall or itself

  }, {
    key: "canStep",
    value: function canStep(columns, rows) {
      var segments = this.segments;

      var _getNextPosition = this.getNextPosition(),
          x = _getNextPosition.x,
          y = _getNextPosition.y;

      return x >= 0 && y >= 0 && x < columns && y < rows && !segments.find(function (s) {
        return s.x === x && s.y === y;
      });
    }

    // Queues `count` segments to be added. Queued segments are added 1 per step to the end of the snake

  }, {
    key: "grow",
    value: function grow() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.growCount += count;
    }

    // Changes the snake's direction as long as the new direction isn't the opposite of the current direction (ex. up -> down)

  }, {
    key: "setDirection",
    value: function setDirection(direction) {
      if (direction !== _constants.directionOpposites[this.direction]) {
        this.direction = direction;
      }
    }

    // Moves and grows the snake

  }, {
    key: "step",
    value: function step() {
      var segments = this.segments,
          direction = this.direction,
          growCount = this.growCount;

      var head = segments[0];
      var length = segments.length;

      var nextPosition = this.getNextPosition();
      var lastSegmentPos = {
        x: head.x,
        y: head.y
      };

      // move head
      head.x = nextPosition.x;
      head.y = nextPosition.y;

      // each tail segment follows the segment before it
      for (var i = 1; i < length; i++) {
        var segment = segments[i];
        var x = segment.x,
            y = segment.y;

        segment.x = lastSegmentPos.x;
        segment.y = lastSegmentPos.y;
        lastSegmentPos.x = x;
        lastSegmentPos.y = y;
      }

      // append a new segment at the end if any grow segments are queued
      if (growCount > 0) {
        segments.push({
          x: lastSegmentPos.x,
          y: lastSegmentPos.y
        });
        this.growCount -= 1;
      }
    }
  }, {
    key: "render",
    value: function render(game) {
      var context = game.context,
          cellHeight = game.cellHeight,
          cellWidth = game.cellWidth;
      var segments = this.segments,
          color = this.color;

      context.save();
      context.fillStyle = color;
      segments.forEach(function (_ref3) {
        var x = _ref3.x,
            y = _ref3.y;

        context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      });
      context.restore();
    }
  }]);

  return Snake;
}();

exports.default = Snake;

},{"./constants":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserInterface = function () {
  function UserInterface() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$textColor = _ref.textColor,
        textColor = _ref$textColor === undefined ? "#FFFFFF" : _ref$textColor;

    _classCallCheck(this, UserInterface);

    this.textColor = textColor;
  }

  _createClass(UserInterface, [{
    key: "render",
    value: function render(game) {
      var context = game.context,
          width = game.width,
          height = game.height,
          score = game.score,
          gameover = game.gameover;
      var textColor = this.textColor;

      // draw score

      context.save();
      context.fillStyle = textColor;
      context.font = "15px Arial";
      context.fillText("" + score, 5, 15);
      context.restore();

      if (gameover) {
        var centerX = width / 2;
        var centerY = height / 2;

        // draw gameover overlay
        context.save();
        context.globalAplha = 0.5;
        context.fillStyle = "rgba(0, 0, 0, 0.8)";
        context.textAlign = "center";
        context.fillRect(0, 0, width, height);

        // draw gameover text
        context.fillStyle = textColor;
        context.font = "50px Arial";
        context.fillText("Game Over", centerX, centerY - 50);
        context.font = "35px Arial";
        context.fillText("Score: " + score, centerX, centerY + 25);
        context.fillText("Press any key to restart", centerX, centerY + 75);
        context.restore();
      }
    }
  }]);

  return UserInterface;
}();

exports.default = UserInterface;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wall = function () {
  function Wall(_ref) {
    var x = _ref.x,
        y = _ref.y,
        _ref$color = _ref.color,
        color = _ref$color === undefined ? "#888" : _ref$color;

    _classCallCheck(this, Wall);

    this.x = x;
    this.y = y;
    this.color = color;
  }

  _createClass(Wall, [{
    key: "onCollision",
    value: function onCollision(game) {
      game.end();
    }
  }, {
    key: "render",
    value: function render(game) {
      var context = game.context,
          cellWidth = game.cellWidth,
          cellHeight = game.cellHeight;
      var x = this.x,
          y = this.y,
          color = this.color;

      var cx = x * cellWidth;
      var cy = y * cellHeight;

      context.save();
      context.fillStyle = context.strokeStyle = color;
      context.fillRect(cx, cy, cellWidth, cellHeight);
      context.strokeRect(cx, cy, cellWidth, cellHeight);
      context.restore();
    }
  }]);

  return Wall;
}();

exports.default = Wall;

},{}]},{},[1]);
