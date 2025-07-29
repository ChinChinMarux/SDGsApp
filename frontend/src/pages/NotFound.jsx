import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const currentUrl = window.location.href;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#f8fafc",
        px: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700, color: "#667eea" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2, color: "#444" }}>
        Halaman tidak ditemukan
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "#666" }}>
        Alamat yang kamu tuju tidak valid:
        <br />
        <code style={{ color: "#e53e3e", wordBreak: "break-word" }}>
          {currentUrl}
        </code>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ textTransform: "none", px: 4, py: 1 }}
      >
        Kembali ke Beranda
      </Button>
    </Box>
  );
};

export default NotFound;
