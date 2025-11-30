import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const steps = ["פרטי נסיעה", "יעדים"];

// ⭐ רשימת ערים (אפשר להרחיב)
const cities = [
  "תל אביב",
  "רמת גן",
  "גבעתיים",
  "הרצליה",
  "ראשון לציון",
  "חולון",
  "בת ים",
  "נתניה",
  "אילת",
  "באר שבע",
  "ירושלים",
  "חיפה",
  "פתח תקווה",
  "מודיעין",
  "רעננה",
  "כפר סבא",
];

const NewRideRequestForm: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const { token } = useContext(AuthContext);

  const [activeStep, setActiveStep] = useState(0);

  const [tripType, setTripType] = useState("");
  const [origin, setOrigin] = useState("");
  const [destinations, setDestinations] = useState<string[]>([""]);
  const [seats, setSeats] = useState<number | "">("");
  const [departureTime, setDepartureTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⭐ הודעה ירוקה
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setActiveStep(0);
    setTripType("");
    setOrigin("");
    setDestinations([""]);
    setSeats("");
    setDepartureTime("");
    setError("");
  };

  // -------- Destination Add / Remove ----------
  const handleAddDestination = () => setDestinations([...destinations, ""]);
  const handleRemoveDestination = (index: number) => {
    const newList = destinations.filter((_, i) => i !== index);
    setDestinations(newList);
  };
  const handleDestinationChange = (value: string, index: number) => {
    const newList = [...destinations];
    newList[index] = value;
    setDestinations(newList);
  };

  // -------- VALIDATION ----------
  const validateStep = () => {
    if (activeStep === 0) {
      if (!tripType || !origin || !seats || seats <= 0) {
        setError("יש למלא את כל השדות");
        return false;
      }
    }

    if (activeStep === 1) {
      if (
        destinations.length === 0 ||
        destinations.some((d) => !d.trim()) ||
        !departureTime
      ) {
        setError("יש למלא את כל השדות");
        return false;
      }
    }

    setError("");
    return true;
  };

  // -------- SUBMIT ----------
  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/client/ride`,
        {
          tripType,
          origin,
          destinations,
          seats,
          departureTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true); // ⭐ הצגת הודעה ירוקה
      onCreated();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to create ride", err);
      setError("שגיאה ביצירת הבקשה");
    } finally {
      setLoading(false);
    }
  };

  // -------- RENDER STEPS ----------
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="סוג נסיעה"
              select
              fullWidth
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <MenuItem value="חד פעמית">חד פעמית</MenuItem>
              <MenuItem value="קבועה">קבועה</MenuItem>
            </TextField>

            {/* ⭐ אוטוקומפליט למוצא */}
            <Autocomplete
              freeSolo
              options={cities}
              value={origin}
              onChange={(_, value) => setOrigin(value || "")}
              renderInput={(params) => (
                <TextField {...params} label="מוצא" fullWidth />
              )}
            />

            <TextField
              label="מספר מקומות"
              type="number"
              fullWidth
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </Box>
        );

      case 1:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            {/* ⭐ יעד עם אוטוקומפליט */}
            {destinations.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <Autocomplete
                  freeSolo
                  fullWidth
                  options={cities}
                  value={item}
                  onChange={(_, value) =>
                    handleDestinationChange(value || "", index)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={`יעד ${index + 1}`} />
                  )}
                />

                {index > 0 && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveDestination(index)}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
            ))}

            <Button
              startIcon={<AddCircleIcon />}
              onClick={handleAddDestination}
            >
              יעד נוסף
            </Button>

            {/* ⭐ שעת יציאה */}
            <TextField
              label="שעת יציאה"
              type="time"
              fullWidth
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        {/* ⭐ כפתור X */}
        <DialogTitle
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          בקשה לנסיעה חדשה
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}

          {error && (
            <Box sx={{ color: "red", mt: 2, textAlign: "right" }}>{error}</Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>הקודם</Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => validateStep() && setActiveStep(activeStep + 1)}
            >
              הבא
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "שולח..." : "שלח בקשה"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ⭐ הודעה ירוקה */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          הבקשה נוצרה בהצלחה!
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewRideRequestForm;
