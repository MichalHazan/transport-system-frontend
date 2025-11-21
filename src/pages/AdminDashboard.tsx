import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard: React.FC = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [rideRequests, setRideRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchOverview = async () => {
    const res = await axios.get(`${API}/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRideRequests(res.data.rideRequests);
    setQuotes(res.data.quotes);
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // בקשות ללא הצעות
  const requestsWithoutQuotes = rideRequests.filter(
    (req: any) =>
      !quotes.some((q: any) => q.rideRequestId?._id === req._id)
  );

  // הצעות לפי סינון
  const filteredQuotes = quotes.filter((q: any) => {
    if (filter === "approved") return q.approved;
    if (filter === "pending") return !q.approved && !q.canceled;
    if (filter === "canceled") return q.canceled;
    return true;
  });

  // מנהל מאשר
  const approveDeal = async (id: string) => {
    await axios.post(
      `${API}/admin/approve`,
      { quoteId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOverview();
  };

  // מנהל מבטל הצעה
  const cancelQuote = async (id: string) => {
    await axios.put(
      `${API}/quotes/admin/cancel/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOverview();
  };

  // מחיקת הצעה
  const deleteQuote = async (id: string) => {
    await axios.delete(`${API}/admin/quote/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOverview();
  };

  // מחיקת בקשה + מחיקת כל ההצעות אליה
  const deleteRide = async (id: string) => {
    await axios.delete(`${API}/admin/ride/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOverview();
  };

  return (
    <Box dir="rtl">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        דשבורד מנהל
      </Typography>
      
       {/* כפתור ניהול משתמשים */}
       <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => navigate("/admin/users")}
      >
        ניהול משתמשים
      </Button>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        
      </Typography>

      {/* סינון */}
      <TextField
        select
        label="סינון הצעות"
        sx={{ mb: 3, width: 250 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <MenuItem value="all">כל ההצעות</MenuItem>
        <MenuItem value="pending">ממתינות</MenuItem>
        <MenuItem value="approved">מאושרות</MenuItem>
        <MenuItem value="canceled">מבוטלות</MenuItem>
      </TextField>

      {/* בקשות ללא הצעות */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        בקשות ללא הצעות
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {requestsWithoutQuotes.length === 0 ? (
        <Typography sx={{ mb: 3 }}>אין בקשות ללא הצעות.</Typography>
      ) : (
        requestsWithoutQuotes.map((req: any) => (
          <Paper
            key={req._id}
            sx={{ p: 2, mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {req.tripType} | {req.vehicleType}
            </Typography>

            <Typography>מוצא: {req.origin}</Typography>
            <Typography>
              יעדים: {req.destinations.join(" → ")}
            </Typography>
            <Typography>מקומות: {req.seats}</Typography>

            {/* פרטי לקוח */}
            {req.clientId && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>לקוח:</Typography>
                <Typography>שם: {req.clientId.fullName}</Typography>
                <Typography>טלפון: {req.clientId.phone}</Typography>
                <Typography>מייל: {req.clientId.email}</Typography>
              </Box>
            )}

            {/* מחיקה של בקשה */}
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => deleteRide(req._id)}
            >
              מחק בקשה
            </Button>
          </Paper>
        ))
      )}

      <Divider sx={{ my: 3 }} />

      {/* הצעות */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        הצעות מחיר
      </Typography>

      {filteredQuotes.map((q: any) => (
        <Paper
          key={q._id}
          sx={{ p: 2, mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            מחיר: {q.price} ₪
          </Typography>

          <Typography sx={{ mt: 1 }}>
            סטטוס:{" "}
            {q.canceled ? (
              <span style={{ color: "red" }}>מבוטלת</span>
            ) : q.approved ? (
              <span style={{ color: "green" }}>מאושרת</span>
            ) : (
              "ממתינה לאישור"
            )}
          </Typography>

          {/* פרטי נסיעה */}
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>נסיעה:</Typography>
            <Typography>מוצא: {q.rideRequestId.origin}</Typography>
            <Typography>
              יעדים: {q.rideRequestId.destinations.join(" → ")}
            </Typography>
            <Typography>
              נוצרה:{" "}
              {new Date(q.rideRequestId.createdAt).toLocaleString("he-IL")}
            </Typography>
          </Box>

          {/* פרטי לקוח */}
          {q.rideRequestId?.clientId && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>לקוח:</Typography>
              <Typography>שם: {q.rideRequestId.clientId.fullName}</Typography>
              <Typography>טלפון: {q.rideRequestId.clientId.phone}</Typography>
              <Typography>מייל: {q.rideRequestId.clientId.email}</Typography>
            </Box>
          )}

          {/* פרטי ספק */}
          {q.supplierId && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>ספק:</Typography>
              <Typography>שם: {q.supplierId.fullName}</Typography>
              <Typography>טלפון: {q.supplierId.phone}</Typography>
              <Typography>מייל: {q.supplierId.email}</Typography>
            </Box>
          )}

          {/* פעולות מנהל */}
          {!q.approved && !q.canceled && (
            <>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2, mr: 1 }}
                onClick={() => approveDeal(q._id)}
              >
                אישור הצעה
              </Button>

              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => cancelQuote(q._id)}
              >
                בטל הצעה
              </Button>
            </>
          )}

          {/* מחיקת הצעה ע"י מנהל */}
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => deleteQuote(q._id)}
          >
            מחק הצעה
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default AdminDashboard;
