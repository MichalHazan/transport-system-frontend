import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        העמוד שחיפשת לא נמצא
      </Typography>

      <Typography sx={{ mb: 4, color: "text.secondary" }}>
        יתכן שהקישור שגוי או שהעמוד הועבר.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ px: 4, py: 1.3 }}
      >
        חזרה לדף הבית
      </Button>
    </Box>
  );
};

export default NotFoundPage;
