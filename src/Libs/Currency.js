export const convert = (getRates, base, select) => (to_currency, getInput) => {
	return (n) => {
		let notBase = true;
		// getInput /= getRates[select];

		if (n === 0) {
			getInput = getInput * getRates[to_currency] * 0.98;
			// getInput *= getRates[to_currency] * 1.02;
		} else if (n === 1) {
			getInput = getInput * getRates[to_currency] * 0.98;
			// getInput *= getRates[to_currency] * 0.98;
		} else if (n === undefined) {
			getInput = getInput * getRates[to_currency];
		}

		// return currFormat(select)(getInput);
		return getInput;
	};
};

export const currFormat = (select) => (number) => {
	return Intl.NumberFormat({ style: "currency", currency: select }).format(
		number
	);
};
