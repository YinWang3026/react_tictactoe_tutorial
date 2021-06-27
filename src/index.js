import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Moving this to Function Component
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
    // Lift state up to Game
    // constructor(props) {
    //     super(props)
    //     // Board storing the state of squares
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    // Moving to Game
    // handleClick(i) {
    //     // Const = Variable cannot be redeclared, cannot be reassigned, and have Block scope
    //     const squares = this.state.squares.slice(); // Slice creates a copy of Array
    //     if (calculateWinner(squares) || squares[i]) {
    //         return; // Display clicking after winner or a square is occupied.
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O'
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext,
    //     });
    //     // When Board state changes, Square is automatically re-rendered
    //     // Immutability is important
    //         // Allows complex features to be done easily, ex. redo and undo
    //         // Detecting changes can be done easily
    //         // "Pure componends", and shouldComponentUpdate() are optimizations
    // }

    renderSquare(i) {
        // Passing data to a component using Prop (short for Properties)
        return (
            <Square 
                // Square recieve value from Board, and inform Board when clicked, Squares are "Controlled Components"
                value={this.props.squares[i]} // State passed to Square as a value prop
                onClick={() => this.props.onClick(i)} // handleClick passed to Square as a onClick prop
            />
        );
    }
  
    render() {
        // Moved to Game
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }
  
        return (
            <div>
                {/* <div className="status">{status}</div> */}
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
            stepNumber: 0, // Determine the state of game we are viewing
        };
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, // Strict equality, type and value must be same to be equal
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1] // Last item
        const squares = current.squares.slice();  // Copy
        if (calculateWinner(squares) || squares[i]) {
            return; 
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{ // Concat does not mutate original array
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    render() {
        const history = this.state.history; 
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => { // (element, index)
            const desc = move ? // Move = 0, then goto game start
                'Go to move #' + move : 'Go to game start';
            return (
                // Warning: Each child in a list should have a unique "key" prop
                // Key is used by react to decide whether a component needs to be created, updated, or deleted
                // Key does not need to be unique globlaly, but must be unique between components and siblings
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });
  

        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
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