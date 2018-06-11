import React, {Component} from 'react';
import {Tex} from 'react-tex';
import './App.css';

const math = require('mathjs');

class App extends Component {
	render() {
		const n = 2;
		const solutions = generateSolutionSet(n);
		const coefficients = generateCoefficientMatrix(n);
		const latex = generateLaTeX(coefficients, solutions);

		console.log(coefficients, solutions, calculateConstantsVector(coefficients, solutions));

		const xvec = String.raw`\left(${[...new Array(n).keys()].map(n => `x_${n}`).join(', ')}\right)`;

		console.log(xvec);
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
				}}>Check my work!</button>
			</div>
		);
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
			let term = `${coefficient}x_${coefficientIndex}+`;

			equation += coefficient !== 0 ? term : '';
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
