import * as React from 'react'
import { Grid, Container } from '@mui/material'
import { Layout } from '../../components'
import AppTable from '../../components/AppTable'
import AppContext from '../../Context'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { deleteOrder } from '../../api/admin'
import { useNavigate } from 'react-router-dom'

const headCells1 = [
  {
    id: 'sid',
    numeric: false,
    disablePadding: true,
    label: 'ID'
  },
  {
    id: 'pickup',
    numeric: false,
    disablePadding: false,
    label: 'PICK UP LOCATION'
  },
  {
    id: 'destination',
    numeric: false,
    disablePadding: false,
    label: 'DESTINATION'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'STATUS'
  },
  {
    id: 'total_price',
    numeric: false,
    disablePadding: false,
    label: 'COST'
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: ''
  }
]
function RequestContent () {
  const { orders, _getOrders } = useContext(AppContext)
  const navigate = useNavigate()
  const [state, setState] = useState({
    filteredList: orders
  })
  const { filteredList } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const onClickItem = id => {
    navigate(`/requests/${id}`)
  }

  useEffect(() => {
    if (orders) {
      handleChange('filteredList', orders)
    }
  }, [orders])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = orders?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === 'string' && val.match(re)
        )
      )
      handleChange('filteredList', filtered)
    } else {
      handleChange('filteredList', orders)
    }
  }

  const _deleteOrder = async id => {
    try {
      const token = localStorage.getItem('token')
      await deleteOrder(id, token)
      _getOrders()
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <Layout>
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          <div class='search'>
            <span class='form-element'>
              <span class='fa fa-search'></span>
              <input
                placeholder='SEARCH REQUESTS'
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
        </Grid>
        {orders && (
          <AppTable
            rows={filteredList}
            deleteAction={_deleteOrder}
            onClickItem={onClickItem}
            headingLeft={'GoBackz requests'}
            headingRight={''}
            nowarning
            headCells={headCells1}
          />
        )}
      </Container>
    </Layout>
  )
}

export default function Request () {
  return <RequestContent />
}
