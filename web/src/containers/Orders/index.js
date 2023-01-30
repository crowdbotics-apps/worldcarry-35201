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
import { deleteOrder, updateOrder } from "../../api/admin"
import { useEffect } from "react"
import { DataGrid } from "@mui/x-data-grid"
import jsPDF from "jspdf"
import "jspdf-autotable"

function OrdersContent() {
  const STATUSES = [
    "Unpaid",
    "Requested",
    "Accepted",
    "In transit",
    "Received",
    "Cancelled"
  ]
  const headCells1 = [
    {
      field: "product_name",
      numeric: false,
      width: 300,
      disablePadding: true,
      disableColumnMenu: true,
      headerName: "PRODUCT NAME",
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
                (row?.row?.images?.length > 0 && row?.row?.images[0]?.image) ||
                "data:image/png;base64,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"
              }
            />
            <div>{row?.row?.product_name}</div>
          </div>
        )
      }
    },

    {
      field: "description",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "DESCRIPTION"
    },
    {
      field: "status",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "STATUS"
    },
    {
      field: "pickup_address_country",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "PICKUP ADDRESS"
    },
    {
      field: "arrival_address_country",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ARRIVAL ADDRESS"
    },
    {
      field: "product_price",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "PRODUCT PRICE",
      renderCell: row => {
        return <div>${row?.row?.product_price}</div>
      }
    },

    {
      field: "orderUser",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ORDER BY",
      renderCell: row => {
        return <div>{row?.row?.user?.name}</div>
      }
    },
    {
      field: "carrierUser",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "DELIVER BY",
      renderCell: row => {
        return <div>{row?.row?.carrier?.name}</div>
      }
    },
    {
      field: "total",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "TOTAL AMOUNT",
      renderCell: row => {
        return <div>${row?.row?.total}</div>
      }
    },
    {
      field: "world_carry_fee",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "WORLD CARRY FEE",
      renderCell: row => {
        return <div>${"0.00"}</div>
      }
    },
    {
      field: "carrier_reward",
      width: 150,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "CARRIER REWARD",
      renderCell: row => {
        return <div>${row?.row?.carrier_reward}</div>
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
              onClick={() => {
                handleClose(true)
                handleChange("orderID", row?.row?.id)
              }}
              disabled={row?.row?.status === "Received"}
              variant="contained"
            >
              Update Status
            </Button>
            <Button
              onClick={() => print(row?.row)}
              variant="contained"
              style={{ backgroundColor: "orange" }}
              className="ml-2"
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleDeleteClose(true)
                handleChange("orderID", row?.row?.id)
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
  const { orders, _getOrders } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: orders,
    orderStatus: "",
    orderID: "",
    orderStatusDialog: false,
    orderStatusLoading: false,
    orderDeleteDialog: false,
    orderDeleteLoading: false
  })
  const {
    filteredList,
    orderStatus,
    orderID,
    orderStatusDialog,
    orderStatusLoading,
    orderDeleteDialog,
    orderDeleteLoading
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleClose = status => {
    handleChange("orderStatusDialog", status)
  }
  const handleDeleteClose = status => {
    handleChange("orderDeleteDialog", status)
  }
  useEffect(() => {
    if (orders) {
      handleChange("filteredList", orders)
    }
  }, [orders])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = orders?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === "string" && val.match(re)
        )
      )
      handleChange("filteredList", filtered)
    } else {
      handleChange("filteredList", orders)
    }
  }

  const _updateStatus = async () => {
    try {
      handleChange("orderStatusLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        status: orderStatus
      }
      await updateOrder(orderID, payload, token)
      handleClose(false)
      handleChange("orderID", "")
      handleChange("orderStatus", "")
      handleChange("orderStatusLoading", false)
      _getOrders()
      alert("Order status has been updated")
    } catch (error) {
      handleChange("orderStatusLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _deleteOrder = async () => {
    try {
      handleChange("orderDeleteLoading", true)
      const token = localStorage.getItem("token")
      await deleteOrder(orderID, token)
      handleDeleteClose(false)
      handleChange("orderID", "")
      handleChange("orderDeleteLoading", false)
      _getOrders()
      alert("Order has been deleted")
    } catch (error) {
      handleChange("orderDeleteLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const print = data => {
    const pdf = new jsPDF("p", "pt", "a4")
    const columns = [
      "PRODUCT NAME",
      "DESCRIPTION",
      "STATUS",
      "PICKUP ADDRESS",
      "ARRIVAL ADDRESS",
      "PRODUCT PRICE",
      "ORDER BY",
      "DELIVER BY",
      "TOTAL AMOUNT",
      "WORLD CARRY FEE",
      "CARRIER REWARD"
    ]
    var rows = [
      [
        data?.product_name,
        data?.description,
        data?.status,
        data?.pickup_address_country,
        data?.arrival_address_country,
        data?.product_price,
        data?.user?.name,
        data?.carrier?.name,
        data?.total,
        data?.world_carry_fee,
        data?.carrier_reward
      ]
    ]
    pdf.text(
      235,
      40,
      `Order ID: #WC${data?.id?.substr(data?.id?.length - 5)?.toUpperCase()}`
    )
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
      </Container>
      <Dialog onClose={() => handleClose(false)} open={orderStatusDialog}>
        <div className={"zipModal"}>
          <p>Update Order Status</p>
          <select
            className="zipcode"
            onClick={value => handleChange("orderStatus", value.target.value)}
          >
            <option value={""}>Select</option>
            {STATUSES.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="d-flex justify-content-between mt-4">
            <p
              className="c-pointer text_secondary"
              onClick={() => handleClose(false)}
            >
              Cancel
            </p>
            <p
              className="c-pointer text_secondary"
              style={{ width: 120, textAlign: "center" }}
              onClick={_updateStatus}
            >
              {orderStatusLoading ? (
                <CircularProgress style={{ width: 15, height: 15 }} />
              ) : (
                "Update Status"
              )}
            </p>
          </div>
        </div>
      </Dialog>
      <Dialog onClose={() => handleDeleteClose(false)} open={orderDeleteDialog}>
        <div className={"zipModal"}>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>Delete Order</p>
          <p style={{ fontSize: 14, fontWeight: "normal" }}>
            Are you sure want to delete this order
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
              onClick={_deleteOrder}
            >
              {orderDeleteLoading ? (
                <CircularProgress style={{ width: 15, height: 15 }} />
              ) : (
                "Delete Order"
              )}
            </p>
          </div>
        </div>
      </Dialog>
    </Layout>
  )
}

export default function Orders() {
  return <OrdersContent />
}
