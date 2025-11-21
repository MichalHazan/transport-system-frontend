import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

import ClientOrdersTable from "../components/rides/ClientOrdersTable";
import NewRideRequestForm from "../components/rides/NewRideRequestForm";

const API = import.meta.env.VITE_API_BASE_URL;

const ClientDashboard: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [rides, setRides] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openNewRide, setOpenNewRide] = useState(false);

  /**
   * 📌 בקשות נסיעה של הלקוח
   */
  const fetchRides = async () => {
    try {
      const res = await axios.get(`${API}/client/ride`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data);
    } catch (err) {
      console.error("Error fetching rides", err);
    }
  };

  /**
   * 📌 הצעות מחיר עבור בקשות הלקוח
   */
  const fetchQuotes = async () => {
    try {
      const res = await axios.get(`${API}/client/quotes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(res.data);
    } catch (err) {
      console.error("Error fetching quotes", err);
    }
  };

  /**
   * 📌 מחיקת בקשה
   * רק אם אין הצעות
   */
  const deleteRide = async (id: string) => {
    try {
      await axios.delete(`${API}/client/ride/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRides();
      fetchQuotes();
    } catch (err: any) {
      alert(err.response?.data?.message || "שגיאה במחיקת הבקשה");
    }
  };

  /**
   * 📌 שליפה ראשונית
   */
  useEffect(() => {
    const load = async () => {
      await fetchRides();
      await fetchQuotes();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box dir="rtl">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        דשבורד לקוח
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => setOpenNewRide(true)}
      >
        יצירת בקשה חדשה
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* טבלת בקשות + הצעות */}
      <ClientOrdersTable rides={rides} quotes={quotes} onDelete={deleteRide} />

      {/* טופס הוספת בקשה */}
      <NewRideRequestForm
        open={openNewRide}
        onClose={() => setOpenNewRide(false)}
        onCreated={() => {
          fetchRides();
          fetchQuotes();
        }}
      />
    </Box>
  );
};

export default ClientDashboard;
