import React from "react";
import { LiveCoinHeaderProps } from "@/app/type";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TruckElectricIcon } from "lucide-react";

export default function CoinHeader({ name, image, livePrice, livePriceChangePercentage24h, priceChangePercentage30d, priceChange24h }: LiveCoinHeaderProps) {

    const isTrendingUp = livePriceChangePercentage24h > 0;
    const isThirtyDayUp = priceChangePercentage30d > 0;
    const isPriceChangeUp = priceChange24h > 0;

    const stats = [
        {
            label: 'Today',
            value: livePriceChangePercentage24h,
            isUp: isTrendingUp,
            formatter: formatPercentage,
            showIcon: true
        },
        {
            label: '30 Days',
            value: priceChangePercentage30d,
            isUp: isThirtyDayUp,
            formatter: formatPercentage,
            showIcon: true
        },
        {
            label: 'Price Change (24h)',
            value: priceChange24h,
            isUp: isPriceChangeUp,
            formatter: formatCurrency,
            showIcon: true
        }
    ];


    return (
        <>
        </>
    )

}

