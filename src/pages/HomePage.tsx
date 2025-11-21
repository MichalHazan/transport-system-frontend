import React from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#e9eef5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        textAlign: "right",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          מערכת ניהול הסעות
        </Typography>

        <Typography sx={{ mb: 3 }}>
          המערכת מחברת בין ספקי שירותי הסעה (אוטובוסים, מיניבוסים ורכבים פרטיים)
          לבין לקוחות פרטיים ועסקיים, עם תיווך מלא של מנהל המערכת, ניהול הצעות מחיר,
          אישור עסקאות ומעקב אחרי כל הנסיעות.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "flex-start" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/signup")}
          >
            הרשמה
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/login")}
          >
            התחברות
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomePage;
