import * as React from "react"
import { Grid, Container, Paper } from "@mui/material"
import { Layout } from "../../components"
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend
} from "chart.js"
import AppTable from "../../components/AppTable"
import AppContext from "../../Context"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { deleteUser, updateUser } from "../../api/admin"

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "ITEM"
  },
  {
    id: "pickup",
    numeric: false,
    disablePadding: false,
    label: "PICK UP"
  },
  {
    id: "destination",
    numeric: false,
    disablePadding: false,
    label: "DESTINATION"
  },
  {
    id: "sid",
    numeric: false,
    disablePadding: false,
    label: "ID"
  },
  {
    id: "reports",
    numeric: false,
    disablePadding: false,
    label: "REPORTS"
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "STATUS"
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: ""
  }
]
const headCells1 = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "FIRST NAME"
  },
  {
    id: "pickup",
    numeric: false,
    disablePadding: false,
    label: "PICK UPS"
  },
  {
    id: "last_name",
    numeric: false,
    disablePadding: false,
    label: "LAST NAME"
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "TYPE"
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "EMAIL"
  },
  {
    id: "payment",
    numeric: false,
    disablePadding: false,
    label: "PAYMENT"
  },

  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: ""
  }
]
function DashboardContent() {
  const { dashboard, _getAllUsers } = useContext(AppContext)
  const navigate = useNavigate()

  ChartJS.register(ArcElement, ChartTooltip, Legend)
  const data = {
    labels: false,
    datasets: [
      {
        label: "# of Votes",
        data: [
          dashboard?.read_feedbacks,
          dashboard?.unread_feedbacks,
          dashboard?.feedback_emails
        ],
        backgroundColor: [
          "rgba(241, 241, 242, 1)",
          "rgba(255, 129, 24, 1)",
          "rgba(64, 199, 0, 1)"
        ]
      }
    ]
  }
  const data1 = {
    labels: false,
    datasets: [
      {
        label: "# of Votes",
        data: [dashboard?.inactive_users, dashboard?.active_users],
        backgroundColor: ["rgba(241, 241, 242, 1)", "rgba(255, 129, 24, 1)"]
      }
    ]
  }

  const _updateUser = async (id, flag, is_active) => {
    try {
      const token = localStorage.getItem("token")
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
      const token = localStorage.getItem("token")
      await deleteUser(id, token)
      _getAllUsers()
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <Paper className="chartPaper">
              <Grid container alignItems={"center"}>
                <div className="doughnut">
                  <Doughnut data={data1} />
                </div>
                <div>
                  <div className="pickup">Users ({dashboard?.total_users})</div>
                  <div className="row">
                    <div className="orangeBox" />
                    <div className="text_primary">
                      {"Active Users (" + dashboard?.active_users + ")"}
                    </div>
                  </div>
                  <div className="row">
                    <div className="greyBox" />
                    <div className="text_primary">
                      {"Inactive Users (" + dashboard?.inactive_users + ")"}
                    </div>
                  </div>
                </div>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className="chartPaper">
              <Grid container alignItems={"center"}>
                <div className="doughnut">
                  <Doughnut data={data} />
                </div>
                <div>
                  {/* <div className="pickup">
                    Feedback (
                    {dashboard?.read_feedbacks +
                      dashboard?.unread_feedbacks +
                      dashboard?.feedback_emails}
                    )
                  </div> */}
                  <div className="row">
                    <div className="greyBox" />
                    <div className="text_primary">
                      {"Read Feedback (" + dashboard?.read_feedbacks + ")"}
                    </div>
                  </div>
                  <div className="row">
                    <div className="orangeBox" />
                    <div className="text_primary">
                      {"Unread Feedback (" + dashboard?.unread_feedbacks + ")"}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="greenBox" />
                    <div className="text_primary">
                      {"Feedback Email (" + dashboard?.feedback_emails + ")"}
                    </div>
                  </div>
                </div>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={6}>
            <Paper className="chartPaper">
              <Grid container alignItems={"center"}>
                <div>
                  <div className="pickup">
                    Revenue Amount{" "}
                    <h5 className="mt-2">
                      <b>${dashboard?.revenue_amount}</b>
                    </h5>
                  </div>
                  <div className="pickup">
                    Total Orders{" "}
                    <h5 className="mt-2">
                      <b>{dashboard?.total_orders}</b>
                    </h5>
                  </div>
                </div>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}
