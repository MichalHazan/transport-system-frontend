import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { UserRole } from "../types/UserRole";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("Client");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async () => {
    try {
      setErrorMsg("");
      if (!/^05[0-9]{8}$/.test(phone)) {
        setErrorMsg("מספר טלפון לא תקין");
        return;
      }
      

      await signup({
        fullName,
        email,
        password,
        role,
        phone,
        company: role === "Supplier" ? company : undefined,
      });

      if (role === "Client") navigate("/client");
      else if (role === "Supplier") navigate("/supplier");
      else navigate("/admin");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
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
          maxWidth: 450,
          p: 4,
          borderRadius: 3,
          textAlign: "right",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          הרשמה למערכת
        </Typography>

        <TextField
          fullWidth
          label="שם מלא"
          sx={{ mb: 2 }}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <TextField
          fullWidth
          label="אימייל"
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="טלפון"
          sx={{ mb: 2 }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <TextField
          fullWidth
          select
          label="סוג משתמש"
          sx={{ mb: 2 }}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <MenuItem value="Client">לקוח</MenuItem>
          <MenuItem value="Supplier">ספק</MenuItem>
        </TextField>

        {role === "Supplier" && (
          <TextField
            fullWidth
            label="שם העסק / חברה"
            sx={{ mb: 2 }}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        )}

        <TextField
          fullWidth
          label="סיסמה"
          type="password"
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={handleSignup}
          sx={{ py: 1.3, mb: 1 }}
        >
          הרשמה
        </Button>

        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={() => navigate("/login")}
        >
          כבר רשום? התחבר כאן
        </Button>
      </Paper>
    </Box>
  );
};

export default SignupPage;
