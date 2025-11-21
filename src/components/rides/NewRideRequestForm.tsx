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
  MenuItem
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const steps = ["פרטי נסיעה", "יעדים", "רכב ומקומות"];

const NewRideRequestForm: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const { token } = useContext(AuthContext);

  // --- Step State ---
  const [activeStep, setActiveStep] = useState(0);

  // --- Form Fields ---
  const [tripType, setTripType] = useState("");
  const [origin, setOrigin] = useState("");

  const [destinations, setDestinations] = useState<string[]>([""]);

  const [vehicleType, setVehicleType] = useState("");
  const [seats, setSeats] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setActiveStep(0);
    setTripType("");
    setOrigin("");
    setDestinations([""]);
    setVehicleType("");
    setSeats("");
  };

  const handleAddDestination = () => {
    setDestinations([...destinations, ""]);
  };

  const handleRemoveDestination = (index: number) => {
    const newList = destinations.filter((_, i) => i !== index);
    setDestinations(newList);
  };

  const handleDestinationChange = (value: string, index: number) => {
    const newList = [...destinations];
    newList[index] = value;
    setDestinations(newList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/client/ride`,
        {
          tripType,
          origin,
          destinations,
          vehicleType,
          seats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onCreated();
      onClose();
      resetForm();
    } catch (err) {
      console.error("Failed to create ride", err);
    } finally {
      setLoading(false);
    }
  };

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
              <MenuItem value="עסקית">עסקית</MenuItem>
              <MenuItem value="חופשה">חופשה</MenuItem>
              <MenuItem value="אחר">אחר</MenuItem>
            </TextField>

            <TextField
              label="מוצא"
              fullWidth
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />

          </Box>
        );

      case 1:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            {destinations.map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <TextField
                  label={`יעד ${index + 1}`}
                  fullWidth
                  value={item}
                  onChange={(e) =>
                    handleDestinationChange(e.target.value, index)
                  }
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
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleAddDestination}
            >
              יעד נוסף
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="סוג רכב"
              select
              fullWidth
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <MenuItem value="רכב פרטי">רכב פרטי</MenuItem>
              <MenuItem value="מיניבוס">מיניבוס</MenuItem>
              <MenuItem value="אוטובוס">אוטובוס</MenuItem>
            </TextField>

            <TextField
              label="מספר מקומות"
              type="number"
              fullWidth
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle sx={{ fontWeight: 600 }}>
        בקשה לנסיעה חדשה
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
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {activeStep > 0 && (
          <Button onClick={() => setActiveStep(activeStep - 1)}>
            הקודם
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setActiveStep(activeStep + 1)}
          >
            הבא
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "שולח..." : "שלח בקשה"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewRideRequestForm;
