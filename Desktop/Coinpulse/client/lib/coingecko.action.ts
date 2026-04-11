'use server'
import 'dotenv/config'

import qs from 'query-string';
import { CoinGeckoErrorBody, PoolData, SearchCoin } from '@/app/type';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');


export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60 * 60 * 24,

): Promise<T> {

    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${endpoint}`,
        query: params,
    }, { skipEmptyString: true, skipNull: true });

    const res = await fetch(url, {
        headers: {
            "x-cg-demo-api-key": API_KEY,
            "Content-Type": "application/json",
        } as Record<string, string>,
        next: {
            revalidate,
        },
    });

    if (!res.ok) {

        const errorBody: CoinGeckoErrorBody = await res.json()
            .catch(() => ({}));

        throw new Error(`API Error: ${res.status}: ${errorBody.error || res.statusText}`);
    }

    return res.json();

}

export async function getPools(
    id: string,
    network?: string | null,
    contractAddress?: string | null,
): Promise<PoolData> {
    const fallback: PoolData = {
        id: '',
        address: '',
        name: '',
        network: '',
    };

    if (network && contractAddress) {
        try {
            const poolData = await fetcher<{ data: PoolData[] }>(
                `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
            );

            return poolData.data?.[0] ?? fallback;
        } catch (error) {
            console.log(error);
            return fallback;
        }
    }

    try {
        const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });

        return poolData.data?.[0] ?? fallback;
    } catch {
        return fallback;
    }
}


export async function searchCoins(query: string): Promise<SearchCoin[]> {
    try {
        const data = await fetcher<{ coins: SearchCoin[] }>('/search', { query });
        return data.coins || [];
    } catch (error) {
        console.error('Search API Error:', error);
        return [];
    }
}