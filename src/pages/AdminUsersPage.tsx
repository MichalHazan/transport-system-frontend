import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminUsersPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      {/* כפתור חזור */}
      <Button
        variant="outlined"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin")}
      >
        חזור לדשבורד
      </Button>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        ניהול משתמשים
      </Typography>

      {users.map((u: any) => (
        <Paper
          key={u._id}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: "1px solid #ddd",
            bgcolor: "#fafafa",
            direction: "rtl",
            textAlign: "right"
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            {u.fullName}
          </Typography>

          <Typography>תפקיד: {u.role}</Typography>
          <Typography>טלפון: {u.phone}</Typography>
          <Typography>אימייל: {u.email}</Typography>

          {u.role === "Supplier" && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ fontWeight: 600 }}>פרטי ספק:</Typography>
              <Typography>חברה: {u.company}</Typography>

              {u.vehicles && u.vehicles.length > 0 && (
                <>
                  <Typography sx={{ mt: 1, fontWeight: 600 }}>
                    כלי רכב:
                  </Typography>
                  {u.vehicles.map((v: any, idx: number) => (
                    <Typography key={idx}>
                      {v.type} – {v.seats} מקומות – לוחית: {v.licensePlate}
                    </Typography>
                  ))}
                </>
              )}
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default AdminUsersPage;
