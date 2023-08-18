import {
  AppBar,
  Container,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography
} from '@mui/material'

import { useNavigate } from 'react-router-dom'
import React from 'react'
import { CryptoState } from '../CryptoContext'
import { createTheme } from '@mui/material/styles'
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    h5: {
      fontWeight: 'bold'
    }
  }
})

const Header = () => {
  const navigate = useNavigate()
  const { currency, setCurrency } = CryptoState()

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography
              onClick={() => {
                navigate('/')
              }}
              variant='h5'
              style={{
                flex: 1,
                color: 'gold',
                fontFamily: 'Montserrat',
                cursor: 'pointer'
              }}
            >
              Crypto Hunter
            </Typography>
            <Select
              variant='outlined'
              style={{
                width: 100,
                height: 40,
                marginRight: 15
              }}
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'INR'}>INR</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  )
}
export default Header
