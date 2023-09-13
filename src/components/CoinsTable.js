import React, { useState, useEffect } from 'react'
import { CoinList } from '../config/api'
import { CryptoState } from '../CryptoContext'
import axios from 'axios'
import { makeStyles } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Pagination from '@mui/material/Pagination'

export function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const useStyles = makeStyles({
  row: {
    backgroundColor: '#16171a',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#131111'
    },
    fontFamily: 'Montserrat'
  },
  pagination: {
    '& .MuiPaginationItem-root': {
      color: 'gold'
    }
  }
})

const CoinsTable = () => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const { currency, symbol } = CryptoState()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const classes = useStyles()
  const navigate = useNavigate()
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  const fetchCoins = async () => {
    setLoading(true)
    const { data } = await axios.get(CoinList(currency))
    setCoins(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCoins()
  }, [currency])
  const handleSearch = () => {
    if (search === '') {
      return coins // Return all coins when search is empty
    }

    const lowerCaseSearch = search.toLowerCase()

    return coins.filter(
      coin =>
        coin.name.toLowerCase().includes(lowerCaseSearch) ||
        coin.symbol.toLowerCase().includes(lowerCaseSearch)
    )
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: 'center' }}>
        <Typography
          variant='h4'
          style={{ margin: 18, fontFamily: 'Montserrat' }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label='Search For a Crypto Currency..'
          variant='outlined'
          style={{ marginBottom: 20, width: '100%' }}
          onChange={e => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: 'gold' }} />
          ) : (
            <Table aria-label='simple table'>
              <TableHead style={{ backgroundColor: '#EEBC1D' }}>
                <TableRow>
                  {['Coin', 'Price', '24h Change', 'Market Cap'].map(head => (
                    <TableCell
                      style={{
                        color: 'black',
                        fontWeight: '700',
                        fontFamily: 'Montserrat'
                      }}
                      key={head}
                      align={head === 'Coin' ? '' : 'right'}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map(row => {
                    const profit = row.price_change_percentage_24th > 0
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component='th'
                          scope='row'
                          style={{
                            display: 'flex',
                            gap: 15
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height='50'
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <span
                              style={{
                                textTransform: 'uppercase',
                                fontSize: 22
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: 'darkgrey' }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align='right'>
                          {symbol}{' '}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{
                            color:
                              row.price_change_percentage_24h > 0
                                ? 'green'
                                : 'red',
                            fontWeight: 500
                          }}
                        >
                          {row.price_change_percentage_24h && '+'}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align='right' color='white'>
                          {symbol}{' '}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            padding: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value)
            window.scroll(0, 450)
          }}
        />
      </Container>
    </ThemeProvider>
  )
}

export default CoinsTable
