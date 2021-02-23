import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import { Row, Col, Table, Space, Card, Typography } from "antd";
import "antd/dist/antd.css";

const lists = [
	{
		key: "1",
		foreign: "CAD",
		buy: 5,
		rate: 1222,
		sell: 444,
	},
	{
		key: "2",
		foreign: "IDR",
		buy: 5,
		rate: 1222,
		sell: 444,
	},
	{
		key: "3",
		foreign: "JPY",
		buy: 5,
		rate: 1222,
		sell: 444,
	},
	{
		key: "4",
		foreign: "CHF",
		buy: 5,
		rate: 1222,
		sell: 444,
	},
];

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

const App = () => {
	const [getData, setData] = useState([]);
	const currencies = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];
	let getRates;

	useEffect(() => {
		(async () => {
			const result = await axios.get(
				"https://api.exchangeratesapi.io/latest"
			);
			const data = result?.data.rates;
			setData(
				currencies.map((v, k) => {
					if (v !== "EUR") {
						return {
							key: k + 1,
							foreign: v,
							buy: 2 + data[v],
							rate: data[v],
							sell: data[v] - 1,
						};
					} else {
						return {
							key: k + 1,
							foreign: "EUR",
							buy: 2 + 0.000058148,
							rate: 0.000058148,
							sell: 0.000058148,
						};
					}
				})
			);
		})();
	}, []);

	// if (getData) {
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
	/* 	} else {
		console.log("addd");
		return <></>;
 	}*/
};

export default App;
