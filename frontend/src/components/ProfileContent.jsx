import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  PhotoCamera as CameraIcon,
} from "@mui/icons-material";

const ProfileContent = ({ isdarkmode }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    location: "",
  });

  const textColor = isdarkmode ? "#cdd6f4" : "#2c3e50";
  const borderColor = isdarkmode ? "#313244" : "#e9ecef";
  const inputBg = isdarkmode ? "#1e1e2e" : "#ffffff";
  const bgColor = isdarkmode ? "#1e1e2e" : "#ffffff";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", formData);
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      location: "",
    });
  };

  const FormField = ({ id, label, required, type }) => (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="body2"
        sx={{ color: textColor, mb: 1, fontWeight: 600 }}
      >
        {label} {required && <span style={{ color: "#f38ba8" }}>*</span>}
      </Typography>
      <TextField
        fullWidth
        type={type || "text"}
        placeholder={`Masukkan ${label.toLowerCase()}`}
        value={formData[id]}
        onChange={(e) => handleInputChange(id, e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: inputBg,
            borderRadius: 2,
            "& fieldset": {
              borderColor: borderColor,
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "#8b5cf6",
              borderWidth: 2,
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8b5cf6",
              borderWidth: 2,
              boxShadow: isdarkmode
                ? "0 0 0 3px rgba(139, 92, 246, 0.2)"
                : "0 0 0 3px rgba(139, 92, 246, 0.1)",
            },
          },
          "& .MuiInputBase-input": {
            color: textColor,
            py: 1.5,
            "&::placeholder": {
              color: isdarkmode ? "#6c7086" : "#9ca3af",
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "1440px",
        mx: "auto",
        p: { xs: 3, sm: 4 },
        backgroundColor: bgColor,
        borderRadius: 3,
        border: `1px solid ${borderColor}`,
        boxShadow: isdarkmode
          ? "0 2px 8px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          pb: 2,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <PersonIcon sx={{ color: textColor, fontSize: 28 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: textColor,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Info Personal
        </Typography>
      </Box>

      {/* Profile Picture Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: textColor, fontWeight: 600, mb: 2 }}
        >
          Profile Picture
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #a855f7 0%, #764ba2 100%)",
              }}
            >
              <PersonIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                backgroundColor: "#6366f1",
                color: "white",
                width: 28,
                height: 28,
                "&:hover": {
                  backgroundColor: "#5856eb",
                },
              }}
            >
              <CameraIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: textColor, mb: 0.5 }}
            >
              Upload a new profile picture
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isdarkmode ? "#9399b2" : "#666" }}
            >
              JPG, PNG, JPEG (max 5MB)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Fields - Vertical Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mb: 4,
        }}
      >
        <FormField id="username" label="Username" required={true} />
        <FormField
          id="email"
          label="Email Address"
          required={true}
          type="email"
        />
        <FormField id="phone" label="Nomor HP" />
        <FormField id="organization" label="Instansi/Organisasi" />
        <FormField id="position" label="Posisi/Jabatan" />
        <FormField id="location" label="Lokasi/Kota" />
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          pt: 3,
          borderTop: `1px solid ${borderColor}`,
          justifyContent: { xs: "stretch", sm: "flex-end" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          fullWidth={window.innerWidth < 600}
          sx={{
            color: textColor,
            borderColor: borderColor,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            minWidth: { sm: "120px" },
            "&:hover": {
              borderColor: textColor,
              backgroundColor: isdarkmode ? "#313244" : "#f5f5f5",
            },
          }}
        >
          Batalkan
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveChanges}
          fullWidth={window.innerWidth < 600}
          sx={{
            backgroundColor: "#764ba2",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            minWidth: { sm: "160px" },
            "&:hover": {
              backgroundColor: "#6b46c1",
            },
          }}
        >
          Simpan Perubahan
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileContent;
