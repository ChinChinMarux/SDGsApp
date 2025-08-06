import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  LinearProgress,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Search,
  FilterList,
  GetApp,
  Delete,
  Description,
  ArrowDropDown,
} from "@mui/icons-material";
import { useTheme, useMediaQuery } from "@mui/material";

const DocumentContent = ({ isdarkmode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchText, setSearchText] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    completed: true,
    processing: true,
    failed: true,
  });

  const bgColor = isdarkmode ? "#1e1e2f" : "#fff";
  const textColor = isdarkmode ? "#e0e0e0" : "#2c3e50";
  const borderColor = isdarkmode ? "#333" : "#e9ecef";
  const tableHeadBg = isdarkmode ? "#2a2a3b" : "#f8f9fa";
  const hoverRowBg = isdarkmode ? "#2c2c3c" : "#f8f9fa";

  useEffect(() => {
    const fetchProcessedDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:8000/api/processed-documents"
        );
        if (!response.ok) throw new Error("Gagal mengambil dokumen");
        const data = await response.json();
        setDocuments(
          data.documents.map((doc) => ({
            ...doc,
            size: formatFileSize(doc.size),
            uploadDate: formatDate(doc.uploadDate),
            status:
              doc.status === "completed"
                ? "Selesai"
                : doc.status === "processing"
                ? "Diproses"
                : "Gagal",
            statusColor:
              doc.status === "completed"
                ? "success"
                : doc.status === "processing"
                ? "warning"
                : "error",
            hasMapping: doc.sdgMapping !== "Not mapped",
            progress: doc.progress || 0,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProcessedDocuments();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getFileIcon = () => (
    <Description sx={{ color: "#6366f1", fontSize: 24 }} />
  );

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilters({
      ...statusFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/download/${documentId}`
      );
      if (!response.ok) throw new Error("Gagal mengunduh dokumen");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Gagal menghapus dokumen");
      setDocuments(documents.filter((doc) => doc.id !== documentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      (doc.status === "Selesai" && statusFilters.completed) ||
      (doc.status === "Diproses" && statusFilters.processing) ||
      (doc.status === "Gagal" && statusFilters.failed);
    return matchesSearch && matchesStatus;
  });

  return (
    <Container
      maxWidth="xl"
      sx={{ mt: isMobile ? 2 : 3, px: isMobile ? 1 : 3 }}
    >
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          borderRadius: 2,
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: isMobile ? 2 : 3,
            fontWeight: 700,
            fontSize: isMobile ? "1.1rem" : "1.25rem",
          }}
        >
          Document Management
        </Typography>

        {error && (
          <Box sx={{ mb: isMobile ? 2 : 3 }}>
            <Typography
              color="error"
              sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
            >
              {error}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 1 : 2,
            mb: isMobile ? 2 : 3,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <TextField
            placeholder="Cari dokumen..."
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              minWidth: isMobile ? "100%" : 300,
              "& .MuiInputBase-root": {
                height: isMobile ? 40 : undefined,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: isdarkmode ? "#bbb" : "#999",
                      fontSize: isMobile ? "1rem" : "1.25rem",
                    }}
                  />
                </InputAdornment>
              ),
              style: {
                color: textColor,
                backgroundColor: isdarkmode ? "#2b2b3c" : "#fff",
                fontSize: isMobile ? "0.875rem" : "0.9375rem",
              },
            }}
          />

          <Button
            variant="outlined"
            startIcon={
              <FilterList sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }} />
            }
            endIcon={
              <ArrowDropDown sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }} />
            }
            onClick={handleFilterClick}
            sx={{
              color: isdarkmode ? "#bbb" : "#6c757d",
              borderColor: isdarkmode ? "#444" : "#dee2e6",
              textTransform: "none",
              fontSize: isMobile ? "0.8125rem" : "0.875rem",
              height: isMobile ? 40 : undefined,
              minWidth: isMobile ? "100%" : undefined,
            }}
          >
            Filter
          </Button>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            {["completed", "processing", "failed"].map((key) => (
              <MenuItem key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={statusFilters[key]}
                      onChange={handleStatusFilterChange}
                      name={key}
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={isMobile ? 24 : 32} />
          </Box>
        ) : (
          <TableContainer
            sx={{
              maxWidth: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Table
              sx={{
                minWidth: isMobile ? 600 : "auto",
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: tableHeadBg }}>
                  {[
                    "DOKUMEN",
                    "SIZE",
                    "UPLOAD",
                    "STATUS",
                    "SDGS",
                    "TINDAKAN",
                  ].map((text, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontWeight: 600,
                        color: isdarkmode ? "#ccc" : "#6c757d",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        textAlign: i === 0 ? "left" : "center",
                        padding: isMobile ? "8px 12px" : "12px 16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isMobile && i === 2 ? "UPLOAD" : text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc.id}
                      sx={{
                        "&:hover": { backgroundColor: hoverRowBg },
                        color: textColor,
                      }}
                    >
                      <TableCell
                        sx={{
                          py: isMobile ? 1 : 2,
                          maxWidth: isMobile ? 150 : undefined,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? 1 : 2,
                          }}
                        >
                          {getFileIcon()}
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: textColor,
                              fontSize: isMobile ? "0.8125rem" : "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {isMobile
                              ? doc.name.split(".")[0] + "..."
                              : doc.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          color: isdarkmode ? "#aaa" : "#6c757d",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: isMobile ? 1 : 2,
                        }}
                      >
                        {doc.size}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          color: isdarkmode ? "#aaa" : "#6c757d",
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          py: isMobile ? 1 : 2,
                        }}
                      >
                        {isMobile
                          ? doc.uploadDate.split("/").slice(0, 2).join("/")
                          : doc.uploadDate}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          py: isMobile ? 1 : 2,
                        }}
                      >
                        <Chip
                          label={doc.status}
                          color={doc.statusColor}
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            minWidth: isMobile ? 60 : 80,
                            fontSize: isMobile ? "0.6875rem" : "0.75rem",
                            height: isMobile ? 24 : undefined,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          py: isMobile ? 1 : 2,
                        }}
                      >
                        {doc.hasMapping ? (
                          <Box>
                            <Typography
                              sx={{
                                fontSize: isMobile ? "0.6875rem" : "0.875rem",
                                mb: isMobile ? 0.5 : 1,
                                color: textColor,
                              }}
                            >
                              {isMobile
                                ? doc.sdgMapping.split(",").shift() + "..."
                                : doc.sdgMapping}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={doc.progress}
                                sx={{
                                  width: isMobile ? 50 : 80,
                                  height: isMobile ? 4 : 6,
                                  borderRadius: 3,
                                  backgroundColor: isdarkmode
                                    ? "#444"
                                    : "#e0e0e0",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#6366f1",
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: isMobile ? "0.625rem" : "0.75rem",
                                  color: "#6c757d",
                                }}
                              >
                                {doc.progress}%
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography
                            sx={{
                              color: "#6c757d",
                              fontSize: isMobile ? "0.6875rem" : "0.875rem",
                            }}
                          >
                            Not mapped
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          py: isMobile ? 1 : 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: isMobile ? 0.5 : 1,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size={isMobile ? "small" : "medium"}
                            onClick={() => handleDownload(doc.id, doc.name)}
                            sx={{ p: isMobile ? 0.5 : 1 }}
                          >
                            <GetApp
                              sx={{
                                fontSize: isMobile ? 16 : 18,
                                color: "#6366f1",
                              }}
                            />
                          </IconButton>
                          <IconButton
                            size={isMobile ? "small" : "medium"}
                            onClick={() => handleDelete(doc.id)}
                            sx={{ p: isMobile ? 0.5 : 1 }}
                          >
                            <Delete
                              sx={{
                                fontSize: isMobile ? 16 : 18,
                                color: "#ef4444",
                              }}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        textAlign: "center",
                        py: isMobile ? 3 : 4,
                      }}
                    >
                      <Typography
                        sx={{
                          color: isdarkmode ? "#aaa" : "#6c757d",
                          fontSize: isMobile ? "0.8125rem" : "0.875rem",
                        }}
                      >
                        {searchText
                          ? "Tidak ada dokumen yang sesuai"
                          : "Belum ada dokumen yang diproses"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default DocumentContent;
