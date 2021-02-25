import { Card, Col, Input, Row, Select, Space, Table, Typography } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { convert, currFormat } from "./Libs/Currency";

const { Option } = Select;

const columns = [
	{
		dataIndex: "foreign",
		key: "foreign",
		fixed: "left",
	},
	{
		title: <Typography.Text className="title">WE BUY</Typography.Text>,
		dataIndex: "buy",
		key: "buy",
		fixed: "left",
	},
	{
		title: (
			<Typography.Text className="title wrap">
				EXCHANGE RATE
			</Typography.Text>
		),
		dataIndex: "rate",
		key: "rate",
		fixed: "left",
		width: 20,
	},
	{
		title: <Typography.Text className="title">WE SELL</Typography.Text>,
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
	const [rawData, setRawData] = useState([]);
	const [selectedCurrency, setSelectedCurrency] = useState();

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

	const changeNum = (select) => () => {
		const currGenerator = convert(getRates, getBase, select);

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

	const onchangeInput = (e) => {
		return e.target.value;
	};

	const onChangeSelect = (val) => {
		const selectData = rawData.rates[val];
		setSelectedCurrency();
	};

	useEffect(() => {
		(async () => {
			if (getRates !== []) {
				const result = await axios.get(
					"https://api.exchangeratesapi.io/latest"
				);
				setRates(result?.data.rates);
				setBase(result?.data.base);
			}
			setData(changeNum(selected));
			setload(true);
		})();
	}, [load]);

	useEffect(() => {
		changeNum(selected)();
		console.log("change input");
	}, [getInput]);

	useEffect(() => {
		if (!rawData) {
		}
	}, [rawData]);

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
							// value={currentVal}
							className="input currency"
							addonBefore={selectBefore}
							type="number"
							onChange={(e) => {
								const formatter = currFormat(selected);
								const num = Number(e.target.value);
								// setload(false);
								setInput(e.target.value);
								changeNum(selected);
								// setload(true);
								const formatted = formatter(num);
							}}
						/>
						<Table
							pagination={false}
							rowClassName={(record, index) => {
								// console.log(record);
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
