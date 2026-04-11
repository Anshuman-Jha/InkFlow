import React from 'react'
import { fetcher } from '@/lib/coingecko.action';
import { CoinDetailsData } from '@/app/type';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import CoinOverviewFallback from './CoinOverviewFallback';
import { OHLCData } from '@/app/type';
import CandleStickChart from '../CandleStickChart';
import { CandlestickChartProps } from '@/app/type';

const CoinOverview = async () => {

    try {
        const [coin, coinOHLCData] = await Promise.all([
            // we don't apply await as all requests are fired parallely , await will make it sequential

            fetcher<CoinDetailsData>('/coins/bitcoin', {
                dex_pair_format: 'symbol'
            }),

            fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
                vs_currency: 'usd',
                days: 1,
                interval: 'hourly',
                precision: "full"
            }),

        ]);

        return (
            <div id="coin-overview">
                <CandleStickChart data={coinOHLCData} coinId="bitcoin">
                    <div className='header pt-2'>

                        <Image src={coin.image.large} alt={coin.name} width={56} height={56} />

                        <div className='info'>
                            <p>{coin.name} / {coin.symbol.toUpperCase()}</p>
                            <h1> {formatCurrency(coin.market_data.current_price.usd)}</h1>
                        </div>

                    </div>
                </CandleStickChart>
            </div>
        )

    }
    catch (error) {
        console.error('Error Fetching Coin Overview', error);
        return (
            <CoinOverviewFallback />
        )
    }

}

export default CoinOverview