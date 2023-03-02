import * as React from 'react'
import { Grid, Container, Paper } from '@mui/material'
import { Layout } from '../../components'
import AppTable from '../../components/AppTable'
import AppContext from '../../Context'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { deleteOrder, getOrderDetails } from '../../api/admin'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'

function RequestDetailsContent () {
  const { orders } = useContext(AppContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const [state, setState] = useState({
    orderDetails: null
  })
  const { orderDetails } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (id) {
      _getOrder(id)
    }
  }, [id])

  const _getOrder = async id => {
    try {
      const token = localStorage.getItem('token')
      const res = await getOrderDetails(id, token)
      console.log('orderDetails', res.data)
      handleChange('orderDetails', res.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <Layout>
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          <Paper className='paper'>
            <Grid item xs={12}>
              <div className='d-flex justify-content-between align-items-center'>
                <div className='rowCenter'>
                  <div
                    className='backArrow'
                    onClick={() => navigate('/requests')}
                  >
                    <span class='fa fa-arrow-left'></span>
                  </div>
                  <p className='mt-2'>ID#{orderDetails?.sid}</p>
                </div>
                <p className='text_secondary'>Delete request</p>
              </div>
              <Grid container className='border-top mt-4'>
                <Grid container>
                  <Grid container item md={5}>
                    <Grid item md={6} className={'p-4 border-right'}>
                      <p className='text_grey'>Pick up location</p>
                      <div className='text_primary'>
                        {orderDetails?.address?.street}
                      </div>
                    </Grid>
                    <Grid item md={6} className={'p-4 border-right'}>
                      <p className='text_grey'>Destination</p>
                      <div className='text_primary'>
                        {orderDetails?.destination}
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container item md={7}>
                    <Grid item md={4} className={'p-4 border-right'}>
                      <p className='text_grey'>Status</p>
                      <div className='text_primary'>{orderDetails?.status}</div>
                    </Grid>
                    <Grid item md={4} className={'p-4 border-right'}>
                      <p className='text_grey'>cost</p>
                      <div className='text_primary'>
                        ${orderDetails?.total_price}
                      </div>
                    </Grid>
                    <Grid item md={4} className='p-4'>
                      <p className='text_grey'>requested by</p>
                      <div className='d-flex'>
                        <img
                          src={orderDetails?.photo}
                          className={'orderUserPhoto'}
                        />
                        <div className='text_primary'>{orderDetails?.name}</div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container className='border-top border-bottom  mb-4'>
                <Grid container>
                  <Grid container item md={5}>
                    <Grid item md={12} className={'p-4 border-right'}>
                      <p className='text_grey'>Package pictures</p>
                      {orderDetails?.suborders?.map((sub, index) => (
                        <img
                          key={index}
                          src={sub?.item_picture}
                          className={'item_picture'}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  <Grid container item md={7}>
                    <Grid item md={12} className={'p-4'}>
                      <p className='text_grey'>driver notes</p>
                      {orderDetails?.suborders?.map((sub, index) => (
                        <div key={index} className='text_primary'>
                          {sub.note}
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <div className='historyItem'>
                  {orderDetails?.history?.length > 0 ? (
                    <p className='text-center orderDate'>
                      {moment(orderDetails?.history[0]?.date).format(
                        'DD.MM.YYYY'
                      )}
                      <br />
                      {moment(orderDetails?.history[0]?.date).format('h A')}
                    </p>
                  ) : (
                    <p className='orderDate'>N/A</p>
                  )}
                  <div className='uprCircle'>
                    <div
                      className={
                        orderDetails?.history?.length === 1
                          ? 'innerCircleActive'
                          : 'innerCircle'
                      }
                    />
                  </div>
                  <p className='text-center historycontent'>
                    {orderDetails?.history?.length > 0
                      ? orderDetails?.history[0]?.content
                      : 'Package is waiting pick-up'}
                  </p>
                </div>
                <div className='borderGap' />
                <div className='historyItem'>
                  {orderDetails?.history?.length >= 2 ? (
                    <p className='text-center orderDate'>
                      {moment(orderDetails?.history[1]?.date).format(
                        'DD.MM.YYYY'
                      )}
                      <br />
                      {moment(orderDetails?.history[1]?.date).format('h A')}
                    </p>
                  ) : (
                    <p className='orderDate'>N/A</p>
                  )}
                  <div className='uprCircle'>
                    <div
                      className={
                        orderDetails?.history?.length === 2
                          ? 'innerCircleActive'
                          : 'innerCircle'
                      }
                    />
                  </div>
                  <p className='text-center historycontent'>
                    {orderDetails?.history?.length >= 2
                      ? orderDetails?.history[1]?.content
                      : 'Picked up by'}
                  </p>
                </div>
                <div className='borderGap' />
                <div className='historyItem'>
                  {orderDetails?.history?.length >= 3 ? (
                    <p className='text-center orderDate'>
                      {moment(orderDetails?.history[2]?.date).format(
                        'DD.MM.YYYY'
                      )}
                      <br />
                      {moment(orderDetails?.history[2]?.date).format('h A')}
                    </p>
                  ) : (
                    <p className='orderDate'>N/A</p>
                  )}
                  <div className='uprCircle'>
                    <div
                      className={
                        orderDetails?.history?.length === 3
                          ? 'innerCircleActive'
                          : 'innerCircle'
                      }
                    />
                  </div>
                  <p className='text-center historycontent'>
                    {orderDetails?.history?.length >= 3
                      ? orderDetails?.history[2]?.content
                      : 'Package is being delivered'}
                  </p>
                </div>
                <div className='borderGap' />
                <div className='historyItem'>
                  {orderDetails?.history?.length >= 4 ? (
                    <p className='text-center orderDate'>
                      {moment(orderDetails?.history[3]?.date).format(
                        'DD.MM.YYYY'
                      )}
                      <br />
                      {moment(orderDetails?.history[3]?.date).format('h A')}
                    </p>
                  ) : (
                    <p className='orderDate'>N/A</p>
                  )}
                  <div className='uprCircle'>
                    <div
                      className={
                        orderDetails?.history?.length === 4
                          ? 'innerCircleActive'
                          : 'innerCircle'
                      }
                    />
                  </div>
                  <p className='text-center historycontent'>
                    {orderDetails?.history?.length >= 4
                      ? orderDetails?.history[3]?.content
                      : 'Package has been delivered'}
                  </p>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </Layout>
  )
}

export default function RequestDetails () {
  return <RequestDetailsContent />
}
