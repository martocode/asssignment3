export const convert = (getRates, base, select) => (to_currency, getInput) => {
	return (n) => {
		let notBase = true;
		getInput /= getRates[select];

		if (to_currency !== base) {
			console.log(getInput, " before", to_currency);
			getInput *= getRates[to_currency];
			notBase = false;
		}
		if (n === 0) {
			getInput *= 1.02;
		} else if (n === 1) {
			getInput *= 0.98;
		} else if (n === undefined) {
		}

		return getInput;
	};
};
