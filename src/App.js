import React, {Component} from 'react';
import Slider, {Range} from 'rc-slider';
import {Tex} from 'react-tex';
import './App.css';
import 'rc-slider/assets/index.css';

const math = require('mathjs');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {n: 10};
	}

	render() {
		const n = this.state.n;
		const solutions = generateSolutionSet(n);
		const coefficients = generateCoefficientMatrix(n);
		const latex = generateLaTeX(coefficients, solutions);

		const xvec = String.raw`\left(${[...new Array(n).keys()].map(n => `x_${n}`).join(', ')}\right)`;

		return (
			<div>
				<p>Solve the following system of linear equations:</p>
				<Tex texContent={latex} />
				<p>Enter your solutions (comma-separated):</p>
				<Tex texContent={`${xvec}=(`} /><input type="text" id="userSolutions" /><Tex texContent=")" />
				<button type="submit" onClick={() => {
					const userSolution = document.getElementById('userSolutions').value.split(',').map(c => parseInt(c));

					if (userSolution.join(',') === solutions.join(',')) {
						alert('Good job! That seems about right.');
					} else {
						alert('Oops. That doesn\'t seem right; re-check your work and try again.');
					}
				}}
				>Check my work!
				</button>
				<br />
				<p>Number of equations: </p>
				<Slider min={2} max={10} step={1} onChange={this.changeNumber.bind(this)} />
			</div>
		);
	}

	changeNumber(value) {
		this.setState({n: value});
	}
}

function generateCoefficientMatrix(n) {
	// Integers from -10 to 10 and 1 more 0
	const options = [...new Array(21).keys()].map(c => c - 10).concat([0]);

	return new Array(n).fill(0).map(() => {
		return new Array(n).fill(0).map(() => randomElementFromArray(options));
	});
}

function generateSolutionSet(n) {
	const options = [...new Array(21).keys()].map(c => c - 10);

	return new Array(n).fill(0).map(() => randomElementFromArray(options));
}

function randomElementFromArray(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function calculateConstantsVector(coefficientMatrix, solutionSet) {
	return math.multiply(coefficientMatrix, solutionSet);
}

function generateLaTeX(coefficientMatrix, solutionSet) {
	const constantsVector = calculateConstantsVector(coefficientMatrix, solutionSet);

	let latex = String.raw`\begin{cases}`;

	coefficientMatrix.forEach((row, equationIndex) => {
		let equation = '';
		row.forEach((coefficient, coefficientIndex) => {
			const term = `${coefficient}x_{${coefficientIndex}}+`;

			equation += (coefficient === 0) ? '' : term;
		});

		equation = equation.slice(0, -1);
		equation = equation.replace(/\+-/g, '-');
		equation += `&=${constantsVector[equationIndex]}`;

		equation += String.raw`\\`;

		latex += equation;
	});

	latex += String.raw`\end{cases}`;

	return latex;
}

export default App;
