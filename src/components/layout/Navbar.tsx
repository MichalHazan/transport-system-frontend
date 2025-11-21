import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const whatsappUrl = `https://wa.me/972526508192`;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar sx={{ justifyContent: "space-between" }} dir="rtl">
          
          {/* Right side - Logo / Title */}
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            מערכת הסעות
          </Typography>

          {/* Desktop buttons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {isLoggedIn && user?.role === "Client" && (
              <Button color="inherit" component={Link} to="/client">
                לוח לקוח
              </Button>
            )}

            {isLoggedIn && user?.role === "Supplier" && (
              <Button color="inherit" component={Link} to="/supplier">
                לוח ספק
              </Button>
            )}

            {isLoggedIn && user?.role === "Admin" && (
              <Button color="inherit" component={Link} to="/admin">
                לוח מנהל
              </Button>
            )}

            {!isLoggedIn && (
              <>
                <Button color="inherit" component={Link} to="/login">
                  התחברות
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  הרשמה
                </Button>
              </>
            )}

            {isLoggedIn && (
              <Button color="inherit" onClick={logout}>
                התנתקות
              </Button>
            )}

            {/* WhatsApp button */}
            <Button
              color="success"
              variant="contained"
              href={whatsappUrl}
              target="_blank"
              sx={{ fontWeight: "bold" }}
            >
              פנייה למנהל
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "white" }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>

        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 260,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          dir="rtl"
        >
          {isLoggedIn && user?.role === "Client" && (
            <Button onClick={() => navigate("/client")}>לוח לקוח</Button>
          )}

          {isLoggedIn && user?.role === "Supplier" && (
            <Button onClick={() => navigate("/supplier")}>לוח ספק</Button>
          )}

          {isLoggedIn && user?.role === "Admin" && (
            <Button onClick={() => navigate("/admin")}>לוח מנהל</Button>
          )}

          {!isLoggedIn && (
            <>
              <Button onClick={() => navigate("/login")}>התחברות</Button>
              <Button onClick={() => navigate("/signup")}>הרשמה</Button>
            </>
          )}

          {isLoggedIn && (
            <Button color="error" onClick={logout}>
              התנתקות
            </Button>
          )}

          <Button
            variant="contained"
            color="success"
            href={whatsappUrl}
            target="_blank"
          >
            פנייה למנהל
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
