import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Row, Col, Table, Space, Card, Typography, Select, Input } from "antd";
import "antd/dist/antd.css";
import { convert, currFormat, logic } from "./Libs/Currency";
const { Option } = Select;

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
	//States

	const tableRef = useRef();
	const [getData, setData] = useState([]);
	const [getRates, setRates] = useState([]);
	const [getInput, setInput] = useState();
	const [getBase, setBase] = useState([]);
	const [getSelect, setSelect] = useState();
	const [getRateText, setRateText] = useState();

	// vars

	const currencies = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];
	const selected = getSelect || "IDR";
	const child = (curr) => currencies.indexOf(curr);

	const selectBefore = (
		<Select
			defaultValue="IDR"
			className="select-before"
			onChange={(e) => {
				setSelect(e);
				changeNum(e);
			}}
		>
			{currencies.map((v, k) => {
				return (
					<Option value={v} key={k}>
						{v}
					</Option>
				);
			})}
		</Select>
	);

	const changeSource = (currGenerator) => {
		return currencies.map((v, k) => {
			let converter = currGenerator(v, getInput);
			const formatter = currFormat(v);
			const [buy, normal, sell] = [logic("buy"), logic(), logic("sell")];

			return {
				key: k + 1,
				foreign: v,
				buy: formatter(buy(converter)),
				rate: formatter(normal(converter)),
				sell: formatter(sell(converter)),
			};
		});
	};

	const onChangeInput = (e) => {
		const num = e.target.value === "-" ? 0 : Number(e.target.value);
		setInput(num);
	};

	const changeNum = (select) => {
		const currGenerator = convert(getRates, getBase, select);
		return changeSource(currGenerator);
	};

	const renderData = async () => {
		const result = await axios.get(
			"https://api.exchangeratesapi.io/latest"
		);
		setRates(result?.data.rates);
		setBase(result?.data.base);
		setData(changeNum(selected));
	};

	const rateToLabel = () => getRates[selected] || 1 / getRates["IDR"];

	useEffect(() => {
		renderData();
	}, []);

	useEffect(() => {
		setData(changeNum(selected));
		setRateText(rateToLabel());
	}, [getInput, getSelect]);

	return (
		<Row>
			<Col lg={{ span: 12, offset: 2 }}>
				<Space direction="vertical">
					<Card
						className="table"
						title="Table Chart Stock"
						style={{ width: 900 }}
					>
						<Input.Group compact>
							<Input
								className="input"
								addonBefore={selectBefore}
								type="number"
								min="0"
								onChange={onChangeInput}
							/>
							<Typography.Text className="value">
								{getRateText}
							</Typography.Text>
						</Input.Group>
						<Table
							pagination={false}
							className="inner table"
							rowClassName={(record, index) => {
								if (child(selected) === index) {
									return "row active";
								}
							}}
							ref={tableRef}
							style={{ whiteSpace: "pre" }}
							dataSource={getData}
							columns={columns}
						/>
					</Card>
				</Space>
			</Col>
		</Row>
	);
};

export default App;
