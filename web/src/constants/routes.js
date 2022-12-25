import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

export const MAIN = '/'
export const DASHBOARD = '/dashboard'
export const USER = '/users'
export const ORDERS = '/orders'
export const ZIPCODES = '/zipcodes'
export const FEEDBACK = '/feedback'
export const REQUEST = '/requests'
export const REQUESTDETAILS = '/requests/:id'

export const SIDEBAR = (
  <React.Fragment>
    <ListItemButton>
      <ListItemText primary='Dashboard' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Users' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Zip Codes' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Requests' />
    </ListItemButton>
    <ListItemButton>
      <ListItemText primary='Feedback' />
    </ListItemButton>
  </React.Fragment>
)
