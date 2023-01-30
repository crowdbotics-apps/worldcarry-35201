import * as React from 'react'
import { Grid, Container, Paper } from '@mui/material'
import { Layout } from '../../components'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'
import AppTable from '../../components/AppTable'
import AppContext from '../../Context'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUser, updateUser } from '../../api/admin'

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'ITEM'
  },
  {
    id: 'pickup',
    numeric: false,
    disablePadding: false,
    label: 'PICK UP'
  },
  {
    id: 'destination',
    numeric: false,
    disablePadding: false,
    label: 'DESTINATION'
  },
  {
    id: 'sid',
    numeric: false,
    disablePadding: false,
    label: 'ID'
  },
  {
    id: 'reports',
    numeric: false,
    disablePadding: false,
    label: 'REPORTS'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'STATUS'
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: ''
  }
]
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
function DashboardContent () {
  const { dashboard, _getAllUsers } = useContext(AppContext)
  const navigate = useNavigate()

  ChartJS.register(ArcElement, ChartTooltip, Legend)
  const data = {
    labels: false,
    datasets: [
      {
        label: '# of Votes',
        data: [dashboard?.orders?.waiting, dashboard?.orders?.active],
        backgroundColor: ['rgba(241, 241, 242, 1)', 'rgba(64, 199, 0, 1)']
      }
    ]
  }
  const data1 = {
    labels: false,
    datasets: [
      {
        label: '# of Votes',
        data: [5, 15],
        backgroundColor: ['rgba(241, 241, 242, 1)', 'rgba(255, 129, 24, 1)']
      }
    ]
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
        <Grid container spacing={3}>
          {/* <Grid item md={4}>
            <Paper className='chartPaper'>
              <Grid container alignItems={'center'}>
                <div className='doughnut'>
                  <Doughnut data={data} />
                </div>
                <div>
                  <div className='pickup'>
                    Pick ups ({dashboard?.orders?.total})
                  </div>
                  <div className='row'>
                    <div className='greyBox' />
                    <div className='text_primary'>Waiting</div>
                  </div>
                  <div className='row'>
                    <div className='greenBox' />
                    <div className='text_primary'>Active</div>
                  </div>
                </div>
              </Grid>
            </Paper>
          </Grid> */}
          <Grid item md={6}>
            <Paper className='chartPaper'>
              <Grid container alignItems={'center'}>
                <div className='doughnut'>
                  <Doughnut data={data1} />
                </div>
                <div>
                  <div className='pickup'>
                    Users ({dashboard?.users?.total})
                  </div>
                  <div className='row'>
                    <div className='greyBox' />
                    <div className='text_primary'>Sender</div>
                  </div>
                  <div className='row'>
                    <div className='orangeBox' />
                    <div className='text_primary'>Carrier</div>
                  </div>
                </div>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className='chartPaper'>
              <div className='pickup mt-3'>User feedback</div>
              <div className='text_primary'>User 1</div>
              <div className='text_primary font-14 mt-2 mb-3'>Lorem espum</div>
            </Paper>
          </Grid>
        </Grid>
        {dashboard?.orders?.details && (
          <AppTable
            rows={dashboard?.orders?.details}
            headingLeft={'Request activity'}
            headingRight={'Go to requests'}
            goto={() => navigate('/requests')}
            headCells={headCells}
          />
        )}
        {dashboard?.users?.details && (
          <AppTable
            rows={dashboard?.users?.details}
            flagAction={_updateUser}
            deleteAction={_deleteUser}
            approval
            goto={() => navigate('/users')}
            headingLeft={'User activity'}
            headingRight={'Go to users'}
            headCells={headCells1}
          />
        )}
      </Container>
    </Layout>
  )
}

export default function Dashboard () {
  return <DashboardContent />
}
