import React, { Suspense } from 'react'
import CoinOverview from '@/components/home/CoinOverview'
import TrendingCoins from '@/components/home/TrendingCoin'
import TrendingCoinFallback from '@/components/home/TrendingCoinFallback'
import CoinOverviewFallback from '@/components/home/CoinOverviewFallback'

const Page = async () => {

  return (
    <main className='main-container'>
      <section className="home-grid">
        <Suspense fallback={
          <CoinOverviewFallback />
        }>
          <CoinOverview />
        </Suspense>
        <Suspense fallback={
          <TrendingCoinFallback />
        }>
          <TrendingCoins />
        </Suspense>

      </section>

      <section className='w-full mt-7 space-y-4'>
        <p>Categories</p>
      </section>
    </main>
  )
}

export default Page;