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
  replyFeedback,
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

function FeedbackContent() {
  const headCells1 = [
    {
      field: "email",
      numeric: false,
      width: 300,
      disablePadding: true,
      disableColumnMenu: true,
      headerName: "EMAIl"
    },

    {
      field: "message",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "MESSAGE"
    },
    {
      field: "reply",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "REPLY"
    },
    {
      field: "user_details.name",
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
      field: "action",
      width: 200,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ACTION",
      renderCell: row => {
        return (
          <div className="d-flex">
            <Button
              variant="contained"
              onClick={() => {
                handleNewClose(true)
                handleChange("feedbackID", row?.row?.id)
              }}
              style={{ backgroundColor: "orange" }}
              className="ml-2"
            >
              Reply
            </Button>
          </div>
        )
      }
    }
  ]
  const { feedbacks, allUsers, _getFeedbacks } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: feedbacks,
    userDeleteDialog: false,
    userDeleteLoading: false,
    newDialog: false,
    newLoading: false,
    selectedUser: allUsers?.length > 0 ? allUsers[0] : "",
    name: "",
    feedbackID: ""
  })
  const {
    filteredList,
    newDialog,
    newLoading,
    selectedUser,
    name,
    feedbackID
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (feedbacks) {
      handleChange("filteredList", feedbacks)
    }
  }, [feedbacks])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = feedbacks?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === "string" && val.match(re)
        )
      )
      handleChange("filteredList", filtered)
    } else {
      handleChange("filteredList", feedbacks)
    }
  }

  const handleDeleteClose = status => {
    handleChange("userDeleteDialog", status)
    if (!status) {
      handleChange("feedbackID", "")
    }
  }
  const handleNewClose = status => {
    handleChange("newDialog", status)
  }

  const _replyFeedback = async () => {
    try {
      handleChange("newLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        reply: name
      }
      await replyFeedback(feedbackID, payload, token)
      handleChange("newLoading", false)
      handleChange("name", "")
      handleChange("newDialog", false)
      _getFeedbacks()
      alert(`Reply has been sent`)
    } catch (error) {
      handleChange("newLoading", false)
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
                placeholder="Search Feedbacks"
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
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
            <p style={{ fontSize: 24, fontWeight: "bold" }}>Reply Feedback</p>
            <TextField
              margin="normal"
              value={name}
              fullWidth
              id="name"
              label="Message"
              multiline
              inputProps={{
                style: { height: 150 }
              }}
              style={{ height: 200 }}
              name="name"
              autoComplete="name"
              onChange={e => handleChange("name", e.target.value)}
              autoFocus
            />
            <div className="d-flex justify-content-between mt-4">
              <p
                className="c-pointer text_secondary"
                onClick={() => handleNewClose(false)}
              >
                Cancel
              </p>
              <p
                className="c-pointer text_secondary"
                style={{
                  width: 120,
                  textAlign: "right",
                  opacity: !name ? 0.5 : 1
                }}
                onClick={name && _replyFeedback}
              >
                {newLoading ? (
                  <CircularProgress style={{ width: 15, height: 15 }} />
                ) : (
                  "Reply"
                )}
              </p>
            </div>
          </div>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default function Feedback() {
  return <FeedbackContent />
}
