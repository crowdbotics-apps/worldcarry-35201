import * as React from "react"
import {
  Grid,
  Container,
  Button,
  Dialog,
  CircularProgress,
  TextField,
  Checkbox,
  Autocomplete,
  Box
} from "@mui/material"
import { Layout } from "../../components"
import AppTable from "../../components/AppTable"
import { useContext } from "react"
import AppContext from "../../Context"
import { useState } from "react"
import {
  createNotification,
  deleteNotification,
  deleteUser,
  updateUser
} from "../../api/admin"
import { useEffect } from "react"
import { DataGrid } from "@mui/x-data-grid"
import jsPDF from "jspdf"
import "jspdf-autotable"
import moment from "moment"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

function NotificationsContent() {
  const headCells1 = [
    {
      field: "name",
      numeric: false,
      width: 300,
      disablePadding: true,
      disableColumnMenu: true,
      headerName: "TITLE",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            {/* <img
              className="btn-gradient-1"
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: 15
              }}
              src={
                (row?.row?.images?.length > 0 && row?.row?.images[0]?.image) ||
                "data:image/png;base64,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"
              }
            /> */}
            <div>{row?.row?.name}</div>
          </div>
        )
      }
    },

    {
      field: "description",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "DESCRIPTION"
    },
    {
      field: "user.name",
      numeric: false,
      width: 200,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "USER NAME",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.user_detail?.name}</div>
          </div>
        )
      }
    },
    {
      field: "user.email",
      numeric: false,
      width: 250,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "USER EMAIL",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.user_detail?.email}</div>
          </div>
        )
      }
    },
    {
      field: "created_at",
      width: 250,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "CREATED AT",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{moment(row?.row?.created_at).format("LLL")}</div>
          </div>
        )
      }
    },
    {
      field: "is_read",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "READ",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.is_read ? "Yes" : "No"}</div>
          </div>
        )
      }
    },
    {
      field: "is_send_now",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "IS SEND NOW",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.is_send_now ? "Yes" : "No"}</div>
          </div>
        )
      }
    },
    {
      field: "is_sent",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "IS SENT",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.is_sent ? "Yes" : "No"}</div>
          </div>
        )
      }
    },
    {
      field: "is_paused",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "IS PAUSED",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.is_paused ? "Yes" : "No"}</div>
          </div>
        )
      }
    },

    {
      field: "action",
      width: 200,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ACTION",
      renderCell: row => {
        return (
          <div className="d-flex">
            {/* <Button
              onClick={() => {
                handleClose(true)
                handleChange("orderID", row?.row?.id)
              }}
              disabled={row?.row?.status === "Received"}
              variant="contained"
            >
              Update Status
            </Button> */}

            <Button
              variant="contained"
              onClick={() => {
                handleDeleteClose(true)
                handleChange("userID", row?.row?.id)
              }}
              style={{ backgroundColor: "red" }}
              className="ml-2"
            >
              remove
            </Button>
          </div>
        )
      }
    }
  ]
  const { notifications, allUsers, _getNotifications } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: notifications,
    userDeleteDialog: false,
    userDeleteLoading: false,
    newDialog: false,
    newLoading: false,
    userID: "",
    selectedUser: allUsers?.length > 0 ? allUsers[0] : "",
    name: "",
    description: "",
    is_send_now: false,
    send_date: new Date()
  })
  const {
    filteredList,
    userDeleteDialog,
    userDeleteLoading,
    userID,
    newDialog,
    newLoading,
    selectedUser,
    name,
    description,
    is_send_now,
    send_date
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (notifications) {
      handleChange("filteredList", notifications)
    }
  }, [notifications])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = notifications?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === "string" && val.match(re)
        )
      )
      handleChange("filteredList", filtered)
    } else {
      handleChange("filteredList", notifications)
    }
  }

  const handleClose = status => {
    handleChange("userStatusDialog", status)
  }
  const handleDeleteClose = status => {
    handleChange("userDeleteDialog", status)
    if (!status) {
      handleChange("userID", "")
    }
  }
  const handleNewClose = status => {
    handleChange("newDialog", status)
  }

  const _createNotification = async () => {
    try {
      handleChange("newLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        name,
        description,
        is_send_now,
        send_date,
        user: selectedUser?.id
      }
      await createNotification(payload, token)
      handleChange("newLoading", false)
      handleChange("name", "")
      handleChange("description", "")
      handleChange("is_send_now", false)
      handleChange("newDialog", false)
      handleChange("send_date", new Date())
      handleChange("selectedUser", allUsers?.length > 0 ? allUsers[0] : "")
      _getNotifications()
      alert(`Notification Created`)
    } catch (error) {
      handleChange("newLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _deleteNotification = async () => {
    try {
      handleChange("userDeleteLoading", true)
      const token = localStorage.getItem("token")
      await deleteNotification(userID, token)
      handleChange("userDeleteLoading", false)
      handleDeleteClose(false)
      alert("User deleted")
      _getNotifications()
    } catch (error) {
      handleChange("userDeleteLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          <div class="search">
            <span class="form-element">
              <span class="fa fa-search"></span>
              <input
                placeholder="Search Notifications"
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
          <Button
            onClick={() => handleNewClose(true)}
            variant="contained"
            style={{ backgroundColor: "orange" }}
            className="mt-4 ml-2"
          >
            Create New
          </Button>
        </Grid>
        <div
          style={{
            height: 500,
            background: "#fff",
            marginTop: 20,
            borderRadius: 10,
            width: "100%"
          }}
        >
          <DataGrid
            rows={filteredList}
            columns={headCells1}
            pageSize={30}
            rowsPerPageOptions={[30]}
          />
        </div>
        <Dialog onClose={() => handleNewClose(false)} open={newDialog}>
          <div className={"zipModal"}>
            <p style={{ fontSize: 24, fontWeight: "bold" }}>
              Create Notification
            </p>
            <TextField
              margin="normal"
              value={name}
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              onChange={e => handleChange("name", e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              value={description}
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              onChange={e => handleChange("description", e.target.value)}
              autoFocus
            />
            <div style={{ width: "100%", marginTop: 20, marginBottom: 20 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Send Now"
                  value={send_date}
                  onChange={date => handleChange("send_date", date)}
                  renderInput={params => (
                    <TextField style={{ width: "100%" }} {...params} />
                  )}
                />
              </LocalizationProvider>
            </div>
            <Autocomplete
              id="country-select-demo"
              // sx={{ width: 300 }}
              options={allUsers}
              autoHighlight
              value={selectedUser}
              onChange={(event, newValue) => {
                handleChange("selectedUser", newValue)
              }}
              // value={allUsers?.find(e => e?.id === selectedUser)}
              getOptionLabel={option => option?.name + " (" + option?.email + ")"}
              renderOption={(props, option) => (
                <Box
                  onClick={() => handleChange("selectedUser", option?.id)}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={option?.image}
                    srcSet={option?.image}
                    alt=""
                  />
                  {option?.name + " (" + option?.email + ")"}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Choose a user"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password" // disable autocomplete and autofill
                  }}
                />
              )}
            />

            <div className="d-flex align-items-center">
              <Checkbox
                title="Is Send Now"
                onChange={() => handleChange("is_send_now", !is_send_now)}
                checked={is_send_now}
              />
              <div>Is Send Now</div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <p
                className="c-pointer text_secondary"
                onClick={() => handleNewClose(false)}
              >
                Cancel
              </p>
              <p
                className="c-pointer text_secondary"
                style={{ width: 120, textAlign: "center" }}
                onClick={_createNotification}
              >
                {newLoading ? (
                  <CircularProgress style={{ width: 15, height: 15 }} />
                ) : (
                  "Create Notification"
                )}
              </p>
            </div>
          </div>
        </Dialog>
        <Dialog
          onClose={() => handleDeleteClose(false)}
          open={userDeleteDialog}
        >
          <div className={"zipModal"}>
            <p style={{ fontSize: 24, fontWeight: "bold" }}>
              Delete Notification
            </p>
            <p style={{ fontSize: 14, fontWeight: "normal" }}>
              Are you sure want to delete this notification
            </p>

            <div className="d-flex justify-content-between mt-4">
              <p
                className="c-pointer text_secondary"
                onClick={() => handleDeleteClose(false)}
              >
                Cancel
              </p>
              <p
                className="c-pointer text_secondary"
                style={{ width: 120, textAlign: "center" }}
                onClick={_deleteNotification}
              >
                {userDeleteLoading ? (
                  <CircularProgress style={{ width: 15, height: 15 }} />
                ) : (
                  "Delete Notification"
                )}
              </p>
            </div>
          </div>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default function Notifications() {
  return <NotificationsContent />
}
