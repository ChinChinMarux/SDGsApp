import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowBack } from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();
  const currentUrl = window.location.href;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center", position: "relative", zIndex: 1, p: 4 }}>
          {/* Animated 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", sm: "8rem", md: "10rem" },
              fontWeight: 900,
              background: "linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.7) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 5px 15px rgba(0,0,0,0.2)",
              mb: 2,
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-10px)" },
              },
            }}
          >
            404
          </Typography>

          {/* Main Title */}
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 600,
              mb: 2,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Halaman Tidak Ditemukan
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 3,
              fontWeight: 300,
              lineHeight: 1.6,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
          </Typography>

          {/* URL Display */}
          <Box
            sx={{
              mb: 4,
              p: 2,
              borderRadius: 2,
              // backgroundColor: "rgba(0, 0, 0, 0.2)",
              // border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 1,
                fontSize: "0.9rem",
              }}
            >
              URL yang diminta:
            </Typography>
            <Typography
              component="code"
              sx={{
                color: "#ffeb3b",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                px: 2,
                py: 1,
                borderRadius: 1,
                fontSize: "0.85rem",
                fontFamily: "monospace",
                wordBreak: "break-all",
                display: "inline-block",
                border: "1px solid rgba(255, 235, 59, 0.3)",
              }}
            >
              {currentUrl}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.9) 100%)",
                color: "#667eea",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, rgba(255,255,255,0.9) 30%, #ffffff 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
                },
              }}
            >
              Kembali ke Beranda
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                fontWeight: 500,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Halaman Sebelumnya
            </Button>
          </Box>
      </Container>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "pulse 4s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
            "50%": { opacity: 0.6, transform: "scale(1.1)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "pulse 3s ease-in-out infinite 1s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "5%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "pulse 5s ease-in-out infinite 2s",
        }}
      />
    </Box>
  );
};

export default NotFound;