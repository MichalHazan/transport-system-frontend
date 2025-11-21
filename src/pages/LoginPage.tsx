import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user, isLoggedIn } = useContext(AuthContext);

useEffect(() => {
  if (isLoggedIn && user) {
    if (user.role === "Client") navigate("/client");
    if (user.role === "Supplier") navigate("/supplier");
    if (user.role === "Admin") navigate("/admin");
  }
}, [isLoggedIn, user]);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      setErrorMsg("");
      setLoading(true);

      const success = await login(email, password);
      if (!success) {
        setErrorMsg("פרטי התחברות שגויים");
        return;
      }

      // ניווט לפי תפקיד המשתמש
      if (user?.role === "Client") navigate("/client");
      else if (user?.role === "Supplier") navigate("/supplier");
      else if (user?.role === "Admin") navigate("/admin");

    } catch (err: any) {
      setErrorMsg("שגיאת התחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#e9eef5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          התחברות למערכת ההסעות
        </Typography>

        <TextField
          fullWidth
          label="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="סיסמה"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        {errorMsg && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.4, fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={26} color="inherit" /> : "התחבר"}
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
