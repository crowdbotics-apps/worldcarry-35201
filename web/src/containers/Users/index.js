import * as React from "react"
import {
  Grid,
  Container,
  Button,
  Dialog,
  CircularProgress
} from "@mui/material"
import { Layout } from "../../components"
import { useContext } from "react"
import AppContext from "../../Context"
import { useState } from "react"
import { banUnbanUser, deleteUser, getUserPayment } from "../../api/admin"
import { useEffect } from "react"
import { DataGrid } from "@mui/x-data-grid"
import jsPDF from "jspdf"
import "jspdf-autotable"
import moment from "moment"

function UsersContent() {
  const headCells1 = [
    {
      field: "name",
      numeric: false,
      width: 300,
      disablePadding: true,
      disableColumnMenu: true,
      headerName: "NAME",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <img
              className="btn-gradient-1"
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginRight: 15
              }}
              src={
                row?.row?.profile_picture ||
                "data:image/png;base64,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"
              }
            />
            <div>{row?.row?.name}</div>
          </div>
        )
      }
    },

    {
      field: "email",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "EMAIL"
    },
    {
      field: "phone",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "PHONE"
    },
    {
      field: "is_active",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ACTIVE",
      renderCell: row => {
        return <div>{row?.row?.is_active ? "ACTIVE" : "INACTIVE"}</div>
      }
    },
    {
      field: "date_joined",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "DATE JOINED",
      renderCell: row => {
        return (
          <div>
            {row?.row?.date_joined
              ? moment(row?.row?.date_joined).format("LL")
              : "-"}
          </div>
        )
      }
    },
    {
      field: "last_login",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "LAST LOGIN",
      renderCell: row => {
        return (
          <div>
            {" "}
            {row?.row?.last_login
              ? moment(row?.row?.last_login).fromNow()
              : "-"}
          </div>
        )
      }
    },

    {
      field: "action",
      width: 450,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ACTION",
      renderCell: row => {
        return (
          <div className="d-flex">
            <Button
              onClick={() => _getUserPayment(row?.row?.id)}
              variant="contained"
            >
              {"Show Payment Details"}
            </Button>
            <Button
              className="ml-2"
              onClick={() => {
                handleBanClose(true)
                handleChange("userID", row?.row?.id)
                handleChange("userStatus", !row?.row?.is_active)
              }}
              variant="contained"
            >
              {row?.row?.is_active ? "Ban" : "Unban"}
            </Button>

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
  const headCells = [
    {
      field: "amount",
      numeric: false,
      width: 180,
      disablePadding: true,
      disableColumnMenu: true,
      headerName: "TOTAL AMOUNT",
      renderCell: row => {
        return <div>${row?.row?.amount}</div>
      }
    },

    {
      field: "order",
      width: 180,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ORDER ID",
      renderCell: row => {
        return (
          <div>
            #WC
            {row?.row?.order?.id?.substr(row?.row?.order?.id?.length - 5)}
          </div>
        )
      }
    },
    {
      field: "order.carrier_reward",
      width: 180,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "CARRIER REWARD",
      renderCell: row => {
        return <div>{row?.row?.order?.carrier_reward}</div>
      }
    }
  ]
  const { allUsers, _getAllUsers } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: allUsers,
    userDeleteDialog: false,
    userDeleteLoading: false,
    userID: "",
    userBanDialog: false,
    userBanLoading: false,
    userStatus: false,
    openPaymentModal: false,
    paymentLoading: false,
    userPayment: []
  })
  const {
    filteredList,
    userBanLoading,
    userBanDialog,
    userDeleteDialog,
    userDeleteLoading,
    userID,
    userStatus,
    openPaymentModal,
    paymentLoading,
    userPayment
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (allUsers) {
      handleChange("filteredList", allUsers)
    }
  }, [allUsers])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = allUsers?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === "string" && val.match(re)
        )
      )
      handleChange("filteredList", filtered)
    } else {
      handleChange("filteredList", allUsers)
    }
  }

  const handleBanClose = status => {
    handleChange("userBanDialog", status)
    if (!status) {
      handleChange("userID", "")
      handleChange("userStatus", false)
    }
  }

  const handlePaymentClose = status => {
    handleChange("openPaymentModal", status)
  }

  const handleDeleteClose = status => {
    handleChange("userDeleteDialog", status)
    if (!status) {
      handleChange("userID", "")
    }
  }

  const _getUserPayment = async id => {
    try {
      handlePaymentClose(true)
      handleChange("paymentLoading", true)
      const token = localStorage.getItem("token")
      const payload = `?user_id=${id}`
      const res = await getUserPayment(payload, token)
      handleChange("userPayment", res?.data)
      handleChange("paymentLoading", false)
    } catch (error) {
      handleChange("paymentLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _deleteUser = async () => {
    try {
      handleChange("userDeleteLoading", true)
      const token = localStorage.getItem("token")
      await deleteUser(userID, token)
      handleChange("userDeleteLoading", false)
      handleDeleteClose(false)
      alert("User deleted")
      _getAllUsers()
    } catch (error) {
      handleChange("userDeleteLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _banUnbanUser = async () => {
    try {
      handleChange("userBanLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        user_id: userID,
        status: userStatus
      }
      await banUnbanUser(payload, token)
      handleChange("userBanLoading", false)
      handleBanClose(false)
      alert(userStatus ? "User Banned" : "User Unbanned")
      _getAllUsers()
    } catch (error) {
      handleChange("userBanLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const print = () => {
    const pdf = new jsPDF("p", "pt", "a4")
    const columns = [
      "NAME",
      "EMAIL",
      "PHONE",
      "ACTIVE",
      "DATE JOINED",
      "LAST LOGIN"
    ]
    const list = []
    allUsers?.forEach(element => {
      list.push([
        element?.name,
        element?.email,
        element?.phone,
        element?.is_active ? "ACTIVE" : "INACTIVE",
        element?.date_joined ? moment(element?.date_joined).format("LL") : "-",
        element?.last_login ? moment(element?.last_login).fromNow() : "-"
      ])
    })
    var rows = list
    pdf.text(235, 40, `All Users`)
    pdf.autoTable(columns, rows, {
      startY: 65,
      theme: "grid",
      styles: {
        font: "times",
        halign: "center",
        cellPadding: 3.5,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0]
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "normal",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fillColor: [166, 204, 247]
      },
      alternateRowStyles: {
        fillColor: [212, 212, 212],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      rowStyles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      tableLineColor: [0, 0, 0]
    })
    console.log(pdf.output("datauristring"))
    pdf.save("pdf")
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          <div class="search">
            <span class="form-element">
              <span class="fa fa-search"></span>
              <input
                placeholder="Search users"
                onChange={value => filtered(value.target.value)}
              />
            </span>
          </div>
          <Button
            onClick={() => print()}
            variant="contained"
            style={{ backgroundColor: "orange" }}
            className="mt-4 ml-2"
          >
            Download All Users As PDF
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
        <Dialog
          onClose={() => handleDeleteClose(false)}
          open={userDeleteDialog}
        >
          <div className={"zipModal"}>
            <p style={{ fontSize: 24, fontWeight: "bold" }}>Delete User</p>
            <p style={{ fontSize: 14, fontWeight: "normal" }}>
              Are you sure want to delete this user
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
                onClick={_deleteUser}
              >
                {userDeleteLoading ? (
                  <CircularProgress style={{ width: 15, height: 15 }} />
                ) : (
                  "Delete User"
                )}
              </p>
            </div>
          </div>
        </Dialog>
        <Dialog onClose={() => handleBanClose(false)} open={userBanDialog}>
          <div className={"zipModal"}>
            <p style={{ fontSize: 24, fontWeight: "bold" }}>
              {userStatus ? "Unban" : "Ban"} User
            </p>
            <p style={{ fontSize: 14, fontWeight: "normal" }}>
              Are you sure want to {userStatus ? "unban" : "ban"} this user
            </p>
            <div className="d-flex justify-content-between mt-4">
              <p
                className="c-pointer text_secondary"
                onClick={() => handleBanClose(false)}
              >
                Cancel
              </p>
              <p
                className="c-pointer text_secondary"
                style={{ width: 120, textAlign: "center" }}
                onClick={_banUnbanUser}
              >
                {userBanLoading ? (
                  <CircularProgress style={{ width: 15, height: 15 }} />
                ) : userStatus ? (
                  "Unban User"
                ) : (
                  "Ban User"
                )}
              </p>
            </div>
          </div>
        </Dialog>
        <Dialog
          onClose={() => handlePaymentClose(false)}
          open={openPaymentModal}
          fullWidth
        >
          <div className={"zipModal"} style={{ width: "100%" }}>
            {paymentLoading ? (
              <CircularProgress style={{ width: 25, height: 25 }} />
            ) : (
              <>
                <p style={{ fontSize: 24, fontWeight: "bold" }}>
                  All Payments of User
                </p>
                {userPayment?.length === 0 ? (
                  <div>No Payment Details</div>
                ) : (
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
                      rows={userPayment}
                      columns={headCells}
                      pageSize={30}
                      style={{ width: "100%" }}
                      rowsPerPageOptions={[30]}
                    />
                  </div>
                )}
                <div className="d-flex justify-content-between mt-4">
                  <p
                    className="c-pointer text_secondary"
                    onClick={() => handlePaymentClose(false)}
                  >
                    Cancel
                  </p>
                </div>
              </>
            )}
          </div>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default function Users() {
  return <UsersContent />
}
