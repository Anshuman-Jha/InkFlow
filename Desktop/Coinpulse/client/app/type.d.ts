export interface TrendingCoinItem {
    id: string;
    name: string;
    symbol: string;
    large: string;
    new: string;
    data: {
        price_change_percentage_24h: {
            usd: number;
        };
    };
}

export interface TrendingCoin {
    item: TrendingCoinItem;
}

export interface DataTableColumn<T> {
    header: React.ReactNode;
    cell: (row: T, index: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
}


export interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T, index: number) => React.Key;
    tableClassName?: string;
    headerClassName?: string;
    headerRowClassName?: string;
    headerCellClassName?: string;
    bodyRowClassName?: string;
    bodyCellClassName?: string;
}

export interface CoinDetailsData {
    id: string;
    name: string;
    symbol: string;
    assets_platform_id?: string | null;
    detail_platforms?: Record<string, {
        geckoterminal_url: string;
        contract_address: string;
    }
    >;
    image: {
        large: string;
        contract_address: string
    };
    market_data: {
        current_price: {
            usd: number;
            [key: string]: number;
        };
        price_change_24h_in_currency: {
            usd: number;
        };
        price_change_percentage_24h_in_currency: {
            usd: number;
        }
    }
}

export type CoinGeckoErrorBody = {
    error: string
}