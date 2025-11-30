import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import NewQuoteDialog from "../components/supplier/NewQuoteDialog";

const API = import.meta.env.VITE_API_BASE_URL;

const SupplierDashboard: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [filter, setFilter] = useState("all");

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [openQuoteDialog, setOpenQuoteDialog] = useState(false);

  const fetchRequests = async () => {
    const res = await axios.get(`${API}/supplier/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests(res.data);
  };

  const fetchQuotes = async () => {
    const res = await axios.get(`${API}/supplier/quotes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuotes(res.data);
  };

  useEffect(() => {
    fetchRequests();
    fetchQuotes();
  }, []);

  const openQuote = (req: any) => {
    setSelectedRequest(req);
    setOpenQuoteDialog(true);
  };

  const deleteQuote = async (id: string) => {
    await axios.delete(`${API}/quotes/supplier/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchQuotes();
  };

  // 📌 בקשות פתוחות רק אם לא אושרו
  const openRequests = requests.filter((req: any) => {
    const approved = quotes.some(
      (q: any) =>
        q.rideRequestId?._id === req._id &&
        q.approved === true
    );
    return !approved;
  });

  // 📌 סינון הצעות
  const filteredQuotes = quotes.filter((q: any) => {
    if (filter === "pending") return !q.approved && !q.canceled;
    if (filter === "approved") return q.approved;
    if (filter === "canceled") return q.canceled;
    return true;
  });

  return (
    <Box dir="rtl">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        דשבורד ספק
      </Typography>

      {/* בקשות פתוחות */}
      <Typography variant="h6">בקשות פתוחות</Typography>
      <Divider sx={{ mb: 2 }} />

      {openRequests.length === 0 ? (
        <Typography>אין בקשות זמינות.</Typography>
      ) : (
        openRequests.map((req: any) => (
          <Paper
            key={req._id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: "#eef3fc",
              border: "1px solid #c3d1ec",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {req.tripType}
            </Typography>

            <Typography>
              {req.origin} → {req.destinations.join(" → ")}
            </Typography>

            <Typography>שעת יציאה: {req.departureTime}</Typography>

            <Typography sx={{ mb: 1 }}>מקומות: {req.seats}</Typography>

            <Button variant="contained" onClick={() => openQuote(req)}>
              הגש הצעת מחיר
            </Button>
          </Paper>
        ))
      )}

      <Divider sx={{ my: 3 }} />

      {/* סינון הצעות */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        הצעות שהגשתי
      </Typography>

      <TextField
        select
        label="סינון הצעות"
        sx={{ mb: 2, width: 250 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <MenuItem value="all">הכול</MenuItem>
        <MenuItem value="pending">ממתינות</MenuItem>
        <MenuItem value="approved">מאושרות</MenuItem>
        <MenuItem value="canceled">מבוטלות</MenuItem>
      </TextField>

      {filteredQuotes.length === 0 ? (
        <Typography>אין הצעות בקטגוריה זו.</Typography>
      ) : (
        filteredQuotes.map((q: any) => (
          <Paper
            key={q._id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: "#f3f9f5",
              border: "1px solid #c5e6cf",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              מחיר: {q.price} ₪
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>פרטי נסיעה:</Typography>
              <Typography>מוצא: {q.rideRequestId.origin}</Typography>
              <Typography>
                יעדים: {q.rideRequestId.destinations.join(" → ")}
              </Typography>
              <Typography>
                שעת יציאה: {q.rideRequestId.departureTime}
              </Typography>
              <Typography>מקומות: {q.rideRequestId.seats}</Typography>
            </Box>

            <Typography sx={{ mt: 1 }}>
              סטטוס:{" "}
              {q.canceled ? (
                <span style={{ color: "red" }}>מבוטלת</span>
              ) : q.approved ? (
                <span style={{ color: "green" }}>אושרה</span>
              ) : (
                "ממתינה לאישור"
              )}
            </Typography>

            <Typography sx={{ mt: 1, color: "gray" }}>
              הוגש בתאריך: {new Date(q.createdAt).toLocaleString("he-IL")}
            </Typography>

            <Button
              sx={{ mt: 1 }}
              color="error"
              disabled={q.approved}
              onClick={() => deleteQuote(q._id)}
            >
              מחק הצעה
            </Button>
          </Paper>
        ))
      )}

      <NewQuoteDialog
        open={openQuoteDialog}
        onClose={() => setOpenQuoteDialog(false)}
        request={selectedRequest}
        onSubmitted={() => {
          fetchQuotes();
          fetchRequests();
        }}
      />
    </Box>
  );
};

export default SupplierDashboard;
