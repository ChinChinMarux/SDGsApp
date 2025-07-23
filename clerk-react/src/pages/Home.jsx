import React from "react";
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Stack, 
  Card,
  CardContent,
  Chip,
  Grid,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Analytics,
  AutoAwesome,
  TrendingUp,
  Speed
} from "@mui/icons-material";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Analytics sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Analisis Cerdas",
      description: "Menggunakan LDA Topic Modeling untuk analisis dokumen yang akurat"
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Otomatis",
      description: "Proses mapping ke SDG dilakukan secara otomatis dan efisien"
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Insight Mendalam",
      description: "Dapatkan wawasan mendalam tentang kesesuaian dengan SDG"
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Cepat & Akurat",
      description: "Hasil analisis yang cepat dengan tingkat akurasi tinggi"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0), 
                           radial-gradient(circle at 75px 75px, white 2px, transparent 0)`,
          backgroundSize: "100px 100px",
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          py: 8
        }}>
          {/* Main Content */}
          <Box sx={{ mb: 8, maxWidth: "800px" }}>
            <Chip 
              label="AI-Powered Analysis" 
              color="primary" 
              variant="outlined"
              sx={{ 
                mb: 4,
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                borderColor: "rgba(255,255,255,0.3)"
              }}
            />
            
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              color="white"
              sx={{ 
                mb: 3,
                fontSize: { xs: "2.5rem", md: "4rem" },
                lineHeight: 1.2
              }}
            >
              SDG Mapping
            </Typography>
            
            <Typography 
              variant="h6" 
              color="rgba(255,255,255,0.9)"
              sx={{ 
                mb: 6, 
                lineHeight: 1.6,
                maxWidth: "600px",
                mx: "auto"
              }}
            >
              Analisis dokumen otomatis ke Sustainable Development Goals 
              dengan teknologi LDA Topic Modeling yang canggih dan akurat.
            </Typography>

            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              sx={{ justifyContent: "center", mb: 8 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  px: 5,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 3,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  "&:hover": {
                    bgcolor: "grey.100",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Masuk
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 5,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 3,
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Daftar
              </Button>
            </Stack>
          </Box>

          {/* Features Grid - Centered */}
          <Box sx={{ maxWidth: "900px", width: "100%" }}>
            <Grid container spacing={3} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    sx={{ 
                      height: "100%",
                      bgcolor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        color="text.primary"
                        sx={{ mb: 1, fontSize: "1rem" }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ lineHeight: 1.5, fontSize: "0.9rem" }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Stats Section - Centered */}
          <Paper 
            elevation={0}
            sx={{ 
              mt: 8,
              p: 4,
              bgcolor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.2)",
              maxWidth: "600px",
              width: "100%"
            }}
          >
            <Grid container spacing={4} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  17
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  SDG Goals
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  99%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Akurasi
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  &lt;10s
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Waktu Analisis
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}