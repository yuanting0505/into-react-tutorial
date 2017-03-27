import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
	if (props.highlight) {
		return (
			<button className="square" style={{ color: 'red' }} onClick={() => props.onClick()}>
				{props.value}
			</button>
		);
	} else {
		return (
			<button className="square" onClick={() => props.onClick()}>
				{props.value}
			</button>
		);
	}
}

class Board extends React.Component {
	renderSquare(i, win) {
		return <Square key={i} value={this.props.squares[i]} highlight={win} onClick={() => this.props.onClick(i)} />;
	}
	render() {
		let divs = [];

		for (let i = 0; i <= 2; i++) {
			let squares = [];
			for (let j = 0; j <= 2; j++) {
				let index = 3 * i + j;
				let win = this.props.winSquares.indexOf(index) > -1;
				squares.push(this.renderSquare(index, win));
			}
			divs.push(<div className="board-row" key={i}>{squares}</div>);
		}
		return <div>{divs}</div>;
	}
}

class Game extends React.Component {
	constructor() {
		super();
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			xIsNext: true,
			stepNumber: 0,
			locations: [],
			ascend: true
		};
	}
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) ? false : true
		})
	}
	handleListClick(e, move) {
		//remove other clicked lines
		let lists = document.getElementsByClassName("clicked");
		Array.prototype.forEach.call(lists, (el) => {
			el.classList.remove('clicked');
		});
		e.target.classList.add('clicked');

		this.jumpTo(move);
	}
	handleClick(i) {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const squares = current.squares.slice();
		const winner = calculateWinner(squares);
		const locations = this.state.locations;

		if (winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		locations.push(i);
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: this.state.stepNumber + 1,
			locations: locations
		});
	}
	handleClickBtn() {
		this.setState({
			ascend: !this.state.ascend
		});
	}
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const locations = this.state.locations;

		let status;
		let winSquares = [];
		if (winner) {
			status = 'Winner: ' + winner.winner;
			winSquares = winner.winSquares;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		const ascend = this.state.ascend ? 'Discend' : 'Ascend';

		let moves = [];

		history.forEach((step, move) => {
			const desc = move ? 'Move ' + translateLocation(locations[move - 1]) : 'Game start';
			let list = (
				<li key={move}>
					<a href='#' onClick={(e) => this.handleListClick(e, move)}>{desc}</a>
				</li>
			);
			this.state.ascend ? moves.push(list) : moves.unshift(list);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} winSquares={winSquares} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.handleClickBtn()}>{ascend}</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ===============================
ReactDOM.render(
	<Game />,
	document.getElementById('container')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winner: squares[a],
				winSquares: [a, b, c]
			}
		}
	}
	return null;
}

function translateLocation(i) {
	return '(' + [parseInt(i / 3), i % 3].toString() + ')';
}