import React, {Component} from 'react';
import {Tex} from 'react-tex';
import './App.css';

class App extends Component {
	render() {
		const n = 3;
		const solutions = generateSolutionSet(n);
		const latex = generateLaTeX(generateCoefficientMatrix(n), solutions);
		console.log(latex);
		return (
			<div>
				<Tex texContent={latex} />
				<p>{solutions.join(', ')}</p>
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
	const constantsVector = [];

	coefficientMatrix.forEach((row, index) => {
		let sum = 0;
		row.forEach(coefficient => {
			sum += coefficient * solutionSet[index];
		});

		constantsVector.push(sum);
	});

	return constantsVector;
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
		equation += `&=${solutionSet[equationIndex]}`;

		equation += String.raw`\\`;

		latex += equation;
	});

	latex += String.raw`\end{cases}`;

	return latex;
}

// const A = generateCoefficientMatrix(3);
// const x = generateSolutionSet(3);
// const b = calculateConstantsVector(A, x);

export default App;
