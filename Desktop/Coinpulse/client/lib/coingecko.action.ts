'use server'
import 'dotenv/config'

import qs from 'query-string';
import { CoinGeckoErrorBody } from '@/app/type';

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