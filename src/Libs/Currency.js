export const convert = (getRates, base, select) => (to_currency, getInput) => {
	return (n) => {
		let result;
		const formater = currFormat(select);
		let currNum = new Promise((e) => e())
			// .then(() => console.log(getInput, "x before", to_currency))
			.then(() => {
				return (getInput / getRates[select]) * getRates[to_currency];
			});
		/* .then((curr) => {
				console.log(curr, "x", to_currency);
				return curr;
			}); */
		// let result;

		let test = (async () => {
			let curr = await currNum;
			// console.log(curr, "curr");
			/* if (n === 0) {
				// console.log(curr, "0 before", to_currency);
				result = curr * 1.02;
				// console.log(getInput);
			} else if (n === 1) {
				result = curr * 0.98;
			} else if (n === undefined) {
				result = curr;
			} */
			// result = curr;
			return curr;
		})(n);
		// if (result) {
		// console.log(formater(test), "result");
		// return result;
		// }
	};
};

export const currFormat = (select) => (number) => {
	return Intl.NumberFormat({ style: "currency", currency: select }).format(
		number
	);
};
// export default convert;
