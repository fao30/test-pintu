"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { OrderBook } from "@lab49/react-order-book";
import { DecimalFunction } from "@/helpers/decimalFunctions";
import HashLoader from "react-spinners/HashLoader";

const WebSocketPage = () => {
  const [time, setTime] = useState({
    series: [
      {
        data: [
          {
            x: new Date(1538778600000),
            y: [6629.81, 6650.5, 6623.04, 6633.33],
          },
        ],
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: "ETH/USDT",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [askBid, setAskBid] = useState({
    asks: [["0", "0"]],
    bids: [["0", "0"]],
  });
  const makeNewCandle = useRef(false);

  useEffect(() => {
    console.log(
      process.env.NEXT_PUBLIC_ENV_VARIABLE,
      "<<<<---------------BINANCE_KEY"
    );
    const streamName = "/ethusdt@kline_1m";
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_ENV_VARIABLE + streamName
    );

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (candle) => {
      const candleData = JSON.parse(candle.data);
      const tempCandle = { ...time };
      const latestCandle = tempCandle.series[0]?.data;
      const newData = {
        x: new Date(candleData?.E),
        y: [
          candleData?.k?.o,
          candleData?.k?.h,
          candleData?.k?.c,
          candleData?.k?.l,
        ],
      };

      if (makeNewCandle.current) {
        latestCandle.push(newData);
        makeNewCandle.current = false;
      } else {
        latestCandle[latestCandle.length - 1] = newData;
      }
      setTime({
        ...time,
        series: [
          {
            data: latestCandle,
          },
        ],
      });
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const interval = setInterval(() => {
      makeNewCandle.current = true;
      console.log("Logs every 60 secs");
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const streamName = "/ethusdt@depth";
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_ENV_VARIABLE + streamName
    );

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      setIsLoading(false);
      const data = JSON.parse(event.data);
      setAskBid({
        asks: DecimalFunction(data?.a),
        bids: DecimalFunction(data?.b),
      });
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex w-full h-full  justify-center items-center">
        <div className="py-5">
          {isLoading ? (
            <div className="mt-[15rem]">
              <HashLoader size={100} color="#36d7b7" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              <ReactApexChart
                options={time.options}
                series={time.series}
                type="candlestick"
                height={450}
                width={850}
              />
              <OrderBook
                layout="row"
                listLength={18}
                showHeaders
                applyBackgroundColor
                showSpread={false}
                book={askBid}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketPage;
