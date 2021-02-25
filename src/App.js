import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { Row, Col, Table, Space, Card, Typography, Select, Input } from "antd";
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
	const tableRef = useRef();
	const [getData, setData] = useState([]);
	const [getRates, setRates] = useState([]);
	const [getInput, setInput] = useState(26000);
	const [load, setload] = useState();
	const [getOpt, setOpt] = useState([]);
	const [getBase, setBase] = useState([]);
	const [getSelect, setSelect] = useState();
	const [getInputValue, setInputValue] = useState();
	const [inputOnchange, setInputOnchange] = useState(false);
	const [currentVal, setCurrentVal] = useState(0);
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

	const changeSource = () => {
		if (inputOnchange) {
			return getData;
		}
	};

	const changeNum = (select) => () => {
		const currGenerator = convert(getRates, getBase, select);

		// console.log(getInput, "getInput");
		const maps = currencies.map((v, k) => {
			let converted = currGenerator(v, getInput);
			return {
				key: k + 1,
				foreign: v,
				buy: converted(0),
				rate: converted(),
				sell: converted(1),
			};
		});
		return maps;
	};

	useEffect(() => {
		(async () => {
			if (getRates !== []) {
				// console.log("test");
				const result = await axios.get(
					"https://api.exchangeratesapi.io/latest"
				);
				setRates(result?.data.rates);
				setBase(result?.data.base);
			}
			/* else {
				setload(false);
			} */
			// setInput(26000);
			// const baseCurr = round(1 / getRates["IDR"]);

			setData(changeNum(selected));
			// setInputOnchange(true);
			// changeSource();
			/* setTabel(
				<Table
					style={{ whiteSpace: "pre" }}
					dataSource={getData}
					columns={columns}
				/>
			); */
			// setInputOnchange(false);
			setload(true);
		})();
	}, [load]);

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
						<Input
							value={currentVal}
							className="input currency"
							addonBefore={selectBefore}
							type="number"
							onChange={(e) => {
								const formatter = currFormat(selected);
								setload(false);
								const num = Number(e.target.value);
								const formatted = formatter(num);

								// let val = e.target.value.replace(
								// 	/(\..*)\./g,
								// 	"1"
								// );
								// var x = Number(val.replace(/,/g, ""));
								if (currentVal != num) {
									setInputValue(formatter(num));
									setCurrentVal(
										`${formatter(
											currentVal
										)}${getInputValue}`
									);
								} else {
									setCurrentVal(num);
								}

								// setInput(formatted);
								changeNum(selected);
								// setInputOnchange(false);
								console.log(currentVal, "formatted");
								// return formatted;
							}}
							// onPressEnter={}
						/>
						{/* {getTabel} */}
						<Table
							pagination={false}
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
	/* 	} else {
		console.log("addd");
		return <></>;
 	}*/
};

export default App;
