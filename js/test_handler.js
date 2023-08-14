const initialData = getInitialData();
const manager = {
	sum: {
		operand: '+',
		firstNumberName: 'перший доданок',
		secondNumberName: 'другий доданок',
		thirdNumberName: 'сума',
	},
	sub: {
		operand: '-',
		firstNumberName: 'зменшуване',
		secondNumberName: 'від\'ємник',
		thirdNumberName: 'різниця',
	},
	first_digit: 1,
	second_digit: 2,
	third_digit: 3,
	taskNumber: 1,
	correctAnswear: 0,
	attempt: 0,
	scores: null,
	increaseTaskNumber () {
		this.taskNumber++;
	},
	increaseAttempt () {
		this.attempt++;
	},
	increaseCorrectAnswear () {
		this.correctAnswear++;
	},
	calculateScores () {
		this.scores = Math.ceil(12*this.correctAnswear/this.attempt);
	},
	createMessage () {
		return `<span class='attempt_txt'>Кількість прикладів, що вирішено: ${this.correctAnswear}, <br> кількість спроб: ${this.attempt}. <br> Твоя оцінка:</span><br><span class='scores'>${this.scores}</span>`
	}
}

class NumberValue {
	constructor(position) {
		this.position = position;
	}
	generateDigit () {
		const digit = Math.floor(Math.random()*10);
		return digit;
	}
	generateNumber (number=undefined) {
		for (let i=manager[initialData.decimal]; i > 0; i--) {
			if (initialData['operation'] == 'sum') {
				if (initialData['level'] == 'low') {
					if (number) {
						do {
							this[i] = this.generateDigit();
						} 
						while (number[i] + this[i] > 10);
					} else {
						
						this[i] = this.generateDigit();
					}
				} else {
					this[i] = this.generateDigit();
				}
			} else if (initialData['operation'] == 'sub') {
				if (initialData['level'] == 'low') {
					if (number) {
						do {
							this[i] = this.generateDigit();
							if (this[i] - number[i] <= 0) break;
						} 
						while (true);
					} else {
						do {
							this[i] = this.generateDigit();
						} 
						while (this[i] > 8);
					}
				} else {
					if (number) {
							this[i] = this.generateDigit();
							if (i==1 && this[manager[initialData.decimal]] >= number[manager[initialData.decimal]]) number[manager[initialData.decimal]] = this[manager[initialData.decimal]] + 1;
							if (number[manager[initialData.decimal]] == 10) {
								--this[manager[initialData.decimal]];
								--number[manager[initialData.decimal]];
							}
					} else {
						do {
							this[i] = this.generateDigit();
						} 
						while (this[i] > 8);
					}
				}			
			}
		}
	}
	compileNumber (third=0, second=0, first=0) {
		return third*100+second*10+first; 
	}
}

let result = createTask ();

document.querySelector('.test').querySelector('button').addEventListener('click', ()=> {
	if (checkAnswearValidity ()) {
		manager.increaseAttempt ();
		document.querySelector('.test').querySelector('button').style.pointerEvents = 'none';
		if(result == readAnswear ()) {
			manager.increaseCorrectAnswear ();
			document.querySelector('.right').style.display = 'flex';
		} else {
			document.querySelector('.wrong').style.display = 'flex';
		}
	};
});
document.addEventListener('keydown', (e)=> {
	if (checkAnswearValidity () && 
		e.key == 'Enter' &&
		document.querySelector('.right').style.display != 'flex' &&
		document.querySelector('.wrong').style.display != 'flex') {
		manager.increaseAttempt ();
		document.querySelector('.test').querySelector('button').style.pointerEvents = 'none';
		if(result == readAnswear ()) {
			manager.increaseCorrectAnswear ();
			document.querySelector('.right').style.display = 'flex';
		} else {
			document.querySelector('.wrong').style.display = 'flex';
		}
	} else if (document.querySelector('.right').style.display == 'flex') {
		manager.increaseTaskNumber ();
		document.querySelector('.right').style.display = 'none';
		document.querySelector('.test').querySelector('button').style.pointerEvents = 'all';
		result = createTask ();
		clearInput ();
	} else if (document.querySelector('.wrong').style.display == 'flex') {
		document.querySelector('.wrong').style.display = 'none';
		document.querySelector('.test').querySelector('button').style.pointerEvents = 'all';
		clearInput ();
		
		const resultArray = [...document.querySelectorAll("input")].filter(item => item.closest(".block").style.display != "none");
		resultArray[0].focus();
	}
});
document.querySelector('.right').querySelector('.nxt_btn').addEventListener('click', ()=> {
	manager.increaseTaskNumber ();
	document.querySelector('.right').style.display = 'none';
	document.querySelector('.test').querySelector('button').style.pointerEvents = 'all';
	result = createTask ();
	clearInput ();
});
document.querySelector('.right').querySelector('.complete_btn').addEventListener('click', ()=> {
	if (manager.attempt >= 20) createFinalMessage ();
	document.querySelector('.right').style.display = 'none';
	document.querySelector('.complete').style.display = 'flex';
});
document.querySelector('.wrong').querySelector('.one_more_btn').addEventListener('click', ()=> {
	document.querySelector('.wrong').style.display = 'none';
	document.querySelector('.test').querySelector('button').style.pointerEvents = 'all';
	clearInput ();
	
	const resultArray = [...document.querySelectorAll("input")].filter(item => item.closest(".block").style.display != "none");
	resultArray[0].focus();
});
document.querySelector('.wrong').querySelector('.nxt_btn').addEventListener('click', ()=> {
	manager.increaseTaskNumber ();
	document.querySelector('.wrong').style.display = 'none';
	document.querySelector('.test').querySelector('button').style.pointerEvents = 'all';
	result = createTask ();
	clearInput ();
});
document.querySelector('.wrong').querySelector('.complete_btn').addEventListener('click', ()=> {
	if (manager.attempt >= 20) createFinalMessage ();
	document.querySelector('.wrong').style.display = 'none';
	document.querySelector('.complete').style.display = 'flex';
});
document.querySelector('.complete').querySelector('.one_more_btn').addEventListener('click', ()=> {
	window.open('../html/test.html','_self');
});
document.querySelector('.complete').querySelector('.main_btn').addEventListener('click', ()=> {
	window.open('../Математика.html','_self');
});


