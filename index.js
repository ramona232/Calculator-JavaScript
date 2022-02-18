const initApp = () => {
	const currValueElem = document.querySelector(".currValue");
	const preValueElem = document.querySelector(".preValue");
	let itemArray = [];
	const equationArray = [];
	let newNumberFlag = false;

	const inputButtons = document.querySelectorAll(".number");
	inputButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			const newInput = event.target.textContent;
			if (newNumberFlag) {
				currValueElem.value = newInput;
				newNumberFlag = false;
			} else {
				currValueElem.value =
					currValueElem.value == 0 ? newInput : `${currValueElem.value}${newInput}`;
			}
		});
	});

	const opButton = document.querySelectorAll(".operator");
	opButton.forEach((button) => {
		button.addEventListener("click", (event) => {
			// if = sign is showing
			if (newNumberFlag) {
				preValueElem.textContent = " ";
				itemArray = [];
			}

			const newOperator = event.target.textContent;
			const currValue = currValueElem.value;

			// need number first
			if (!itemArray.length && currValue == 0) return;

			// begin a new equation
			if (!itemArray.length) {
				itemArray.push(currValue, newOperator);
				preValueElem.textContent = `${currValue} ${newOperator}`;
				return (newNumberFlag = true);
			}

			// complete equation
			if (itemArray.length) {
				itemArray.push(currValue);
				const equationObj = {
					num1: parseFloat(itemArray[0]),
					num2: parseFloat(currValue),
					op: itemArray[1],
				};

				equationArray.push(equationObj);
				const equationString = `${equationObj["num1"]}
					 ${equationObj["op"]}
					 ${equationObj["num2"]}`;

				const newValue = calculate(equationString, currValueElem);
				preValueElem.textContent = `${newValue} ${newOperator}`;

				// start new equation
				itemArray = [newValue, newOperator];
				newNumberFlag = true;
				console.log(equationArray);
			}
		});
	});

	const equalsButtons = document.querySelector(".equals");
	equalsButtons.addEventListener("click", () => {
		const currValue = currValueElem.value;
		let equationObj;
		// press equals repeatedly
		if (!itemArray.length && equationArray.length) {
			const lastEquation = equationArray[equationArray.length - 1];
			equationObj = {
				num1: parseFloat(currValue),
				num2: lastEquation.num2,
				op: lastEquation.op,
			};
		} else if (!itemArray.length) {
			return currValue;
		} else {
			itemArray.push(currValue);
			equationObj = {
				num1: parseFloat(itemArray[0]),
				num2: parseFloat(currValue),
				op: itemArray[1],
			};
		}

		equationArray.push(equationObj);

		const equationString = `${equationObj["num1"]}
		   ${equationObj["op"]}
			 ${equationObj["num2"]}`;

		calculate(equationString, currValueElem);

		preValueElem.textContent = `${equationString} =`;

		newNumberFlag = true;
		itemArray = [];
		console.log(equationArray);
	});

	const clearButtons = document.querySelectorAll(".clear, .clearEntry");
	clearButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			currValueElem.value = 0;
			if (event.target.classList.contains("clear")) {
				preValueElem.textContent = "0";
				itemArray = [];
			}
		});
	});

	const deleteButton = document.querySelector(".delete");
	deleteButton.addEventListener("click", () => {
		currValueElem.value = currValueElem.value.slice(0, -1);
	});

	const signChangeButton = document.querySelector(".signChange");
	signChangeButton.addEventListener("click", () => {
		currValueElem.value = parseFloat(currValueElem.value) * -1;
	});
};

// keybord input
const buttons = document.getElementsByTagName("button");

document.addEventListener(
	"keyup",
	function (event) {
		if (event.keyCode != 13) {
			for (let i = 0; i < buttons.length; i++) {
				let id = buttons[i].getAttribute("data-id");

				if (id == event.key) {
					buttons[i].click();
				}
			}
		} else {
			document.getElementsByClassName(".equals").click();
		}
	},
	false
);

document.addEventListener("DOMContentLoaded", initApp);

const calculate = (equation, currValueElem) => {
	const regex = /(^[*/=])| (\s)/g;
	equation.replace(regex, "");
	const divByZero = /(\/0)/.test(equation);
	if (divByZero) return (currValueElem.value = "0");
	return (currValueElem.value = eval(equation));
};
