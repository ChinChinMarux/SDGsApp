// src/pages/Home.jsx
import React from "react";
import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold" color="primary">
          SDG Mapping
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Analisis dokumen otomatis ke Sustainable Development Goals dengan LDA Topic Modeling.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
          >
            Masuk
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate("/register")}
          >
            Daftar
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
