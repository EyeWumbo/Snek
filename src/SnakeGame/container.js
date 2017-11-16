import React, { Component } from "react";

import SnakeTile from "./tiles";
import GetControlDirection from "./controller";

export default class SnakeContainer extends Component {

  // Component Methods

  constructor(props) {
    super(props);
    const boardSize = props.boardSize;
    var initArray = new Array(boardSize).fill(0);
    initArray = initArray.map(_ => {
      return new Array(boardSize).fill(0).map(_ => { return {} });
    });
    var snakeLength = [
      {
        x: parseInt(boardSize * 1 / 4, 10),
        y: parseInt(boardSize / 2, 10),
        direction: "right"
      }
    ];
    this.state = {
      gameBoard: initArray,
      snake: snakeLength,
      boardSize,
      goal: null
    }
  }

  componentDidMount() {
    this.listenForKeypress = (e) => {
      var snakeHead = this.state.snake[0];
      const direction = GetControlDirection(e) || snakeHead.direction;
      this.state.queuedDirection = direction;
    }
    this.state.goal = this.findNextGoal();
    // this.startGame();
  }

  componentWillUnmount() {
    this.stopGame();
  }

  // Helper Methods

  resetGame() {
    const boardSize = this.props.boardSize;
    var initArray = new Array(boardSize).fill(0);
    initArray = initArray.map(_ => {
      return new Array(boardSize).fill(0).map(_ => { return {} });
    });
    var snakeLength = [
      {
        x: parseInt(boardSize * 1 / 4, 10),
        y: parseInt(boardSize / 2, 10),
        direction: "right"
      }
    ];
    this.state = {
      gameBoard: initArray,
      snake: snakeLength,
      boardSize,
      goal: null
    };
    this.startGame();
  }

  startGame() {
    window.addEventListener("keydown", this.listenForKeypress);
    this.update = setInterval(this.updateGameBoard.bind(this), this.props.gameSpeed);
  }

  stopGame() {
    window.removeEventListener("keydown", this.listenForKeypress);
    clearInterval(this.update);
  }

  isGameOver() {
    const snakeHead = this.state.snake[0];
    const bounds = this.props.boardSize;
    const headInSnake = this.state.snake.slice(1).findIndex(s => s.x == snakeHead.x && s.y == snakeHead.y) >= 0;
    return snakeHead.x < 0 || snakeHead.x >= bounds || snakeHead.y < 0 || snakeHead.y >= bounds || headInSnake;
  }

  findNextGoal() {
    const bounds = this.state.boardSize;
    var possiblePositions = (new Array(bounds * bounds)).fill(1).map((_, i) => i);
    this.state.snake.forEach(s => {
      possiblePositions[s.y * bounds + s.x] = null;
    });
    possiblePositions = possiblePositions.filter(p => p != null);
    const randIndex = parseInt(Math.random() * possiblePositions.length);
    return [
      possiblePositions[randIndex] % bounds,
      parseInt(possiblePositions[randIndex] / bounds, 10)
    ];
  }

  updateGameBoard() {
    var { snake, goal } = this.state;
    const board = this.state.gameBoard;
    var head = snake[0];
    var tail = snake[snake.length - 1];
    const cachePos = [tail.x, tail.y];
    const cacheDir = tail.direction;

    if(this.state.queuedDirection) {
      head.direction = this.state.queuedDirection;
      board[head.y][head.x].direction = this.state.queuedDirection;
      this.state.queuedDirection = null;
    }

    for(var i = 0; i < snake.length; i ++) {
      let tile = board[snake[i].y][snake[i].x];
      if(tile && tile.direction) {
        snake[i].direction = tile.direction;
      }
      switch(snake[i].direction) {
        case "up": snake[i].y --; break;
        case "down": snake[i].y ++; break;
        case "left": snake[i].x --; break;
        case "right": snake[i].x ++; break;
      }
    }

    if(head.x == goal[0] && head.y == goal[1]) {
      this.state.goal = null;
      snake.push({
        x: cachePos[0],
        y: cachePos[1],
        direction: cacheDir
      });
      tail = snake[snake.length - 1];
    }
    else {
      board[cachePos[1]][cachePos[0]] = {};
    }

    if(this.isGameOver()) {
      this.stopGame();
      if(this.props.onDone) {
        this.props.onDone();
      }
    }

    if(!this.state.goal) {
      const coords = this.findNextGoal();
      this.setState({
        goal: coords
      })
    }

    this.forceUpdate();
  }



  render() {
    const { gameBoard, snake, goal } = this.state;
    return (
      <div className="game">
        {
          gameBoard.map((row, i) => {
            return (
              <div className="tile-row">
                {
                  row.map((col, j) => {
                    const isSnake = snake.findIndex(s => s.x == j && s.y == i) >= 0;
                    const isGoal = goal && goal[0] == j && goal[1] == i;
                    const isHead = isSnake && snake[0].x == j && snake[0].y == i;
                    return (
                      <SnakeTile isSnake={isSnake} isGoal={isGoal} isHead={isHead} />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )

  }
}
