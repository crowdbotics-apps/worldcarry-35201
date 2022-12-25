import * as React from 'react'
import { Grid, Container, Dialog } from '@mui/material'
import { Layout } from '../../components'
import AppTable from '../../components/AppTable'
import AppContext from '../../Context'
import { useContext } from 'react'
import { useState } from 'react'
import { addZipcodes, deleteZipcodes, updateZipcodes } from '../../api/admin'
import { useEffect } from 'react'

const headCells = [
  {
    id: 'code',
    numeric: false,
    disablePadding: true,
    label: 'CODE'
  },
  {
    id: 'city',
    numeric: false,
    disablePadding: false,
    label: 'CITY'
  },
  {
    id: 'state',
    numeric: false,
    disablePadding: false,
    label: 'STATE'
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

const CITY = [
  'Albright',
  'Alderson',
  'Alum Creek',
  'Amherstdale',
  'Anawalt',
  'Anmoore',
  'Ansted',
  'Athens',
  'Bancroft',
  'Barboursville',
  'Barrackville',
  'Bayard',
  'Beaver',
  'Beckley',
  'Beech Bottom',
  'Belington',
  'Belle',
  'Belmont',
  'Benwood',
  'Bethany',
  'Beverly',
  'Bluefield',
  'Bradley',
  'Bradshaw',
  'Bramwell',
  'Bridgeport',
  'Buckhannon',
  'Buffalo',
  'Burnsville',
  'Cairo',
  'Cameron',
  'Cassville',
  'Cedar Grove',
  'Ceredo',
  'Chapmanville',
  'Charles Town',
  'Charleston',
  'Chattaroy',
  'Chester',
  'Clarksburg',
  'Clay',
  'Clendenin',
  'Coal City',
  'Cowen',
  'Crab Orchard',
  'Craigsville',
  'Culloden',
  'Daniels',
  'Danville',
  'Davis',
  'Davy',
  'Delbarton',
  'Dunbar',
  'Durbin',
  'East Bank',
  'Eleanor',
  'Elizabeth',
  'Elk Garden',
  'Elkins',
  'Elkview',
  'Ellenboro',
  'Enterprise',
  'Fairlea',
  'Fairmont',
  'Fairview',
  'Farmington',
  'Fayetteville',
  'Flatwoods',
  'Flemington',
  'Follansbee',
  'Fort Ashby',
  'Fort Gay',
  'Franklin',
  'Gary',
  'Gassaway',
  'Gauley Bridge',
  'Gilbert',
  'Glasgow',
  'Glen Dale',
  'Glenville',
  'Grafton',
  'Grant Town',
  'Grantsville',
  'Granville',
  'Hambleton',
  'Hamlin',
  'Handley',
  'Harpers Ferry',
  'Harrisville',
  'Hartford',
  'Harts',
  'Hedgesville',
  'Henderson',
  'Hendricks',
  'Hillsboro',
  'Hinton',
  'Holden',
  'Hundred',
  'Huntington',
  'Hurricane',
  'Huttonsville',
  'Iaeger',
  'Inwood',
  'Jane Lew',
  'Junior',
  'Kenova',
  'Kermit',
  'Keyser',
  'Keystone',
  'Kimball',
  'Kingwood',
  'Lester',
  'Lewisburg',
  'Littleton',
  'Logan',
  'Lost Creek',
  'Lumberport',
  'Mabscott',
  'Mac Arthur',
  'Madison',
  'Mallory',
  'Man',
  'Mannington',
  'Marlinton',
  'Martinsburg',
  'Mason',
  'Masontown',
  'Matewan',
  'Matoaka',
  'Mcmechen',
  'Meadow Bridge',
  'Middlebourne',
  'Mill Creek',
  'Milton',
  'Mineral Wells',
  'Montcalm',
  'Montgomery',
  'Moorefield',
  'Morgantown',
  'Moundsville',
  'Mount Gay',
  'Mount Hope',
  'Mullens',
  'New Cumberland',
  'New Haven',
  'New Martinsville',
  'Newburg',
  'Newell',
  'Nitro',
  'North Matewan',
  'Northfork',
  'Oak Hill',
  'Oceana',
  'Paden City',
  'Parkersburg',
  'Parsons',
  'Paw Paw',
  'Pennsboro',
  'Petersburg',
  'Peterstown',
  'Philippi',
  'Piedmont',
  'Pinch',
  'Pine Grove',
  'Pineville',
  'Piney View',
  'Poca',
  'Point Pleasant',
  'Powellton',
  'Pratt',
  'Princeton',
  'Prosperity',
  'Quinwood',
  'Rainelle',
  'Ravenswood',
  'Red Jacket',
  'Reedsville',
  'Rhodell',
  'Richwood',
  'Ridgeley',
  'Ripley',
  'Rivesville',
  'Rowlesburg',
  'Rupert',
  'Saint Albans',
  'Saint Marys',
  'Salem',
  'Shady Spring',
  'Shepherdstown',
  'Shinnston',
  'Sistersville',
  'Smithers',
  'Sophia',
  'Spencer',
  'Stanaford',
  'Summersville',
  'Sutton',
  'Switzer',
  'Teays',
  'Terra Alta',
  'Thomas',
  'Tornado',
  'Triadelphia',
  'Tunnelton',
  'Union',
  'Valley Grove',
  'Vienna',
  'War',
  'Wardensville',
  'Washington',
  'Wayne',
  'Weirton',
  'Welch',
  'Wellsburg',
  'West Hamlin',
  'West Liberty',
  'West Milford',
  'West Union',
  'Weston',
  'Wheeling',
  'White Sulphur Springs',
  'Whitesville',
  'Wiley Ford',
  'Williamson',
  'Williamstown',
  'Windsor Heights'
]
function ZipCodesContent () {
  const { zipcodes, _getZipcodes } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: zipcodes,
    open: false,
    code: '',
    city: '',
    zipstate: '',
    status: false
  })

  useEffect(() => {
    if (zipcodes) {
      handleChange('filteredList', zipcodes)
    }
  }, [zipcodes])
  const { filteredList, open, code, city, zipstate, status } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, 'i')
      var filtered = zipcodes?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === 'string' && val.match(re)
        )
      )
      handleChange('filteredList', filtered)
    } else {
      handleChange('filteredList', zipcodes)
    }
  }

  const handleClose = value => {
    handleChange('open', value)
  }

  const _updateZipcodes = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      const payload = {
        status
      }
      await updateZipcodes(id, payload, token)
      _getZipcodes()
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _deleteZipcodes = async id => {
    try {
      const token = localStorage.getItem('token')
      await deleteZipcodes(id, token)
      _getZipcodes()
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _addZipcodes = async () => {
    try {
      if (!code || !city || !zipstate) {
        alert('Enter all fields')
        return
      }
      const token = localStorage.getItem('token')
      const payload = {
        code,
        city,
        state: zipstate,
        status
      }
      await addZipcodes(payload, token)
      _getZipcodes()
      handleClose(false)
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
                placeholder='Search zip codes'
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
        </Grid>
        {zipcodes && (
          <AppTable
            rows={filteredList}
            nowarning={true}
            _updateZipcodes={_updateZipcodes}
            deleteAction={_deleteZipcodes}
            toggle={true}
            goto={() => handleClose(true)}
            headingLeft={'GoBackz zipcodes'}
            headingRight={'Add new zip code'}
            headCells={headCells}
          />
        )}
      </Container>
      <Dialog onClose={() => handleClose(false)} open={open}>
        <div className={'zipModal'}>
          <p>Zip Code</p>
          <input
            className={'zipcode'}
            placeholder='Search zip codes'
            onChange={value => handleChange('code', value.target.value)}
          />
          <p className='mt-4'>City</p>
          <select
            className='zipcode'
            onClick={value => handleChange('city', value.target.value)}
          >
            <option value={''}>Select</option>
            {CITY.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className='mt-4'>State</p>
          <select
            className='zipcode'
            onClick={value => handleChange('zipstate', value.target.value)}
          >
            <option value={''}>Select</option>
            <option value={'West Virginia'}>West Virginia</option>
          </select>
          <p className='mt-4'>Status</p>
          <select
            className='zipcode'
            onClick={value => handleChange('status', value.target.value)}
          >
            <option value={''}>Select</option>
            <option value={true}>Active</option>
            <option value={false}>In Active</option>
          </select>
          <div className='d-flex justify-content-between mt-4'>
            <p
              className='c-pointer text_secondary'
              onClick={() => handleClose(false)}
            >
              Cancel
            </p>
            <p className='c-pointer text_secondary' onClick={_addZipcodes}>
              Save changes
            </p>
          </div>
        </div>
      </Dialog>
    </Layout>
  )
}

export default function ZipCodes () {
  return <ZipCodesContent />
}
