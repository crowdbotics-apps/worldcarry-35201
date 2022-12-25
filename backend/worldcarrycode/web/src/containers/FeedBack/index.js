import * as React from 'react'
import { Grid, Container } from '@mui/material'
import { Layout } from '../../components'
import AppTable from '../../components/AppTable'
import AppContext from '../../Context'
import { useContext } from 'react'
import { useState } from 'react'

const headCells1 = [
  {
    id: 'photo',
    numeric: false,
    label: ''
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'SENT BY'
  },
  {
    id: 'last_name',
    numeric: false,
    disablePadding: false,
    label: 'LAST NAME'
  },
  {
    id: 'content',
    numeric: false,
    disablePadding: true,
    label: 'FEEDBACK'
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'TYPE'
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'EMAIL'
  },
  {
    id: 'payment',
    numeric: false,
    disablePadding: false,
    label: 'PAYMENT'
  },
  {
    id: 'pickups',
    numeric: false,
    disablePadding: false,
    label: 'PICK UPS'
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: ''
  }
]
function FeedBackContent () {
  const { feedbacks } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: feedbacks
  })
  const { filteredList } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = feedbacks?.filter(entry =>
        Object.values(entry?.user).some(
          val => typeof val === 'string' && val.match(re)
        )
      )
      handleChange('filteredList', filtered)
    } else {
      handleChange('filteredList', feedbacks)
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
                placeholder='SEARCH USERS'
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
        </Grid>
        {feedbacks && (
          <AppTable
            feedback
            rows={filteredList}
            headingLeft={'Feedback recieved'}
            headingRight={''}
            headCells={headCells1}
          />
        )}
      </Container>
    </Layout>
  )
}

export default function FeedBack () {
  return <FeedBackContent />
}
