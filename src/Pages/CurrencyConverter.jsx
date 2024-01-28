import React, {useState} from "react";
import {message, Popover} from "antd";
import { handleConvertToUSD, handleConvertToRWF } from "../components/helperFunctions";


const CurrencyConverter = () => {
    const [toCurrency, setToCurrency] = useState("RWF");
    const [conversionInfo, setConversionInfo] = useState({rate: 0, amount: 0});
    const [convertedAmount, setConvertedAmount] = useState(0);

    const onConvert = () => {
        if (conversionInfo.rate === 0 || conversionInfo.amount === 0) {
            return message.error("Please rate or amount field is empty");
        }
        if (toCurrency === "RWF") {
            setConvertedAmount(handleConvertToRWF(conversionInfo.amount, conversionInfo.rate).toFixed(5));
        } else {
            setConvertedAmount(handleConvertToUSD(conversionInfo.amount, conversionInfo.rate).toFixed(5));
        }
    }

    const handleChange = (e) => {
        setConversionInfo(prevState => ({...prevState, [e.target.name]: e.target.value}));
    }

    const content = (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <div>
                    <p>FROM</p>
                    <select defaultValue="USD" className="bg-slate-300 rounded-md p-2" onChange={e => {
                        if (e.target.value === "USD") {
                            setToCurrency("RWF");
                        } else {
                            setToCurrency("USD");
                        }
                    }}>
                        <option value="USD">USD</option>
                        <option value="RWF">RWF</option>
                    </select>
                </div>
                <div>
                    <p>TO</p>
                    <p>{toCurrency}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <div>
                    <p>Rate</p>
                    <input id="rate" name="rate" onChange={handleChange} className="rounded-md p-2 border-2" onWheelCapture={event => event.target.blur()} type="number" />
                </div>
                <div>
                    <p>Amount</p>
                    <input id="amount" name="amount" onChange={handleChange} className="rounded-md p-2 border-2" onWheelCapture={event => event.target.blur()} type="number" />
                </div>
            </div>
            <div>
                <button className="bg-blue-200 rounded-md p-2 w-fit" onClick={onConvert}>Convert</button>
                <p>Result: {convertedAmount} {toCurrency}</p>
            </div>
        </div>
    )

    return (
        <div>
            <Popover content={content} title="CURRENCY CONVERTER" trigger="click">
                <button className="bg-slate-300 rounded-md p-2 w-fit">Currency Converter</button>
            </Popover>
        </div>
    )
}

export default CurrencyConverter;