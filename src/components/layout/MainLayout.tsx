import React from "react";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box dir="rtl">
      <Navbar />
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};

export default MainLayout;
