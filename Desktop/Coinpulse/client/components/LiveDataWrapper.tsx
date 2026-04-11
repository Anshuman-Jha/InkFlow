import { CoinDetailsData, OHLCData, Trade } from "@/app/type"
import React, { useState } from "react"
import { Separator } from "@/components/ui/separator"
import CandleStickChart from "./CandleStickChart"
import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket"
import { DataTableColumn } from "@/app/type"
import { formatCurrency } from "@/lib/utils"
import DataTable from "./DataTable"
import CoinHeader from "./CoinHeader"

interface LiveDataWrapperProps {
    coinId: string,
    poolId: string
    coin: CoinDetailsData,
    coinOHLCData: OHLCData[]
    children: React.ReactNode
};

export default function LiveDataWrapper({ coinId, poolId, coin, coinOHLCData }: LiveDataWrapperProps) {

    const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s');
    const { trades, ohlcv } = useCoinGeckoWebSocket({ coinId, poolId, liveInterval });

    const tradeColumns: DataTableColumn<Trade>[] = [
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (trade) => (trade.price ? formatCurrency(trade.price) : '-'),
        },
        {
            header: 'Amount',
            cellClassName: 'amount-cell',
            cell: (trade) => trade.amount?.toFixed(4) ?? '-',
        },
        {
            header: 'Value',
            cellClassName: 'value-cell',
            cell: (trade) => (trade.value ? formatCurrency(trade.value) : '-'),
        },
        {
            header: 'Buy/Sell',
            cellClassName: 'type-cell',
            cell: (trade) => (
                <span className={trade.type === 'b' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type === 'b' ? 'Buy' : 'Sell'}
                </span>
            ),
        },
        {
            header: 'Time',
            cellClassName: 'time-cell',
            cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : '-'),
        },
    ];


    return (
        <section id="live-data-wrapper">
            <CoinHeader />
            <Separator className="divider" />

            <div className="trend">
                <CandleStickChart
                    coinId={coinId}
                    data={coinOHLCData}
                    liveOhlcv={ohlcv}
                    mode="live"
                    initialPeriod="daily"
                    liveInterval={liveInterval}
                    setLiveInterval={setLiveInterval}
                >
                    <h4>Trend Overview</h4>
                </CandleStickChart>
            </div>

            <Separator className="divider" />

            {tradeColumns && (

                <div className="trades">
                    <h4>Recent Trades</h4>

                    <DataTable
                        columns={tradeColumns}
                        data={trades}
                        rowKey={(_, index) => index}
                        tableClassName="trades-table" />

                </div>

            )}

        </section>
    );

}