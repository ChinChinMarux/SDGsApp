// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Tooltip,
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CustomLogin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const sdgData = [
    { color: "#E5243B", name: "No Poverty" },
    { color: "#DDA83A", name: "Zero Hunger" },
    { color: "#4C9F38", name: "Good Health and Well-being" },
    { color: "#C5192D", name: "Quality Education" },
    { color: "#FF3A21", name: "Gender Equality" },
    { color: "#26BDE2", name: "Clean Water and Sanitation" },
    { color: "#FCC30B", name: "Affordable and Clean Energy" },
    { color: "#A21942", name: "Decent Work and Economic Growth" },
    { color: "#FD6925", name: "Industry, Innovation and Infrastructure" },
    { color: "#DD1367", name: "Reduced Inequality" },
    { color: "#FD9D24", name: "Sustainable Cities and Communities" },
    { color: "#BF8B2E", name: "Responsible Consumption and Production" },
    { color: "#3F7E44", name: "Climate Action" },
    { color: "#0A97D9", name: "Life Below Water" },
    { color: "#56C02B", name: "Life on Land" },
    { color: "#00689D", name: "Peace and Justice Strong Institutions" },
    { color: "#19486A", name: "Partnerships to achieve the Goal" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error("Login gagal:", err);
      setErrMsg(err.errors?.[0]?.message || "Login gagal");
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("Google sign in error:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #eef2f7 0%, #e5ecf6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            display: "flex",
            overflow: "hidden",
            minHeight: 600,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* LEFT PANEL */}
          <Box
            sx={{
              width: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 6,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                fontSize: 36,
                fontWeight: "bold",
              }}
            >
              S
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              SDG Mapping Tools
            </Typography>
            <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
              Topic Modelling LDA
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: 300, lineHeight: 1.6 }}>
              Analisis dokumen dan pemetaan otomatis ke Sustainable Development Goals
            </Typography>
            <Grid container spacing={1} sx={{ maxWidth: 280 }}>
              {sdgData.map((sdg, index) => (
                <Grid item xs={2} key={index}>
                  <Tooltip title={`SDG ${index + 1}: ${sdg.name}`} placement="top" arrow>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: sdg.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 14,
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.1)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                          zIndex: 10,
                        },
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* RIGHT PANEL */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fafafa",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 400 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 1, color: "#333" }}>
                Selamat Datang!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "#666", fontSize: 16 }}>
                Masuk ke akun Anda untuk mengakses sistem SDG Mapping
              </Typography>

              {errMsg && (
                <Typography
                  color="error"
                  sx={{
                    mb: 2,
                    p: 1,
                    backgroundColor: "#ffebee",
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  {errMsg}
                </Typography>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#333" }}>
                  Email atau Username
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Masukkan email atau username Anda"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                      height: 48,
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#667eea" },
                      "&.Mui-focused fieldset": { borderColor: "#667eea" },
                    },
                  }}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#333" }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Masukkan password Anda"
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                      height: 48,
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: "#667eea" },
                      "&.Mui-focused fieldset": { borderColor: "#667eea" },
                    },
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        size="small"
                        sx={{
                          color: "#667eea",
                          "&.Mui-checked": { color: "#667eea" },
                        }}
                      />
                    }
                    label={<Typography variant="body2" color="#666">Ingat Saya</Typography>}
                  />
                  <Button variant="text" size="small" sx={{ color: "#667eea", textTransform: "none", fontSize: "0.875rem" }}>
                    Lupa Password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    mb: 3,
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    },
                  }}
                >
                  Masuk
                </Button>

                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="body2" color="#666">
                    atau login dengan
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{
                    height: 48,
                    borderRadius: 2,
                    borderColor: "#ddd",
                    color: "#666",
                    textTransform: "none",
                    fontSize: "1rem",
                    mb: 3,
                    "&:hover": {
                      borderColor: "#667eea",
                      backgroundColor: "#f8f9ff",
                    },
                  }}
                >
                  Masuk dengan Google
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="#666">
                    Belum punya akun?{" "}
                    <Button
                      variant="text"
                      sx={{
                        color: "#667eea",
                        textTransform: "none",
                        p: 0,
                        minWidth: "auto",
                        fontSize: "0.875rem",
                      }}
                      onClick={() => navigate("/register")}
                    >
                      Daftar sekarang!
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomLogin;
