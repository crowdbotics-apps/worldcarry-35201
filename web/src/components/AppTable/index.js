import * as React from 'react'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Switch
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import DeleteIcon from '../../assets/svg/delete.svg'
import WarningIcon from '../../assets/svg/warninggrey.svg'
import WarningRedIcon from '../../assets/svg/warningRed.svg'

function EnhancedTableHead (props) {
  const { headCells, feedback } = props

  return (
    <TableHead sx={{ backgroundColor: '#F8F8FA' }}>
      <TableRow>
        {!feedback && <TableCell padding='checkbox'></TableCell>}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={false}
            sx={{ color: '#C6CACE' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = props => {
  const { numSelected, headingRight, headingLeft, goto } = props

  return (
    <Toolbar
      className='header'
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            )
        })
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant='h6'
        id='tableTitle'
        component='div'
      >
        {headingLeft}
      </Typography>
      <Typography
        onClick={goto}
        sx={{ flex: '1 1 20%', color: '#0AA0F4', cursor: 'pointer' }}
        variant='h6'
        id='tableTitle'
        component='div'
      >
        {headingRight}
      </Typography>
    </Toolbar>
  )
}

export default function AppTable ({
  rows,
  headCells,
  headingLeft,
  nowarning,
  headingRight,
  toggle,
  rowsPage,
  feedback,
  goto,
  _updateZipcodes,
  deleteAction,
  flagAction,
  onClickItem,
  approval
}) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPage || 5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  console.log('rows', rows)

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0

  return (
    <Paper sx={{ width: '100%', mb: 2, borderRadius: 4 }}>
      <EnhancedTableToolbar
        headingLeft={headingLeft}
        goto={goto}
        headingRight={headingRight}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby='tableTitle'
          size={'medium'}
        >
          <EnhancedTableHead
            headCells={headCells}
            goto={goto}
            feedback={feedback}
          />
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row, index) => {
              if (feedback) {
                return (
                  <TableRow hover key={index}>
                    <TableCell align='left'>
                      <img
                        src={
                          row?.user?.customer?.photo || row?.user?.driver?.photo
                        }
                        className='feedbackUserImage'
                      />
                    </TableCell>
                    <TableCell align='left'>{row?.user?.name}</TableCell>
                    <TableCell align='left'>{row?.user?.last_name}</TableCell>
                    <TableCell component='th' scope='row' padding='none'>
                      {row?.content}
                    </TableCell>
                    <TableCell align='left'>{row?.user?.type}</TableCell>
                    <TableCell align='left'> {row?.user?.email}</TableCell>
                    <TableCell align='left'>
                      {row?.user?.driver
                        ? '$' + row?.user?.driver?.earnings
                        : ''}
                    </TableCell>
                    <TableCell align='left'> {0}</TableCell>

                    <TableCell align='right'>
                      <Grid>
                        <IconButton onClick={() => deleteAction(row?.id)}>
                          <img src={DeleteIcon} />
                        </IconButton>
                        {!nowarning && (
                          <IconButton
                            onClick={() => flagAction(row?.id, !row?.flag)}
                          >
                            <img
                              src={row?.flag ? WarningRedIcon : WarningIcon}
                            />
                          </IconButton>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                )
              } else {
                return (
                  <TableRow
                    hover
                    key={index}
                    className={onClickItem ? 'c-pointer' : ''}
                    onClick={() => onClickItem(row?.id)}
                  >
                    <TableCell padding='checkbox'></TableCell>
                    <TableCell component='th' scope='row' padding='none'>
                      {row[headCells[0].id]}
                    </TableCell>
                    <TableCell align='left'>
                      {headCells[1].id === 'pickup'
                        ? row['address']?.street
                        : row[headCells[1].id]}
                    </TableCell>
                    <TableCell align='left'>{row[headCells[2].id]}</TableCell>
                    <TableCell align='left'>
                      {toggle ? (
                        <Switch
                          checked={row?.status}
                          onClick={() => _updateZipcodes(row?.id, !row?.status)}
                        />
                      ) : (
                        row[headCells[3].id]
                      )}
                    </TableCell>
                    {headCells?.length >= 5 && headCells[4].id !== 'action' && (
                      <TableCell align='left'>{row[headCells[4].id]}</TableCell>
                    )}
                    {headCells?.length >= 6 && headCells[5].id !== 'action' && (
                      <TableCell align='left'>
                        {headCells[5].id === 'payment' && row?.driver
                          ? '$' + row?.driver?.earnings
                          : row[headCells[5].id]}
                      </TableCell>
                    )}
                    <TableCell align='right'>
                      <Grid>
                        {approval && row?.type === 'Driver' && !row?.is_active && (
                          <Button
                            variant='contained'
                            style={{ backgroundColor: 'rgba(64, 199, 0, 1)' }}
                            onClick={() => flagAction(row?.id, true, true)}
                          >
                            Approve
                          </Button>
                        )}
                        <IconButton onClick={() => deleteAction(row?.id)}>
                          <img src={DeleteIcon} />
                        </IconButton>
                        {!nowarning && (
                          <IconButton
                            onClick={() => flagAction(row?.id, !row?.flag)}
                          >
                            <img
                              src={row?.flag ? WarningRedIcon : WarningIcon}
                            />
                          </IconButton>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                )
              }
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
