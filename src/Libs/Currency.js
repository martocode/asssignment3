export const convert = (getRates, base, select) => {
	const logic = (n) => (getInput) => {
		if (!n) return getInput;
		if (n === "buy") {
			getInput *= 1.02;
		}
		if (n === "sell") {
			getInput *= 0.98;
		}

		return getInput;
	};
	return (to_currency, getInput) => {
		return (n) => {
			const calculate = logic(n);

			if (!getInput) return 0;
			if (select === base) {
				if (to_currency === base) {
					return calculate(getInput);
				}
				getInput *= getRates[to_currency];
				return calculate(getInput);
			}
			if (to_currency !== base) {
				getInput = getRates[select] / getRates[to_currency];
				// (getInput / getRates[select]) * getRates[to_currency];
				return calculate(getInput);
			} else {
				getInput /= getRates[select];
				return calculate(getInput);
			}
		};
	};
};

export const currFormat = (select) => (number) => {
	return Intl.NumberFormat("ja-JP", {
		style: "currency",
		currency: select,
	}).format(
		number
		// .toFixed(3)
	);
};
