import React, { useContext, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const UserProfileDialog: React.FC<Props> = ({ open, onClose, onUpdated }) => {
  const { user, token, setUser } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone);
      setCompany(user.company || "");
    }
  }, [user]);

  const handleSubmit = async () => {
    setError("");

    if (!/^05\d{8}$/.test(phone)) {
      setError("מספר הטלפון שהוזן אינו תקין");
      return;
    }

    try {
      const res = await axios.put(
        `${API}/users/update`,
        {
          fullName,
          email,
          phone,
          company: user?.role === "Supplier" ? company : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
      setError("שגיאה בעדכון הפרטים");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth dir="rtl">
      <DialogTitle>עריכת פרטים אישיים</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="שם מלא"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
          />

          <TextField
            label="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="טלפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
          />

          {user?.role === "Supplier" && (
            <TextField
              label="שם חברה"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button variant="contained" onClick={handleSubmit}>
          שמירה
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileDialog;
