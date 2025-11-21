import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  request: any;
}

const NewQuoteDialog: React.FC<Props> = ({ open, onClose, request, onSubmitted }) => {
  const { token } = useContext(AuthContext);
  const [price, setPrice] = useState<number | "">("");

  const submitQuote = async () => {
    if (!price) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/supplier/quote`,
        {
          price: Number(price),
          rideRequestId: request._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSubmitted();
      onClose();
      setPrice("");
    } catch (err) {
      console.error("Error submitting quote:", err);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הגשת הצעת מחיר</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          <strong>פרטי הנסיעה:</strong>
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography>מוצא: {request.origin}</Typography>
          <Typography>
            יעדים: {request.destinations.join(" → ")}
          </Typography>
          <Typography>סוג רכב: {request.vehicleType}</Typography>
          <Typography>מקומות: {request.seats}</Typography>
        </Box>

        <TextField
          label="מחיר מוצע (₪)"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>

        <Button
          variant="contained"
          color="success"
          onClick={submitQuote}
          disabled={!price}
        >
          שלח הצעה
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewQuoteDialog;
