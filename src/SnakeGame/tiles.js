import React, { Component } from "react";

export default class SnakeTile extends Component {
  render() {
    return (
      <div className="board-tile">
        {
          this.props.isSnake ? (
            <div className={`tile snake-tile ${this.props.isHead ? "snake-head" : ""}`}>
            </div>
          ) : (
            null
          )
        }
        {
          this.props.isGoal ? (
            <div className="tile goal-tile">
            </div>
          ) : (
            null
          )
        }
      </div>
    )
  }
}
