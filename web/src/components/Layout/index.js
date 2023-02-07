import * as React from "react"
import { styled } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import MuiDrawer from "@mui/material/Drawer"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import ProfileImage from "../../assets/images/profile-large.png"
import IconButton from "@mui/material/IconButton"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import LOGO from "../../assets/svg/logo.svg"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { useEffect } from "react"

const drawerWidth = 240

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    })
  }
}))

function LayoutContent({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    user,
    setUser,
    _getDashboard,
    _getAllUsers,
    _getNotifications,
    _getOrders,
    _getFeedbacks
  } = useContext(AppContext)
  const [open, setOpen] = React.useState(true)
  useEffect(() => {
    const userData = localStorage.getItem("user")
    setUser(JSON.parse(userData))
    _getDashboard()
    _getAllUsers()
    _getNotifications()
    _getOrders()
    _getFeedbacks()
  }, [])

  const handleListItemClick = (route, index) => {
    navigate(route)
  }
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" style={{ height: "100vh" }} open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: [1]
          }}
        >
          {open && (
            <img
              src={LOGO}
              style={{ width: 150, marginTop: 50, marginBottom: 50 }}
            />
          )}
          {/* <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton> */}
        </Toolbar>
        {open && (
          <List component="nav">
            <ListItemButton
              selected={location.pathname === "/dashboard"}
              onClick={() => handleListItemClick("/dashboard", 0)}
              className={
                location.pathname === "/dashboard"
                  ? "listButtonActive"
                  : "listButton"
              }
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              selected={location.pathname === "/orders"}
              onClick={() => handleListItemClick("/orders", 0)}
              className={
                location.pathname === "/orders"
                  ? "listButtonActive"
                  : "listButton"
              }
            >
              <ListItemText primary="Orders" />
            </ListItemButton>
            <ListItemButton
              selected={location.pathname === "/users"}
              onClick={() => handleListItemClick("/users", 1)}
              className={
                location.pathname === "/users"
                  ? "listButtonActive"
                  : "listButton"
              }
            >
              <ListItemText primary="Users" />
            </ListItemButton>
            <ListItemButton
              selected={location.pathname === "/notifications"}
              onClick={() => handleListItemClick("/notifications", 2)}
              className={
                location.pathname === "/notifications"
                  ? "listButtonActive"
                  : "listButton"
              }
            >
              <ListItemText primary="Notifications" />
            </ListItemButton>
            {/* <ListItemButton
              selected={location.pathname === '/requests'}
              onClick={() => handleListItemClick('/requests', 3)}
              className={
                location.pathname === '/requests'
                  ? 'listButtonActive'
                  : 'listButton'
              }
            >
              <ListItemText primary='Requests' />
            </ListItemButton> */}
            <ListItemButton
              selected={location.pathname === "/feedback"}
              onClick={() => handleListItemClick("/feedback", 4)}
              className={
                location.pathname === "/feedback"
                  ? "listButtonActive"
                  : "listButton"
              }
            >
              <ListItemText primary="Feedback" />
            </ListItemButton>
          </List>
        )}
        <Grid
          container
          direction={"column"}
          className=" mb-4"
          alignItems={"center"}
        >
          {/* <img
            src={user?.customer?.photo || ProfileImage}
            className={'ProfileImage'}
          />
          <p className='text-center text_blue mt-3'>
            Welcome,
            <br />
            {user?.name + ' ' + user?.last_name}
          </p> */}
          <p onClick={logout} className="text-center c-pointer">
            Logout
          </p>
        </Grid>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto"
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default function Layout({ children }) {
  return <LayoutContent children={children} />
}
