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
                key={i}
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
            board.push(<div key={row} className="board-row">{rows}</div>)
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
                squareSelected: null,
                winner: null,
                winningSquares: null,
                haveSquares: true,
            }],
            xIsNext: true, 
            stepNumber: 0, // Determine the state/history of game we are viewing
            reverseList: false,
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
        const history = this.state.history.slice(0, this.state.stepNumber+1); // Copy history array, inclusive, exclusive
        const current = history[history.length-1]; // Last item
        const squares = current.squares.slice();  // Copy
        
        // If there is a winner or the square is occupied, return
        if (current.winner || squares[i]) {
            return; 
        }

        // Place move, check for winner
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const haveSquares = haveSquaresToPlay(squares);
        const winningSquares = calculateWinner(squares);
        const winner = winningSquares ? squares[winningSquares[0]] : null;
       
        this.setState({
            history: history.concat([{ // Concat does not mutate original array
                squares: squares, // Squares
                squareSelected: i, // Clicked on box i
                winningSquares: winningSquares,
                winner: winner,
                haveSquares: haveSquares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });

        // When Game state changes, Board is automatically re-rendered, and so are the squares
        // Immutability is important
        // Allows complex features to be done easily, ex. redo and undo
        // Detecting changes can be done easily
        // "Pure componends", and shouldComponentUpdate() are optimizations
    }

    // Challenge 1 - Add (row,col)
    getCoordinates(squareSelected){
        if (squareSelected == null) {
            return '';
        } else{
            const row = squareSelected / 3;
            const col = squareSelected % 3;
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

    restartGame(){
        // Reset the states to initial values
        this.setState({
            history: [{
                squares: Array(9).fill(null),
                squareSelected: null,
                winner: null,
                winningSquares: null,
                haveSquares: true,
            }],
            xIsNext: true, 
            stepNumber: 0,
            reverseList: false,
        });
    }

    // Render is called after setState.
    // Do not ever trigger a setState in render
    // Render's only job is to RENDER based on the current state
    render() {
        const history = this.state.history; 
        const current = history[this.state.stepNumber];
        const highLight = Array(9).fill(null);

        let status;
        if (current.winner) {
            status = 'Winner: ' + current.winner;
            // Challenge 5 - Highlights
            for (let ind of current.winningSquares) {
                highLight[ind] = "blue";
            }
        } else if (!current.winner && !current.haveSquares){
            status = "No winner. Tie!"
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
                        {this.addBoldTags(desc+this.getCoordinates(step.squareSelected), move, this.state.stepNumber)}
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
                    <button onClick={() => this.restartGame()}>Restart Game</button>
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
// Challenge 6 - Checking for ties
function haveSquaresToPlay(squares){
    for (let i = 0; i < squares.length; i++){
        if (squares[i] == null){
            return true;
        }
    }
    return false;
}

  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);