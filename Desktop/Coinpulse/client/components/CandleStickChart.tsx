'use client';

import React, { useState, useRef, useTransition, useEffect } from 'react'
import { CandlestickChartProps } from '@/app/type';
import { getChartConfig, LIVE_INTERVAL_BUTTONS, PERIOD_BUTTONS } from '@/constants';
import { Period } from '@/app/type';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi, OhlcData } from 'lightweight-charts';
import { OHLCData } from '@/app/type';
import { fetcher } from '@/lib/coingecko.action';
import { PERIOD_CONFIG } from '@/constants';
import { convertOHLCData } from '@/lib/utils';
import { setInterval } from 'timers/promises';

const CandleStickChart = ({ children, data, coinId, height = 360, initialPeriod = 'daily', liveOhlcv = null, mode = 'historical', liveInterval, setLiveInterval }: CandlestickChartProps) => {

    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null); // holds chart instance across renders
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const prevOhlcDataLength = useRef<number>(data?.length || 0);

    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    // whenever we change period we can refetch the data
    const fetchOHLCData = async (selectedPeriod: Period) => {

        try {
            const { days, interval } = PERIOD_CONFIG[selectedPeriod];

            const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days: days,
                interval: interval,
                precision: "full"
            });
            // not blocking for the ui => start transition 
            startTransition(() => {
                setOhlcData(newData ?? []);
            });

            setOhlcData(newData ?? []);
        }
        catch (e) {
            console.error('Error fetching OHLC data', e);
        }
    }

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;

        setPeriod(newPeriod);
        fetchOHLCData(newPeriod);

    };

    // take data from props and append/set it to the chart
    useEffect(() => {

        const container = chartContainerRef.current;

        if (!container) {
            return;
        }

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);

        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth,
        });

        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

        const convertedToSeconds = ohlcData.map(
            (item) => [
                Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]
            ] as OHLCData
        );

        series.setData(convertOHLCData(convertedToSeconds));
        chart.timeScale().fitContent();

        chartRef.current = chart;
        candleSeriesRef.current = series;

        // web api to respond to the dimension according to Viewport
        // takes in the resizing entries i.e the array of entries
        const observer = new ResizeObserver((entries) => {
            if (!entries.length) return;

            chart.applyOptions({ width: entries[0].contentRect.width });

        });

        observer.observe(container);

        // we have to cleanup
        return () => {
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        };

    }, [height, period]);

    // SideEffect that is going to chang on the basis of period / ohlcData
    useEffect(() => {
        if (!candleSeriesRef.current) {
            return;
        }

        const convertedToSeconds = ohlcData.map(
            (item) => [
                Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]
            ] as OHLCData
        );


        // Live Realtime Chart Renderiing Logic
        let merged: OHLCData[];
        // if we are tracking the live data
        if (liveOhlcv) {
            const liveTimestamp = liveOhlcv[0];

            const lastHistoricalCandle = convertedToSeconds[convertedToSeconds.length - 1];

            if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
                merged = [...convertedToSeconds.slice(0, -1), liveOhlcv];
            }
            else {
                merged = [...convertedToSeconds, liveOhlcv];
            }
        }
        else {
            merged = convertedToSeconds;
        }

        merged.sort((a, b) => a[0] - b[0]);

        const converted = convertOHLCData(merged);

        candleSeriesRef.current.setData(converted);
        chartRef.current?.timeScale().fitContent();

        const dataChanged = prevOhlcDataLength.current !== ohlcData.length;

        if (dataChanged || mode === 'historical') {
            chartRef.current?.timeScale().fitContent();
            prevOhlcDataLength.current = ohlcData.length;
        }

    }, [ohlcData, period, liveOhlcv, mode]);

    return (
        <div id="candlestick-chart">
            <div className='chart-header'>
                <div className='flex-1'>
                    {children}
                </div>
                <div className='button-group'>
                    <span className='text-sm mx-2 font-medium text-purple-100/50'>Period:</span>
                    {PERIOD_BUTTONS.map(({ value, label }) => (
                        <button key={value} className={period === value ? 'config-button-active' : 'config-button'} onClick={() => handlePeriodChange(value)} disabled={loading}>
                            {label}
                        </button>
                    ))}

                </div>

                {liveInterval && <div className='button-group'>
                    <span className='texy-sm mx-2 font-medium text-purple-100/50'>
                        Update Frequency:
                    </span>
                    {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
                        <button key={value} className={liveInterval === value ? 'config-button-active' : 'config-button'} onClick={() => setLiveInterval && setLiveInterval(value)} disabled={isPending}>
                            {label}
                        </button>
                    ))}

                </div>}

            </div>

            <div ref={chartContainerRef} className='chart' style={{ height }} />

        </div>
    );
};

export default CandleStickChart