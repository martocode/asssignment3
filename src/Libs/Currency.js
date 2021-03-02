export const convert = (getRates, base, select) => (to_currency, getInput) => {
	if (!getInput) return 0;
	if (select === base) {
		if (to_currency === base) {
			return getInput;
		}
		getInput *= getRates[to_currency];
		return getInput;
	}
	if (to_currency !== base) {
		getInput *= getRates[to_currency] / getRates[select];
		return getInput;
	} else {
		getInput /= getRates[select];
		return getInput;
	}
};

export const currFormat = (select) => (number) => {
	return Intl.NumberFormat("ja-JP", {
		style: "currency",
		currency: select,
	}).format(number.toFixed(3));
};

export const logic = (type) => (getInput) => {
	if (!type) return getInput;
	if (type === "buy") {
		getInput *= 1.02;
	}
	if (type === "sell") {
		getInput *= 0.98;
	}

	return getInput;
};
