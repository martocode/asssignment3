export const convert = (getRates, base, select) => (to_currency, getInput) => {
	return (n) => {
		if (to_currency !== base) {
			getInput = (getInput / getRates[select]) * getRates[to_currency];
		}
		// console.log(curr, "curr");
		if (n === 0) {
			// console.log(curr, "0 before", to_currency);
			getInput = getInput * 1.02;
			// console.log(getInput);
		} else if (n === 1) {
			getInput = getInput * 0.98;
		} else if (n === undefined) {
			getInput = getInput;
		}
		// result = curr;
		// if (result) {
		// console.log(formater(test), "result");
		// return result;
		// }
		return getInput;
	};
};

export const currFormat = (select) => (number) => {
	return Intl.NumberFormat({ style: "currency", currency: select }).format(
		number
	);
};
// export default convert;
