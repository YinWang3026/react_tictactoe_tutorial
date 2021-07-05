import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// // Moving this to Function Component
// class Square_class extends React.Component {
//     // // Square no longer storing the state, Board does
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
        <button 
            className="square" 
            onClick={props.onClick}
            style={{backgroundColor: props.highLight}}
        >
            {props.value}
        </button>
    ); 
}

  
class Board extends React.Component {
    // // Lift state up to Game
    // constructor(props) {
    //     super(props)
    //     // Board storing the state of squares
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    // // Moving to Game
    // handleClick(i) {
    //     const squares = this.state.squares.slice(); // Slice creates a copy of Array
    //     if (calculateWinner(squares) || squares[i]) {
    //         return; // Display clicking after winner or a square is occupied.
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O'
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext,
    //     });
    // }

    renderSquare(i) {
        // Passing data to a component using Prop (short for Properties)
        return (
            <Square 
                // Square recieve value from Board, and inform Board when clicked, Squares are "Controlled Components"
                value={this.props.squares[i]} // State passed to Square as a value prop
                onClick={() => this.props.onClick(i)} // handleClick passed to Square as a onClick prop
                highLight={this.props.highLight[i]}
            />
        );
    }
  
    render() {
        // // Moved to Game
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }
        
        // Challenge 3 - Re-write board with 2 for loops
        const board = []
        for (let row = 0; row < 3; row++) {
            let rows = []
            for (let col = 0; col < 3; col++) {
                rows.push(this.renderSquare(row*3+col))
            }
            board.push(<div className="board-row">{rows}</div>)
        }
  
        return (
            <div>
                {board}
            </div>
            // <div>
            //     <div className="board-row">
            //         {this.renderSquare(0)}
            //         {this.renderSquare(1)}
            //         {this.renderSquare(2)}
            //     </div>
            //     <div className="board-row">
            //         {this.renderSquare(3)}
            //         {this.renderSquare(4)}
            //         {this.renderSquare(5)}
            //     </div>
            //     <div className="board-row">
            //         {this.renderSquare(6)}
            //         {this.renderSquare(7)}
            //         {this.renderSquare(8)}
            //     </div>
            // </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            // An array of the boards
            history: [{
                squares: Array(9).fill(null),
                squareNumber: null,
            }],
            xIsNext: true, 
            stepNumber: 0, // Determine the state of game we are viewing
            reverseList: false,
            winner: null,
            winningSquares: null,
        };
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0, // Strict equality, type and value must be same to be equal
        })
    }

    handleClick(i) {
        // Const = Variable cannot be redeclared, cannot be reassigned, and have Block scope
        const history = this.state.history.slice(0, this.state.stepNumber+1); // Copy history array, [)
        const current = history[history.length-1]; // Last item
        const squares = current.squares.slice();  // Copy
        
        // If there is a winner or the square is occupied, return
        if (this.state.winner || squares[i]) {
            return; 
        }

        // Place move, check for winner
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const winningSquares = calculateWinner(squares);
        const winner = winningSquares ? squares[winningSquares[0]] : null;
       
        this.setState({
            history: history.concat([{ // Concat does not mutate original array
                squares: squares, // Squares
                squareNumber: i, // Clicked on box i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            winningSquares: winningSquares,
            winner: winner,
        });

        // When Game state changes, Board is automatically re-rendered, and so are the squares
        // Immutability is important
        // Allows complex features to be done easily, ex. redo and undo
        // Detecting changes can be done easily
        // "Pure componends", and shouldComponentUpdate() are optimizations
    }

    // Challenge 1 - Add (row,col)
    getCoordinates(squareNumber){
        if (squareNumber == null) {
            return '';
        } else{
            const row = squareNumber / 3;
            const col = squareNumber % 3;
            const coord = ' (row:' + Math.floor(row) + ' col: ' + col + ')';
            return coord;
        }
    }

    // Challenge 2 - Add bold tags to current selected step
    addBoldTags(desc, currentStep, historyStep) {
        return (currentStep === historyStep) ? <b>{desc}</b> : desc
    }

    // Challenge 4 - Reverse list
    toggleReverse() {
        this.setState({
            reverseList: !this.state.reverseList,
        });
    }

    render() {
        const history = this.state.history; 
        const current = history[this.state.stepNumber];
        const highLight = Array(9).fill(null);

        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner;
            // Challenge 5 - Highlights
            for (let ind of this.state.winningSquares) {
                highLight[ind] = "blue";
            }
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
                        {this.addBoldTags(desc+this.getCoordinates(step.squareNumber), move, this.state.stepNumber)}
                    </button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        highLight={highLight}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleReverse()}>Reverse List</button>
                    {/* Challenge 4 - Reverse List */}
                    {this.state.reverseList ? <ol reversed>{moves.reverse()}</ol> : <ol>{moves}</ol>}
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
            return lines[i];
        }
    }
    return null;
}

  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);