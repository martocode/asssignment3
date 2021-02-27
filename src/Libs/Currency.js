export const convert = (getRates, base, select) => (to_currency, getInput) => {
	return (n) => {
		const logic = (n) => (getInput) => {
			if (n === 0) {
				getInput = getInput * 1.02;
				// getInput *= getRates[to_currency] * 1.02;
			}
			if (n === 1) {
				getInput = getInput * 0.98;
				// getInput *= getRates[to_currency] * 0.98;
			}
			if (n === undefined) {
				getInput = getInput;
			}
			return getInput;
		};
		let notBase = true;
		const calculate = logic(n);

		if (getInput > 0) {
			// console.log(getInput, "getInput");
			if (to_currency !== base) {
				getInput =
					(getInput / getRates[select]) * getRates[to_currency];
				return calculate(getInput);
			} else {
			}

			// return currFormat(select)(getInput);
		} else if (getInput == 0 || getInput === undefined) {
			// getInput = "-";
			// console.log(getInput, "input");
			return 0;
		}
	};
};

export const currFormat = (select) => (number) => {
	return Intl.NumberFormat({ style: "currency", currency: select }).format(
		number
		// .toFixed(3)
	);
};
