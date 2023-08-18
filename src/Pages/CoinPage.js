import { LinearProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import { SingleCoin } from '../config/api'
import { numberWithCommas } from '../components/CoinsTable'
import { CryptoState } from '../CryptoContext'
import './CoinPage.css'

const CoinPage = () => {
  const { id } = useParams()
  const [coin, setCoin] = useState()

  const { currency, symbol } = CryptoState()
  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id))
    setCoin(data)
  }

  useEffect(() => {
    fetchCoin()
  }, [])

  if (!coin) return <LinearProgress style={{ backgroundColor: 'gold' }} />

  return (
    <div className='container'>
      <div className='sidebar'>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height='200'
          style={{ marginBottom: 20 }}
        />
        <Typography variant='h4' className='heading'>
          {coin?.name}
        </Typography>
      </div>
      <div className='content'>
        <Typography variant='subtitle1' className='description'>
          {ReactHtmlParser(coin?.description.en.split('. ')[0])}.
        </Typography>
        <div className='marketData'>
          <span className='data'>
            <Typography variant='h5' className='heading'>
              Rank:
            </Typography>
            <Typography variant='h5' className='value'>
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>
          <span className='data'>
            <Typography variant='h5' className='heading'>
              Current Price:
            </Typography>
            <Typography variant='h5' className='value'>
              {symbol}{' '}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span className='data'>
            <Typography variant='h5' className='heading'>
              Market Cap:
            </Typography>
            <Typography variant='h5' className='value'>
              {symbol}{' '}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CoinPage
