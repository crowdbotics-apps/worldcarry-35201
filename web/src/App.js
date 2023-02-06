import "./App.css"
import { Route, Routes, useNavigate } from "react-router-dom"
// import { PrivateRoute, Loader } from './components'
import { createTheme, ThemeProvider } from "@mui/material/styles"

//ROUTES
import * as ROUTES from "./constants/routes"

//CONTAINERS
import {
  Login,
  Dashboard,
  Users,
  FeedBack,
  Request,
  RequestDetails,
  Orders,
  Notifications
} from "./containers"
import AppContext from "./Context"
import {
  getAllUsers,
  getDashboard,
  getFeedbacks,
  getNotifications,
  getOrders
} from "./api/admin"
import { useState } from "react"

const theme = createTheme()
function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [orders, setOrders] = useState([])
  const [feedbacks, setFeedbacks] = useState([])

  const _getDashboard = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/")
        return
      }
      const res = await getDashboard(token)
      setDashboard(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await getAllUsers("?l=5000&o=0", token)
      setAllUsers(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await getNotifications("?l=5000&o=0", token)
      setNotifications(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await getOrders("", token)
      setOrders(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _getFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await getFeedbacks("", token)
      setFeedbacks(res?.data)
    } catch (error) {
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <AppContext.Provider
      value={{
        setUser,
        user,
        dashboard,
        _getDashboard,
        _getAllUsers,
        allUsers,
        _getNotifications,
        notifications,
        orders,
        _getOrders,
        feedbacks,
        _getFeedbacks
      }}
    >
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path={ROUTES.MAIN} element={<Login />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.USER} element={<Users />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.FEEDBACK} element={<FeedBack />} />
          <Route path={ROUTES.REQUEST} element={<Request />} />
          <Route path={ROUTES.REQUESTDETAILS} element={<RequestDetails />} />
        </Routes>
      </ThemeProvider>
    </AppContext.Provider>
  )
}

export default App
