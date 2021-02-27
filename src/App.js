import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
	Row,
	Col,
	Table,
	Space,
	Card,
	Typography,
	Select,
	Input,
	InputNumber,
} from "antd";
import "antd/dist/antd.css";
import { convert, currFormat } from "./Libs/Currency";
const { Option } = Select;

const round = (amount) => Number(amount.toFixed(5));

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
	/**
	 * States
	 */
	const tableRef = useRef();
	const [getData, setData] = useState([]);
	const [getRates, setRates] = useState([]);
	const [getInput, setInput] = useState();
	const [load, setload] = useState();
	const [getOpt, setOpt] = useState([]);
	const [getBase, setBase] = useState([]);
	const [getSelect, setSelect] = useState();

	/**
	 * vars
	 */
	const currencies = ["CAD", "IDR", "JPY", "CHF", "EUR", "USD"];
	const selected = getSelect || "IDR";
	const formatter = currFormat(selected);
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
			let converted = currGenerator(v, getInput);
			// console.log(converted);
			return {
				key: k + 1,
				foreign: v,
				buy: converted(0),
				rate: converted(),
				sell: converted(1),
			};
		});
	};

	const onChangeInput = (e) => {
		const num = Number(e.target.value);
		// console.log(formatter);
		// setInput(formatter(num));
		setInput(num);
	};

	const changeNum = (select) => {
		const currGenerator = convert(getRates, getBase, select);

		// console.log(getInput, "getInput");

		// console.log(maps, "maps");
		return changeSource(currGenerator);
	};

	const onChangeValue = () => {
		const currGenerator = convert(
			getRates,
			getBase,
			selected
		)(selected, getInput);
		// console.log(convert(getRates, getBase, selected), "cccc");

		return currGenerator();
	};

	const renderData = async () => {
		const result = await axios.get(
			"https://api.exchangeratesapi.io/latest"
		);
		setRates(result?.data.rates);
		setBase(result?.data.base);
		setData(changeNum(selected));
		setload(true);
	};

	useEffect(() => {
		renderData();
	}, []);

	useEffect(() => {
		setData(changeNum(selected));
	}, [getInput, getSelect]);

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
						<Input.Group compact>
							<Input
								className="input"
								addonBefore={selectBefore}
								type="number"
								onChange={onChangeInput}
							/>
							<Typography.Text className="value">
								Hahaha
								{(() => {
									const curr = convert(
										getRates,
										getBase,
										selected
									)(selected, getInput);
									console.log(
										selected,
										"selected",
										curr(),
										"curr(selected, getInput)"
									);
									return getRates[selected] || "";
								})()}
							</Typography.Text>
							{/* <h1 className="value">
								{(() => {
									onChangeValue();
									console.log(onChangeValue(), "acc");
								})()}
							</h1> */}
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
