import React, { useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

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

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200 }}>
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            borderRadius: 3,
            display: "flex",
            overflow: "hidden",
            minHeight: 600,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              width: "50%",
              color: "white",
              p: 6,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Box sx={{
              width: 80, height: 80, borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.2)", display: "flex",
              alignItems: "center", justifyContent: "center",
              mb: 3, fontSize: 36, fontWeight: "bold"
            }}>
              S
            </Box>

            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              SDG Mapping Tools
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, opacity: 0.9 }}>
              Topic Modelling LDA
            </Typography>

            <Typography variant="body1" sx={{
              mb: 4, opacity: 0.8, maxWidth: 300, lineHeight: 1.6
            }}>
              Analisis dokumen dan pemetaan otomatis ke Sustainable Development Goals
            </Typography>

            <Grid container spacing={1} sx={{ maxWidth: 280 }}>
              {sdgData.map((sdg, index) => (
                <Grid item xs={2} key={index}>
                  <Tooltip
                    title={`SDG ${index + 1}: ${sdg.name}`}
                    placement="top"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          fontSize: '12px',
                          maxWidth: 200,
                          textAlign: 'center',
                          '& .MuiTooltip-arrow': {
                            color: 'rgba(0,0,0,0.8)',
                          },
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40, height: 40, borderRadius: "50%",
                        bgcolor: sdg.color, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: 14, fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.1)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.3)", zIndex: 10,
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

          {/* Right Side */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
                Daftarkan Diri,
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "#666", fontSize: 16 }}>
                Bersiap untuk akses ke sistem SDGS Mapping!
              </Typography>

              {/* Form Section */}
              <Box component="form">
                {/* Username */}
                <Typography variant="body2" sx={{ mb: 1, fontWeight: "500", color: "#333" }}>
                  Username
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Masukkan username Anda"
                  value={formData.username}
                  onChange={handleInputChange("username")}
                  sx={inputFieldStyle}
                />

                {/* Email */}
                <Typography variant="body2" sx={{ mb: 1, fontWeight: "500", color: "#333" }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  sx={inputFieldStyle}
                />

                {/* Password */}
                <Typography variant="body2" sx={{ mb: 1, fontWeight: "500", color: "#333" }}>
                  Kata Sandi
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputFieldStyle}
                />

                {/* Confirm Password */}
                <Typography variant="body2" sx={{ mb: 1, fontWeight: "500", color: "#333" }}>
                  Konfirmasi Kata Sandi
                </Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi kata sandi Anda"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputFieldStyle}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={submitButtonStyle}
                >
                  Daftar
                </Button>

                {/* Divider */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="body2" color="#666">
                    atau daftar dengan
                  </Typography>
                </Box>

                {/* Google */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignUp}
                  sx={googleButtonStyle}
                >
                  Daftar dengan Google
                </Button>

                {/* Login Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="#666">
                    Sudah punya akun?{" "}
                    <Button
                      variant="text"
                      sx={{
                        color: "#667eea",
                        textTransform: "none",
                        p: 0,
                        minWidth: "auto",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Masuk sekarang!
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

// 🎨 Styling Constants
const inputFieldStyle = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "rgba(243, 243, 243, 0.8)",
    height: 48,
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "rgba(102, 126, 234, 0.8)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
  },
};

const submitButtonStyle = {
  height: 48,
  borderRadius: 2,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: "600",
  mb: 3,
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
  },
};

const googleButtonStyle = {
  height: 48,
  borderRadius: 2,
  borderColor: "#ddd",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  color: "#666",
  textTransform: "none",
  fontSize: "1rem",
  mb: 3,
  backdropFilter: "blur(5px)",
  "&:hover": {
    borderColor: "rgba(102, 126, 234, 0.8)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
};

export default RegisterPage;
