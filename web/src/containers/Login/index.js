import * as React from 'react'
import { useContext } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth'
import AppContext from '../../Context'
import { useEffect } from 'react'

export default function Login () {
  const navigate = useNavigate()
  const { _getDashboard, setUser } = useContext(AppContext)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = localStorage.getItem('user')
      setUser(JSON.parse(user))
      navigate('/dashboard')
      return
    }
  }, [])
  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const data = new FormData(event.currentTarget)
      const payload = {
        email: data.get('email'),
        password: data.get('password')
      }
      const res = await loginUser(payload)
      if (res?.data?.user?.is_admin) {
        localStorage.setItem('token', res?.data?.token)
        localStorage.setItem('user', JSON.stringify(res?.data?.user))
        setUser(res?.data?.user)
        _getDashboard()
        navigate('/dashboard')
      } else {
        alert('Please use admin credentials!')
      }
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
