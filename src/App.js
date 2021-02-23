import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { Row, Col, Table, Space, Card, Typography } from "antd";
import "antd/dist/antd.css";

const App = () => {
	const [getData, setData] = useState();
	let getRates;

	// const titleWidth = { width: 100 };
	// const titleSize = { fontSize: 20 };
	// const fontWidth = { fontWeight: 700 };
	// const titleStyle = { ...titleWidth, ...titleSize, ...fontWidth };
	const convert = (to_currency, amount) => {
		if (getRates) {
			amount = amount / getRates["IDR"];
			console.log(to_currency, amount);

			if (to_currency === "EUR") {
				amount = amount;
			} else {
				amount = amount * getRates[to_currency];
			}
			return (n) => {
				if (n) {
					if (n === 0) {
						amount *= 102 / 100;
						console.log(amount, "amount");
					} else amount *= 98 / 100;
					return Number(amount.toFixed(5));
				} else return Number(amount.toFixed(5));
			};
		}
	};

	const currencies = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];

	const columns = [
		{
			dataIndex: "foreign",
			key: "foreign",
			fixed: "left",
		},
		{
			title: (
				<Typography.Text
					className="title"
					// style={{ ...titleSize, ...fontWidth }}
				>
					WE BUY
				</Typography.Text>
			),
			dataIndex: "buy",
			key: "buy",
			fixed: "left",
		},
		{
			title: (
				<Typography.Text
					className="title wrap"
					// style={titleStyle}
				>
					EXCHANGE RATE
				</Typography.Text>
			),
			dataIndex: "rate",
			key: "rate",
			fixed: "left",
			width: 20,
		},
		{
			title: (
				<Typography.Text
					className="title"
					// style={{ ...titleSize, ...fontWidth }}
				>
					WE SELL
				</Typography.Text>
			),
			dataIndex: "sell",
			key: "sell",
		},
	];

	useEffect(() => {
		axios
			.get("https://api.exchangeratesapi.io/latest")
			.then((res) => res.data.rates)
			.then((rate) => {
				getRates = rate;
				return currencies.map((v, k) => {
					let converted = convert(v, 26000);
					return {
						key: `${k + 1}`,
						foreign: `${v}`,
						buy: `${converted(0)}`,
						rate: `${converted()}`,
						sell: `${converted(1)}`,
					};
				});
			})
			.then((rate) => {
				setData(rate);
			});
	}, []);

	if (getData) {
		console.log("loaded");
		return (
			<Row>
				<Col lg={{ span: 12, offset: 2 }}>
					<Space direction="vertical">
						<Card
							className="table"
							title="Table Chart Stock"
							style={{ width: 900 }}
						>
							<Table
								style={{ whiteSpace: "pre" }}
								dataSource={getData}
								columns={columns}
							/>
						</Card>
					</Space>
				</Col>
			</Row>
		);
	} else {
		console.log("addd");
		return <></>;
	}
};

export default App;
