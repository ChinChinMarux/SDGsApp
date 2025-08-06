import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  LinearProgress,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Description as DocumentIcon,
  Analytics as AnalyticsIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ArrowDownIcon,
  RestartAltOutlined as RestartIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const API_URL = "http://localhost:8000/api";
const AnalisisContent = ({ isdarkmode = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State management
  const [config, setConfig] = useState({
    topicCount: "",
    maxIterations: "",
    selectedDoc: "",
  });
  const [data, setData] = useState({
    files: [],
    topics: [],
    sdgResults: [],
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    analysisId: null,
  });

  // Theme colors
  const colors = {
    bg: isdarkmode ? "#1e1e2e" : "#ffffff",
    text: isdarkmode ? "#e0e0e0" : "#2c3e50",
    border: isdarkmode ? "#333" : "#e9ecef",
    primary: "#6366f1",
    secondary: "#764ba2",
  };

  // Fetch files on mount
  useEffect(() => {
    const fetchFiles = async () => {
      setStatus((prev) => ({ ...prev, loading: true }));
      try {
        const response = await fetch(`${API_URL}/c/uploaded`);
        if (!response.ok) throw new Error("Failed to fetch files");
        const { files } = await response.json();
        console.log("Fetched files:", files);
        setData((prev) => ({ ...prev, files }));
      } catch (err) {
        console.error("Fetch error:", err);
        setStatus((prev) => ({ ...prev, error: err.message }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchFiles();
  }, []);

  // Poll analysis status
  useEffect(() => {
    if (!status.analysisId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/analysis/status/${status.analysisId}`
        );
        const result = await response.json();

        if (result.status === "completed") {
          clearInterval(interval);
          setData((prev) => ({
            ...prev,
            topics: result.results.topic_distribution,
            sdgResults: result.results.sdg_mapping,
          }));
          setStatus((prev) => ({ ...prev, loading: false }));
        } else if (result.status === "failed") {
          clearInterval(interval);
          setStatus((prev) => ({
            ...prev,
            loading: false,
            error: `Analysis failed: ${result.message}`,
          }));
        }
      } catch (err) {
        clearInterval(interval);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to check analysis status",
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status.analysisId]);

  // Handlers
  const handleInputChange = (field) => (e) => {
    setConfig((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleClearInput = (field) => () => {
    setConfig((prev) => ({ ...prev, [field]: "" }));
  };

  const handleStartAnalysis = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: config.selectedDoc,
          num_topics: config.topicCount,
          iterations: config.maxIterations,
        }),
      });
      if (!response.ok) throw new Error("Failed to start analysis");
      const { analysis_id } = await response.json();
      setStatus((prev) => ({ ...prev, analysisId: analysis_id }));
    } catch (err) {
      setStatus((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const handleReset = () => {
    setConfig({
      topicCount: "",
      maxIterations: "",
      selectedDoc: "",
    });
    setData((prev) => ({ ...prev, topics: [], sdgResults: [] }));
    setStatus((prev) => ({ ...prev, analysisId: null, error: null }));
  };

  // UI Components
  const renderSelect = ({
    label,
    value,
    onChange,
    onClear,
    options,
    renderOption,
  }) => (
    <Box mb={isMobile ? 2 : 3}>
      <Typography
        variant="body2"
        sx={{
          color: colors.text,
          mb: 1,
          fontWeight: 600,
          fontSize: isMobile ? "0.875rem" : "0.9375rem",
        }}
      >
        {label}
      </Typography>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={onChange}
          displayEmpty
          IconComponent={ArrowDownIcon}
          sx={{
            bgcolor: colors.bg,
            borderRadius: "12px",
            height: isMobile ? 48 : 56,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.border,
              borderWidth: 2,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary,
            },
            "& .MuiSelect-select": {
              fontSize: isMobile ? "0.875rem" : "1rem",
              padding: isMobile ? "12px 14px" : "16px 14px",
            },
          }}
          endAdornment={
            value && (
              <IconButton
                size="small"
                onClick={onClear}
                sx={{
                  position: "absolute",
                  right: 35,
                  color: isdarkmode ? "#aaa" : "#666",
                }}
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )
          }
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "12px",
                mt: 1,
                maxHeight: 300,
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
              Select {label.toLowerCase()}...
            </Typography>
          </MenuItem>
          {options.map(renderOption)}
        </Select>
      </FormControl>
    </Box>
  );

  const renderDocumentOption = (doc) => (
    <MenuItem key={doc._id} value={doc._id}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <DocumentIcon sx={{ color: colors.primary }} />
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            {doc.filename}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: isMobile ? "0.75rem" : "0.8125rem",
            }}
          >
            {new Date(doc.uploadDate).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </MenuItem>
  );

  const renderTopicOption = (num) => (
    <MenuItem key={num} value={num}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          label={num}
          size="small"
          sx={{
            bgcolor: num <= 10 ? "#10b981" : num <= 20 ? "#f59e0b" : "#ef4444",
            color: "white",
            fontWeight: "bold",
          }}
        />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          {num} Topics
        </Typography>
      </Box>
    </MenuItem>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isdarkmode ? "background.default" : "grey.50",
        pb: isMobile ? 2 : 0,
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          px: isMobile ? 1.5 : 3,
          py: isMobile ? 1 : 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: isMobile ? 2 : 4,
            gap: isMobile ? 1.5 : 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              color: isdarkmode ? "#e0e0e0" : "#2c3e50",
            }}
          >
            Topic Modeling & SDG Analysis
          </Typography>
        </Box>

        {/* Error Alert */}
        {status.error && (
          <Alert
            severity="error"
            sx={{ mb: 3, fontSize: isMobile ? "0.8125rem" : "0.875rem" }}
          >
            {status.error}
          </Alert>
        )}

        {/* Configuration Panel */}
        <Paper
          sx={{
            p: isMobile ? 2 : 3,
            mb: isMobile ? 2 : 3,
            borderRadius: "12px",
            bgcolor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: isMobile ? 2 : 3,
              fontWeight: 600,
              fontSize: isMobile ? "1.125rem" : "1.25rem",
            }}
          >
            Konfigurasi Analisis
          </Typography>

          {/* Topic Count Select */}
          {renderSelect({
            label: "Topic Count",
            value: config.topicCount,
            onChange: handleInputChange("topicCount"),
            onClear: handleClearInput("topicCount"),
            options: Array.from({ length: 25 }, (_, i) => i + 1),
            renderOption: renderTopicOption,
          })}

          {/* Max Iterations Input */}
          <Box mb={isMobile ? 2 : 3}>
            <Typography
              variant="body2"
              sx={{
                color: colors.text,
                mb: 1,
                fontWeight: 600,
                fontSize: isMobile ? "0.875rem" : "0.9375rem",
              }}
            >
              Max Iterations
            </Typography>
            <TextField
              fullWidth
              placeholder="Masukkan jumlah iterasi (max 1000)"
              value={config.maxIterations}
              onChange={handleInputChange("maxIterations")}
              type="number"
              inputProps={{ min: 1, max: 1000 }}
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  height: isMobile ? "1.5rem" : "auto",
                  py: isMobile ? "12px 14px" : "16px 14px",
                },
              }}
            />
          </Box>

          {/* Document Select */}
          {renderSelect({
            label: "files",
            value: config.selectedDoc,
            onChange: handleInputChange("selectedDoc"),
            onClear: handleClearInput("selectedDoc"),
            options: data.files,
            renderOption: renderDocumentOption,
          })}

          {/* Start Button */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 1.5 : 2,
              mt: isMobile ? 2 : 3,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleStartAnalysis}
              disabled={
                !config.selectedDoc ||
                !config.topicCount ||
                !config.maxIterations ||
                status.loading
              }
              startIcon={
                status.loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AnalyticsIcon />
                )
              }
              sx={{
                bgcolor: colors.primary,
                color: "white",
                py: isMobile ? 1.25 : 1.5,
                borderRadius: "12px",
                fontSize: isMobile ? "0.9375rem" : "1rem",
                "&:hover": {
                  bgcolor: colors.primary,
                },
                "&:disabled": {
                  bgcolor: isdarkmode ? "grey.800" : "grey.300",
                },
              }}
            >
              {status.loading ? "Processing..." : "Mulai Analisis"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<RestartIcon />}
              onClick={handleReset}
              sx={{
                bgcolor: colors.secondary,
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                py: isMobile ? 1.25 : 1.5,
                borderRadius: "12px",
                fontSize: isMobile ? "0.9375rem" : "1rem",
                "&:hover": {
                  bgcolor: colors.secondary,
                },
              }}
            >
              Analisis Baru
            </Button>
          </Box>
        </Paper>

        {/* Results Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? 2 : 3,
          }}
        >
          {/* Topic Distribution Chart */}
          <Paper
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: "12px",
              bgcolor: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: isMobile ? 2 : 3,
                fontWeight: 600,
                fontSize: isMobile ? "1.125rem" : "1.25rem",
              }}
            >
              Topic Distribution
            </Typography>

            <Box sx={{ height: isMobile ? 250 : 350 }}>
              {status.loading ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    textAlign: "center",
                  }}
                >
                  <CircularProgress />
                  <Typography>Menganalisis dokumen...</Typography>
                </Box>
              ) : data.topics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.topics}
                    margin={{
                      top: 20,
                      right: isMobile ? 10 : 30,
                      left: isMobile ? -10 : 20,
                      bottom: isMobile ? 60 : 80,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={colors.border}
                    />
                    <XAxis
                      dataKey="topic"
                      angle={isMobile ? -90 : -45}
                      textAnchor="end"
                      height={isMobile ? 70 : 80}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="weight"
                      fill={colors.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    fontStyle: "italic",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  Belum ada data distribusi topik. Silakan jalankan analisis
                  terlebih dahulu.
                </Box>
              )}
            </Box>
          </Paper>

          {/* SDG Results */}
          <Paper
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: "12px",
              bgcolor: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: isMobile ? 2 : 3,
                fontWeight: 600,
                fontSize: isMobile ? "1.125rem" : "1.25rem",
              }}
            >
              SDG Mapping Results
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 1.5 : 2,
              }}
            >
              {status.loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2,
                    gap: 2,
                  }}
                >
                  <CircularProgress size={20} />
                  <Typography>Memproses pemetaan SDG...</Typography>
                </Box>
              ) : data.sdgResults.length > 0 ? (
                data.sdgResults.map((item, index) => (
                  <Box key={index} mb={isMobile ? 1.5 : 2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: isMobile ? "0.875rem" : "0.9375rem",
                        }}
                      >
                        {isMobile
                          ? `${item.sdg}:`
                          : `${item.sdg}: ${item.description}`}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: isMobile ? "0.875rem" : "0.9375rem",
                        }}
                      >
                        {item.score.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.score}
                      sx={{
                        height: 6,
                        borderRadius: "4px",
                        bgcolor: isdarkmode ? "grey.800" : "grey.200",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: item.color,
                          borderRadius: "4px",
                        },
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    fontStyle: "italic",
                    py: 2,
                  }}
                >
                  Belum ada hasil pemetaan SDG. Silakan jalankan analisis
                  terlebih dahulu.
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalisisContent;
