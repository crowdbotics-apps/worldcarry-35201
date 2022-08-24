import * as React from 'react'
import { Grid, Container, TextField } from '@mui/material'
import { Layout } from '../../components'
import AppTable from '../../components/AppTable'
import { useContext } from 'react'
import AppContext from '../../Context'
import { useState } from 'react'
import { deleteUser, updateUser } from '../../api/admin'
import { useEffect } from 'react'

const headCells1 = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'FIRST NAME'
  },
  {
    id: 'pickup',
    numeric: false,
    disablePadding: false,
    label: 'PICK UPS'
  },
  {
    id: 'last_name',
    numeric: false,
    disablePadding: false,
    label: 'LAST NAME'
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
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: ''
  }
]
function UsersContent () {
  const { allUsers, _getAllUsers } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: allUsers
  })
  const { filteredList } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (allUsers) {
      handleChange('filteredList', allUsers)
    }
  }, [allUsers])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = allUsers?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === 'string' && val.match(re)
        )
      )
      handleChange('filteredList', filtered)
    } else {
      handleChange('filteredList', allUsers)
    }
  }

  const _updateUser = async (id, flag, is_active) => {
    try {
      const token = localStorage.getItem('token')
      const payload = {
        flag
      }
      if (is_active) {
        payload.is_active = true
        delete payload.flag
      }
      await updateUser(id, payload, token)
      _getAllUsers()
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _deleteUser = async id => {
    try {
      const token = localStorage.getItem('token')
      await deleteUser(id, token)
      _getAllUsers()
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
                placeholder='Search users'
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
        </Grid>
        {/* {filteredList?.length > 0 && ( */}
          <AppTable
            rows={[]}
            flagAction={_updateUser}
            deleteAction={_deleteUser}
            approval
            rowsPage={15}
            headingLeft={'All Users'}
            headingRight={''}
            headCells={headCells1}
          />
        {/* )} */}
      </Container>
    </Layout>
  )
}

export default function Users () {
  return <UsersContent />
}
