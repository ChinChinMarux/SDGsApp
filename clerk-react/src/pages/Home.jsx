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
  Paper,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Analytics,
  AutoAwesome,
  TrendingUp,
  Speed,
  Flag,
  Verified,
  Timer
} from "@mui/icons-material";

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Analytics sx={{ fontSize: 50 }} />,
      title: "Analisis Cerdas",
      description: "Menggunakan LDA Topic Modeling untuk analisis dokumen yang akurat dan mendalam"
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 50 }} />,
      title: "Otomatis",
      description: "Proses mapping ke SDG dilakukan secara otomatis dan efisien tanpa input manual"
    },
    {
      icon: <TrendingUp sx={{ fontSize: 50 }} />,
      title: "Insight Mendalam",
      description: "Dapatkan wawasan mendalam tentang kesesuaian dokumen dengan SDG goals"
    },
    {
      icon: <Speed sx={{ fontSize: 50 }} />,
      title: "Cepat & Akurat",
      description: "Hasil analisis yang cepat dengan tingkat akurasi tinggi dan konsisten"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      position: "relative",
      overflow: "hidden",
      color: "white"
    }}>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          right: "-50%",
          bottom: "-50%",
          background: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 20%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 20%)
          `,
          animation: "rotate 20s linear infinite",
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" }
          }
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
          py: 8,
          position: "relative"
        }}>
          {/* Floating Circles */}
          <Box sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(20px)",
            zIndex: -1
          }} />
          <Box sx={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(30px)",
            zIndex: -1
          }} />
          
          {/* Main Content */}
          <Box sx={{ 
            mb: 8, 
            maxWidth: "800px",
            px: 2,
            animation: "fadeIn 1s ease-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" }
            }
          }}>
            <Chip 
              label="AI-Powered Analysis" 
              color="primary" 
              variant="outlined"
              sx={{ 
                mb: 4,
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                fontSize: "0.9rem",
                px: 1.5,
                py: 1,
                backdropFilter: "blur(5px)"
              }}
            />
            
            <Typography 
              variant="h2" 
              fontWeight="bold" 
              sx={{ 
                mb: 3,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                lineHeight: 1.2,
                textShadow: "0 2px 10px rgba(0,0,0,0.2)"
              }}
            >
              SDG Mapping Platform
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6, 
                lineHeight: 1.6,
                maxWidth: "700px",
                mx: "auto",
                fontWeight: 400,
                opacity: 0.9,
                fontSize: { xs: "1rem", sm: "1.25rem" }
              }}
            >
              Analisis dokumen otomatis ke Sustainable Development Goals 
              dengan teknologi LDA Topic Modeling yang canggih dan akurat.
            </Typography>

            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              sx={{ 
                justifyContent: "center", 
                mb: 8,
                "& .MuiButton-root": {
                  minWidth: "200px"
                }
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "white",
                  color: theme.palette.primary.main,
                  px: 5,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 50,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  "&:hover": {
                    bgcolor: "grey.100",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.3)"
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
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 50,
                  borderWidth: 2,
                  backdropFilter: "blur(5px)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.15)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Daftar
              </Button>
            </Stack>
          </Box>

          {/* Features Section */}
          <Box sx={{ 
            maxWidth: "900px", 
            width: "100%", 
            mx: "auto", 
            mb: 8,
            px: 2
          }}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ 
                mb: 6,
                textAlign: "center",
                fontSize: { xs: "1.5rem", sm: "2rem" }
              }}
            >
              Fitur Unggulan Kami
            </Typography>
            
            <Grid container spacing={3} justifyContent="center">
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      height: "100%",
                      minHeight: "280px",
                      bgcolor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 3,
                      border: "none",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                      transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
                      },
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <CardContent sx={{ 
                      textAlign: "center", 
                      p: 4,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "& svg": {
                        color: theme.palette.primary.main
                      }
                    }}>
                      <Box>
                        <Box sx={{ 
                          mb: 3,
                          display: "inline-flex",
                          p: 2,
                          bgcolor: "rgba(102, 126, 234, 0.1)",
                          borderRadius: "50%"
                        }}>
                          {feature.icon}
                        </Box>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold" 
                          sx={{ 
                            mb: 2,
                            fontSize: { xs: "1.1rem", sm: "1.25rem" }
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          lineHeight: 1.6,
                          color: "text.secondary",
                          fontSize: "0.95rem",
                          maxWidth: "280px",
                          mx: "auto"
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Stats Section */}
          <Paper 
            elevation={0}
            sx={{ 
              mt: 4,
              p: { xs: 3, sm: 4 },
              bgcolor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              border: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              maxWidth: "900px",
              width: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)"
              }
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              textAlign="center"
              color="primary.main"
              sx={{ 
                mb: 4,
                fontSize: { xs: "1.25rem", sm: "1.5rem" }
              }}
            >
              Platform Terpercaya dengan Performa Terbaik
            </Typography>

            <Grid container spacing={4} textAlign="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(102, 126, 234, 0.1)",
                    transform: "translateY(-5px)"
                  }
                }}>
                  <Box sx={{ 
                    mb: 2,
                    p: 1.5,
                    bgcolor: "rgba(102, 126, 234, 0.15)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Flag sx={{ 
                      fontSize: 32, 
                      color: theme.palette.primary.main 
                    }} />
                  </Box>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    color="primary.main"
                    sx={{ 
                      fontSize: { xs: "2.5rem", sm: "3rem" },
                      mb: 1,
                      lineHeight: 1
                    }}
                  >
                    17
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "text.primary",
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    SDG Goals
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "text.secondary",
                      fontSize: "0.85rem"
                    }}
                  >
                    Semua target pembangunan berkelanjutan
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(76, 175, 80, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    transform: "translateY(-5px)"
                  }
                }}>
                  <Box sx={{ 
                    mb: 2,
                    p: 1.5,
                    bgcolor: "rgba(76, 175, 80, 0.15)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Verified sx={{ 
                      fontSize: 32, 
                      color: "#4caf50" 
                    }} />
                  </Box>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: "2.5rem", sm: "3rem" },
                      mb: 1,
                      lineHeight: 1,
                      color: "#4caf50"
                    }}
                  >
                    99%
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "text.primary",
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    Akurasi
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "text.secondary",
                      fontSize: "0.85rem"
                    }}
                  >
                    Tingkat keakuratan analisis
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 152, 0, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 152, 0, 0.1)",
                    transform: "translateY(-5px)"
                  }
                }}>
                  <Box sx={{ 
                    mb: 2,
                    p: 1.5,
                    bgcolor: "rgba(255, 152, 0, 0.15)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Timer sx={{ 
                      fontSize: 32, 
                      color: "#ff9800" 
                    }} />
                  </Box>
                  <Typography 
                    variant="h2" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: "2.5rem", sm: "3rem" },
                      mb: 1,
                      lineHeight: 1,
                      color: "#ff9800"
                    }}
                  >
                    &lt;10s
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "text.primary",
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    Waktu Analisis
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "text.secondary",
                      fontSize: "0.85rem"
                    }}
                  >
                    Proses super cepat dan efisien
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}