import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square_class extends React.Component {
//     // Square no longer storing the state, Board does
//     // constructor(props) {
//     //     super(props); // Init super class, must do first thing
//     //     this.state = { // State is used to remember things
//     //         value: null,
//     //     };
//     // }
    
//     // Render function is called to render this component
//     render() {
//         return (
//             <button 
//                 className="square" 
//                 // SetState tells react to re-render the component
//                 // onClick={() => this.setState({value:'X'})}
//                 onClick={() => { this.props.onClick(); }} // Calling onClick passed from prop
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

// Function components - No states, not a class, only takes a prop and returns render method
function Square(props) {
    return (
        // onClick, no paranthesis
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    ); 
}

  
class Board extends React.Component {
    constructor(props) {
        super(props)
        // Board storing the state of squares
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        // Const = Variable cannot be redeclared, cannot be reassigned, and have Block scope
        const squares = this.state.squares.slice(); // Slice creates a copy of Array
        if (calculateWinner(squares) || squares[i]) {
            return; // Display clicking after winner or a square is occupied.
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
        // When Board state changes, Square is automatically re-rendered
        // Immutability is important
            // Allows complex features to be done easily, ex. redo and undo
            // Detecting changes can be done easily
            // "Pure componends", and shouldComponentUpdate() are optimizations
    }

    renderSquare(i) {
        // Passing data to a component using Prop (short for Properties)
        return (
            <Square 
                // Square recieve value from Board, and inform Board when clicked, Squares are "Controlled Components"
                value={this.state.squares[i]} // State passed to Square as a value prop
                onClick={() => this.handleClick(i)} // handleClick passed to Square as a onClick prop
            />
        );
    }
  
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
  
        return (
            <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true, 
        };
    }

    render() {
        return (
            <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);