function createTask () {
	const firstNumber = new NumberValue('first');
	firstNumber.generateNumber();

	const secondNumber = new NumberValue('second');
	secondNumber.generateNumber(firstNumber);

	const compiledFirstNumber = firstNumber.compileNumber(firstNumber['3'], firstNumber['2'], firstNumber['1']);
	const compiledSecondNumber = secondNumber.compileNumber(secondNumber['3'], secondNumber['2'], secondNumber['1']);
	
	setTaskNumberValue ();
	fillNumberName (initialData.operation);
	showOperand (initialData.operation);
	fillNumberValue (firstNumber);
	fillNumberValue (secondNumber);

	const result = getResult (compiledFirstNumber, compiledSecondNumber);	

	showAllInputs ();
	hideRange (result);
	
	const resultArray = [...document.querySelectorAll("input")].filter(item => item.closest(".block").style.display != "none");
	resultArray[0].focus();
	
	resultArray.forEach((item, index, array) => {
		document.addEventListener("input", function() {
			if (item.value.length == 1 && index < array.length-1) array[index+1].focus();
		})
	});

	return result;
}

function getInitialData () {
	const json = localStorage.getItem('optionsData');
	return JSON.parse(json);
}

function getResult (compiledFirstNumber, compiledSecondNumber) {
	return (initialData.operation == 'sum') ? compiledFirstNumber + compiledSecondNumber : compiledFirstNumber - compiledSecondNumber;
}

function showOperand (operation) {
	document.querySelector('.operand > div').textContent = manager[operation]['operand'];
}

function fillNumberName (operation) {
	const numberOrder = ['first', 'second', 'third'];
	numberOrder.forEach(item => {
		document.querySelector(`.${item}_number_name`).textContent = manager[operation][`${item}NumberName`];
	});
}

function fillNumberValue (number) {
	const digitOrder = {'first': '1', 'second': '2', 'third': '3'};
	for (let key in digitOrder) {
		document.querySelector(`.${number.position}_number_block`).querySelector(`.${key}_digit_value`).textContent = number[digitOrder[key]];
	}
}

function hideRange (result) {
	if (initialData.decimal == 'first_digit') {
		document.querySelector('.first_number_block').querySelector('.third_digit_block').style.display = 'none';
		document.querySelector('.first_number_block').querySelector(".second_digit_block").style.display = 'none';
		document.querySelector('.second_number_block').querySelector(".third_digit_block").style.display = 'none';
		document.querySelector('.second_number_block').querySelector(".second_digit_block").style.display = "none";
		document.querySelector(".third_number_block").querySelector(".fourth_digit_block").style.display = "none";
		document.querySelector(".third_number_block").querySelector(".third_digit_block").style.display = "none";
		if (String(result).length < 2) document.querySelector(".third_number_block").querySelector(".second_digit_block").style.display = "none";
	} else if (initialData.decimal == "second_digit") {
		document.querySelector(".first_number_block").querySelector(".third_digit_block").style.display = "none";
		document.querySelector(".second_number_block").querySelector(".third_digit_block").style.display = "none";
		document.querySelector(".third_number_block").querySelector(".fourth_digit_block").style.display = "none";
		if (String(result).length < 3) document.querySelector(".third_number_block").querySelector(".third_digit_block").style.display = "none";
	} else if (initialData.decimal == "third_digit") {
		if (String(result).length < 4) document.querySelector(".third_number_block").querySelector(".fourth_digit_block").style.display = "none";
	}
}

function readAnswear () {
	const resultArray = [...document.querySelectorAll("input")].map(item => item.value);
	
	let answear = 0;
	for (let i=0; i<resultArray.length; i++) {
		answear += resultArray[i]*10**(resultArray.length-1-i);
	}
	return answear;
}

function checkAnswearValidity () {
	const resultArray = [...document.querySelectorAll("input")].filter(item => item.closest(".block").style.display != "none");
	for (let item of resultArray) {
		if (item.value == '') return false;
	}

	return true;
}

function setTaskNumberValue () {
	document.querySelector('.main > div:nth-child(1) > span').textContent = manager.taskNumber;
}

function clearInput () {
	const resultArray = [...document.querySelectorAll("input")];
	
	resultArray.forEach(item => item.value = '');
}

function showAllInputs () {
	const inputsBlockArray = [...document.querySelectorAll("input")].forEach(item => item.closest(".block").style.display = "block");
}

function createFinalMessage () {
	manager.calculateScores ();
	const scores = manager.scores;
	const message = manager.createMessage ();
	
	document.querySelector('.complete').querySelector('.message_txt').innerHTML = (scores >= 9) ? `Поздоровляю!<br> ${message}` : `${message}`; 
}




