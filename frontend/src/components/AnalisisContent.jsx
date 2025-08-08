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
  Divider,
} from "@mui/material";
import {
  Description as DocumentIcon,
  Analytics as AnalyticsIcon,
  Clear as ClearIcon,
  KeyboardArrowDown as ArrowDownIcon,
  RestartAltOutlined as RestartIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const AnalisisContent = ({ isdarkmode = false }) => {
  const API_URL = "http://localhost:8000/api";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getToken } = useAuth();

  // Consolidated state
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
    loadingLatest: false,
  });

  // Theme colors configuration
  const colors = {
    bg: isdarkmode ? "#1e1e2e" : "#ffffff",
    text: isdarkmode ? "#e0e0e0" : "#2c3e50",
    border: isdarkmode ? "#333" : "#e9ecef",
    primary: "#6366f1",
    secondary: "#764ba2",
  };

  // Color palette for topics
  const topicColors = [
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#c084fc",
    "#d946ef",
    "#e879f9",
    "#f0abfc",
    "#f3e8ff",
    "#10b981",
    "#059669",
    "#047857",
    "#065f46",
    "#064e3b",
    "#f59e0b",
    "#d97706",
    "#b45309",
    "#92400e",
    "#78350f",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#991b1b",
    "#7f1d1d",
    "#3b82f6",
    "#2563eb",
  ];

  // Fixed Utility Functions
  const parseLDATopics = (topicStrings) => {
    if (!Array.isArray(topicStrings)) {
      console.warn(
        "Expected array of topic strings, got:",
        typeof topicStrings
      );
      return [];
    }

    return topicStrings.map((topicString, index) => {
      try {
        // Extract topic number/name from the beginning
        const topicMatch = topicString.match(/^(Topic \d+|Topic_\d+|\d+):\s*/);
        const topicName = topicMatch ? topicMatch[1] : `Topic ${index + 1}`;

        // Remove the topic name part to get the content
        const contentPart = topicString.replace(
          /^(Topic \d+|Topic_\d+|\d+):\s*/,
          ""
        );

        // Extract word-weight pairs using regex
        // Pattern matches: number*"word" or number*word
        const wordWeightPattern = /(\d+\.?\d*)\*["\']?([^"'\s+]+)["\']?/g;
        const words = [];
        let match;
        let totalWeight = 0;

        while ((match = wordWeightPattern.exec(contentPart)) !== null) {
          const weight = parseFloat(match[1]);
          const word = match[2];

          words.push({
            word: word,
            weight: weight,
          });

          totalWeight += weight;
        }

        // Sort words by weight (descending) and take top 5
        words.sort((a, b) => b.weight - a.weight);
        const topWords = words.slice(0, 5);

        // Calculate a representative weight for the topic
        // Use the sum of top 3 word weights or total weight, whichever makes more sense
        const topicWeight =
          topWords.length > 0
            ? topWords.slice(0, 3).reduce((sum, word) => sum + word.weight, 0) *
              100
            : totalWeight * 100;

        return {
          topic: topicName,
          weight: Math.max(topicWeight, 1), // Ensure minimum weight for visualization
          words: topWords,
          fullString: topicString,
          color: topicColors[index % topicColors.length],
          totalWords: words.length,
        };
      } catch (error) {
        console.error(`Error parsing topic string at index ${index}:`, error);
        return {
          topic: `Topic ${index + 1}`,
          weight: 1,
          words: [],
          fullString: topicString,
          color: topicColors[index % topicColors.length],
          totalWords: 0,
        };
      }
    });
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    return axios({
      url: `${API_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  };

  // API Functions
  const fetchFiles = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: null }));

      const response = await makeAuthenticatedRequest("/c/u/analyse");
      const { files } = response.data;

      setData((prev) => ({ ...prev, files }));
    } catch (err) {
      console.error("Fetch files error:", err);
      setStatus((prev) => ({
        ...prev,
        error: err.response?.data?.detail || err.message,
      }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const fetchLatestResults = async (fileId = config.selectedDoc) => {
    if (!fileId) return;

    try {
      setStatus((prev) => ({ ...prev, loadingLatest: true, error: null }));

      const response = await makeAuthenticatedRequest(`/a/${fileId}`);
      const result = response.data;

      console.log("Raw API response:", result); // Debug log

      let topics = [];
      let sdgResults = [];

      if (result.success && result.data) {
        // Handle structured response
        const topicData =
          result.data.topic_distribution || result.data.topics || [];
        if (Array.isArray(topicData) && topicData.length > 0) {
          if (typeof topicData[0] === "string") {
            // Topic strings need parsing
            topics = parseLDATopics(topicData);
          } else {
            // Already parsed topics
            topics = topicData;
          }
        }
        sdgResults = result.data.sdg_mapping || result.data.sdg_results || [];
      } else if (Array.isArray(result)) {
        // Direct array of topic strings
        topics = parseLDATopics(result);
      } else if (result.topics && Array.isArray(result.topics)) {
        // Topics in a topics property
        if (typeof result.topics[0] === "string") {
          topics = parseLDATopics(result.topics);
        } else {
          topics = result.topics;
        }
        sdgResults = result.sdg_results || [];
      }

      console.log("Parsed topics:", topics); // Debug log
      console.log("SDG results:", sdgResults); // Debug log

      setData((prev) => ({ ...prev, topics, sdgResults }));
    } catch (error) {
      console.error("Failed to fetch results:", error);
      setStatus((prev) => ({
        ...prev,
        error: "No analysis yet, Please analyze file first",
      }));
    } finally {
      setStatus((prev) => ({ ...prev, loadingLatest: false }));
    }
  };

  const startAnalysis = async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: null }));

      console.log("Starting analysis with config:", config); // Debug log

      const response = await makeAuthenticatedRequest("/analyze", {
        method: "POST",
        data: {
          file_id: config.selectedDoc,
          num_topics: parseInt(config.topicCount),
          iteration: parseInt(config.maxIterations),
          date_analyzed: Date.now(),
        },
      });

      console.log("Analysis response:", response.data); // Debug log

      const { analysis_id } = response.data;
      setStatus((prev) => ({ ...prev, analysisId: analysis_id }));

      // Clear previous results when starting new analysis
      setData((prev) => ({ ...prev, topics: [], sdgResults: [] }));
    } catch (err) {
      console.error("Analysis error:", err);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.detail || err.message,
      }));
    }
  };

  const pollAnalysisStatus = async (analysisId) => {
    try {
      const response = await makeAuthenticatedRequest(
        `/analysis/status/${analysisId}`
      );
      const result = response.data;

      console.log("Polling result:", result); // Debug log

      if (result.status === "completed") {
        let topics = [];
        let sdgResults = [];

        // Handle different result formats
        if (result.results) {
          if (result.results.topic_distribution) {
            const topicData = result.results.topic_distribution;
            if (Array.isArray(topicData) && typeof topicData[0] === "string") {
              topics = parseLDATopics(topicData);
            } else {
              topics = topicData;
            }
          } else if (
            result.results.topics &&
            Array.isArray(result.results.topics)
          ) {
            if (typeof result.results.topics[0] === "string") {
              topics = parseLDATopics(result.results.topics);
            } else {
              topics = result.results.topics;
            }
          }
          sdgResults =
            result.results.sdg_mapping || result.results.sdg_results || [];
        }

        console.log("Parsed topics from polling:", topics); // Debug log
        console.log("Parsed SDG results from polling:", sdgResults); // Debug log

        setData((prev) => ({ ...prev, topics, sdgResults }));
        setStatus((prev) => ({ ...prev, loading: false, analysisId: null }));

        return true; // Analysis completed
      } else if (result.status === "failed") {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          analysisId: null,
          error: `Analysis failed: ${result.message || "Unknown error"}`,
        }));
        return true; // Stop polling
      } else if (
        result.status === "processing" ||
        result.status === "pending"
      ) {
        console.log("Analysis still processing..."); // Debug log
        return false; // Continue polling
      }

      return false; // Continue polling for other statuses
    } catch (err) {
      console.error("Polling error:", err);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        analysisId: null,
        error: "Failed to check analysis status",
      }));
      return true; // Stop polling on error
    }
  };

  // Event Handlers
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setConfig((prev) => ({ ...prev, [field]: value }));

    if (field === "selectedDoc" && value) {
      fetchLatestResults(value);
    }
  };

  const handleClearInput = (field) => () => {
    setConfig((prev) => ({ ...prev, [field]: "" }));

    if (field === "selectedDoc") {
      setData((prev) => ({ ...prev, topics: [], sdgResults: [] }));
    }
  };

  const handleReset = () => {
    setConfig({ topicCount: "", maxIterations: "", selectedDoc: "" });
    setData((prev) => ({ ...prev, topics: [], sdgResults: [] }));
    setStatus((prev) => ({
      ...prev,
      analysisId: null,
      error: null,
      loading: false,
    }));
  };

  // Effects
  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!status.analysisId) return;

    console.log("Starting polling for analysis ID:", status.analysisId);

    let attempts = 0;
    const maxAttempts = 150; // 5 minutes max (150 * 2 seconds)

    const interval = setInterval(async () => {
      attempts++;

      if (attempts > maxAttempts) {
        console.log("Max polling attempts reached, stopping...");
        setStatus((prev) => ({
          ...prev,
          loading: false,
          analysisId: null,
          error: "Analysis timeout - please try again",
        }));
        clearInterval(interval);
        return;
      }

      const shouldStop = await pollAnalysisStatus(status.analysisId);
      if (shouldStop) {
        console.log("Stopping polling");
        clearInterval(interval);
      }
    }, 2000);

    return () => {
      console.log("Cleaning up polling interval");
      clearInterval(interval);
    };
  }, [status.analysisId]);

  // Render Functions
  const renderSelect = ({
    label,
    value,
    onChange,
    onClear,
    options = [],
    renderOption,
    loading = false,
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
          disabled={loading || options.length === 0}
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
              color: colors.text,
            },
            "&.Mui-disabled": {
              bgcolor: isdarkmode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            },
          }}
          endAdornment={
            value && !loading ? (
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
            ) : null
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
              {loading
                ? `Loading ${label.toLowerCase()}...`
                : options.length === 0
                ? `No ${label.toLowerCase()} available`
                : `Select ${label.toLowerCase()}...`}
            </Typography>
          </MenuItem>

          {options.map((option) => {
            if (renderOption) return renderOption(option);

            const key = option.id || option.value || option;
            const displayValue = option.id || option.value || option;
            const displayText =
              option.file_name || option.name || option.label || option;

            return (
              <MenuItem key={key} value={displayValue}>
                <Typography sx={{ color: colors.text }}>
                  {displayText}
                </Typography>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );

  const renderTopicOption = (num) => (
    <MenuItem key={num} value={num}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
      >
        <Chip
          label={num}
          size="small"
          sx={{
            bgcolor:
              num <= 10
                ? "#10b981"
                : num <= 20
                ? "#c1e301ff"
                : num <= 40
                ? "#ff8c00ff"
                : "#ef4444",
            color: "white",
            fontWeight: "bold",
            minWidth: "32px",
          }}
        />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: colors.text,
          }}
        >
          {num} Topic{num !== 1 ? "s" : ""}
        </Typography>
      </Box>
    </MenuItem>
  );

  const renderDocumentOption = (file) => (
    <MenuItem key={file.id} value={file.id}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
      >
        <DocumentIcon sx={{ fontSize: 20, color: colors.primary }} />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: isMobile ? "0.875rem" : "1rem",
            color: colors.text,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.file_name}
        </Typography>
      </Box>
    </MenuItem>
  );

  const renderEmptyState = (icon, message) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
        fontStyle: "italic",
        textAlign: "center",
        gap: 2,
        px: 2,
        py: 4,
      }}
    >
      {icon}
      <Typography>{message}</Typography>
    </Box>
  );

  const renderLoadingState = (message) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        py: 4,
      }}
    >
      <CircularProgress />
      <Typography>{message}</Typography>
    </Box>
  );

  // Main render
  const hasResults = data.topics.length > 0 || data.sdgResults.length > 0;
  const isAnalysisDisabled =
    !config.selectedDoc ||
    !config.topicCount ||
    !config.maxIterations ||
    status.loading;

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
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: isMobile ? 2 : 4,
            gap: isMobile ? 1.5 : 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              color: colors.text,
            }}
          >
            Topic Modeling & SDG Analysis
          </Typography>

          {hasResults && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchLatestResults()}
              disabled={status.loadingLatest}
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                "&:hover": {
                  borderColor: colors.primary,
                  bgcolor: `${colors.primary}10`,
                },
              }}
            >
              {status.loadingLatest ? "Refreshing..." : "Refresh Results"}
            </Button>
          )}
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
              color: colors.text,
            }}
          >
            Konfigurasi Analisis
          </Typography>

          {/* File Select */}
          {renderSelect({
            label: "Files",
            value: config.selectedDoc,
            onChange: handleInputChange("selectedDoc"),
            onClear: handleClearInput("selectedDoc"),
            options: data.files,
            renderOption: renderDocumentOption,
            loading: status.loading && data.files.length === 0,
          })}

          <Divider sx={{ my: 2, borderColor: colors.border }} />

          {/* Topic Count Select */}
          {renderSelect({
            label: "Topic Count",
            value: config.topicCount,
            onChange: handleInputChange("topicCount"),
            onClear: handleClearInput("topicCount"),
            options: Array.from({ length: 50 }, (_, i) => i + 1),
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
                  color: colors.text,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: colors.border,
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
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
              onClick={startAnalysis}
              disabled={isAnalysisDisabled}
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
                "&:hover": { bgcolor: colors.primary },
                "&:disabled": { bgcolor: isdarkmode ? "grey.800" : "grey.300" },
              }}
            >
              {status.loading ? "Processing..." : "Mulai Analisis"}
            </Button>

            {status.loading && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  setStatus((prev) => ({
                    ...prev,
                    loading: false,
                    analysisId: null,
                  }))
                }
                sx={{
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  py: isMobile ? 1.25 : 1.5,
                  borderRadius: "12px",
                  fontSize: isMobile ? "0.9375rem" : "1rem",
                  "&:hover": {
                    borderColor: "#ef4444",
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                Stop Analysis
              </Button>
            )}

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
                "&:hover": { bgcolor: colors.secondary },
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: isMobile ? 2 : 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? "1.125rem" : "1.25rem",
                  color: colors.text,
                }}
              >
                Topic Distribution
              </Typography>
              {status.loadingLatest && <CircularProgress size={20} />}
            </Box>

            <Box sx={{ height: isMobile ? 300 : 400 }}>
              {status.loading ? (
                renderLoadingState("Menganalisis dokumen...")
              ) : data.topics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.topics}
                    margin={{
                      top: 20,
                      right: isMobile ? 10 : 30,
                      left: isMobile ? -10 : 20,
                      bottom: isMobile ? 70 : 90,
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
                      height={isMobile ? 80 : 90}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text }}
                      interval={0}
                    />
                    <YAxis
                      label={{
                        value: "Weight (%)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: colors.text },
                      }}
                      tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <Box
                              sx={{
                                bgcolor: colors.bg,
                                border: `2px solid ${colors.border}`,
                                borderRadius: "8px",
                                p: 2,
                                maxWidth: "350px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1,
                                  color: colors.text,
                                  borderBottom: `1px solid ${colors.border}`,
                                  pb: 1,
                                }}
                              >
                                {label}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 1.5,
                                  color: colors.text,
                                  fontWeight: 500,
                                }}
                              >
                                Weight: {payload[0].value.toFixed(2)}%
                              </Typography>
                              {data.words && data.words.length > 0 && (
                                <Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 600,
                                      display: "block",
                                      mb: 1,
                                      color: colors.text,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.5px",
                                    }}
                                  >
                                    Top Keywords:
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {data.words.slice(0, 4).map((word, idx) => (
                                      <Chip
                                        key={idx}
                                        label={`${word.word} (${(
                                          word.weight * 100
                                        ).toFixed(1)}%)`}
                                        size="small"
                                        sx={{
                                          backgroundColor: `${data.color}20`,
                                          color: colors.text,
                                          fontSize: "0.65rem",
                                          height: "20px",
                                        }}
                                      />
                                    ))}
                                  </Box>
                                  {data.totalWords > 4 && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        mt: 0.5,
                                        color: colors.text,
                                        opacity: 0.7,
                                        fontSize: "0.65rem",
                                      }}
                                    >
                                      +{data.totalWords - 4} more keywords
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </Box>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                      {data.topics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || colors.primary}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                renderEmptyState(
                  <HistoryIcon sx={{ fontSize: 48, opacity: 0.5 }} />,
                  config.selectedDoc
                    ? "Tidak ada data distribusi topik untuk dokumen ini."
                    : "Pilih dokumen untuk melihat hasil analisis sebelumnya atau jalankan analisis baru."
                )
              )}
            </Box>
          </Paper>

          {/* Topic Details */}
          {data.topics.length > 0 && (
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
                  color: colors.text,
                }}
              >
                Topic Keywords
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: isMobile ? 2 : 3,
                }}
              >
                {data.topics.map((topic, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: `2px solid ${topic.color}20`,
                      borderRadius: "8px",
                      bgcolor: `${topic.color}08`,
                      borderLeft: `4px solid ${topic.color}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: colors.text,
                          fontSize: isMobile ? "0.9rem" : "1rem",
                        }}
                      >
                        {topic.topic}
                      </Typography>
                      <Chip
                        label={`${topic.weight.toFixed(1)}%`}
                        size="small"
                        sx={{
                          bgcolor: topic.color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {topic.words.map((word, wordIdx) => (
                        <Chip
                          key={wordIdx}
                          label={word.word}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: topic.color,
                            color: colors.text,
                            fontSize: "0.75rem",
                            "&:hover": {
                              bgcolor: `${topic.color}15`,
                            },
                          }}
                        />
                      ))}
                    </Box>

                    {topic.totalWords > 5 && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 1,
                          color: colors.text,
                          opacity: 0.7,
                          fontSize: "0.7rem",
                        }}
                      >
                        +{topic.totalWords - 5} more keywords available
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

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
                color: colors.text,
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
                  <Typography sx={{ color: colors.text }}>
                    Memproses pemetaan SDG...
                  </Typography>
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
                          color: colors.text,
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
                          color: colors.text,
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
                renderEmptyState(
                  <AnalyticsIcon sx={{ fontSize: 48, opacity: 0.5 }} />,
                  config.selectedDoc
                    ? "Tidak ada hasil pemetaan SDG untuk dokumen ini."
                    : "Pilih dokumen untuk melihat hasil pemetaan SDG atau jalankan analisis baru."
                )
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalisisContent;
