import React, { useState, useRef, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  InsertDriveFile as FileIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as PdfIcon,
  TableChart as CsvIcon,
  Article as DocIcon,
  FileUploadOutlined,
} from "@mui/icons-material";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const SDGUploadPage = ({ isdarkmode = false }) => {
  const API_URL = "http://localhost:8000/api";
  const { getToken } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State management
  const [state, setState] = useState({
    korpus: [],
    dragOverDocument: false,
    dragOverKorpus: false,
    uploadProgress: {},
    previewDialog: { open: false, file: null, content: "" },
    deleteDialog: { open: false, file: null, type: null },
    snackbar: { open: false, message: "", severity: "success" },
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState({ korpus: [] });
  const [loading, setLoading] = useState(false);

  const refs = {
    documentInput: useRef(null),
    korpusInput: useRef(null),
  };

  // Theme colors
  const colors = {
    bg: isdarkmode ? "#1e1e2e" : "#ffffff",
    text: isdarkmode ? "#e0e0e0" : "#2c3e50",
    border: isdarkmode ? "#333" : "#e9ecef",
    primary: "#6366f1",
    secondary: "#764ba2",
    error: "#e53e3e",
    success: "#38a169",
  };

  const documentTypes = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "text/plain": ".txt",
  };

  const korpusTypes = {
    "text/csv": ".csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ".xlsx",
    "application/json": ".json",
  };

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    const name = file.name || file.nameFile || "";
    const extension = name.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return <PdfIcon sx={{ color: "#e53e3e" }} />;
      case "csv":
      case "xlsx":
        return <CsvIcon sx={{ color: "#38a169" }} />;
      case "docx":
      case "txt":
        return <DocIcon sx={{ color: "#3182ce" }} />;
      case "json":
        return <FileIcon sx={{ color: "#f56500" }} />;
      default:
        return <FileIcon sx={{ color: "#718096" }} />;
    }
  };

  const extensionHandle = (mimeType) => {
    switch (mimeType) {
      case "application/json":
        return "JSON File";
      case "text/csv":
        return "CSV File";
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "Excel File";
      case "application/pdf":
        return "PDF Document";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "Word Document";
      case "text/plain":
        return "Text File";
      default:
        return mimeType;
    }
  };

  const validateFile = (file, allowedTypes) => {
    if (!allowedTypes[file.type]) {
      return { valid: false, error: `File type ${file.type} not supported` };
    }
    if (file.size > maxFileSize) {
      return { valid: false, error: `File size exceeds 100MB limit` };
    }
    return { valid: true };
  };

  const maxFileSizeMB = 100;
  const maxFileSize = maxFileSizeMB * 1024 * 1024;

  // Fetch uploaded files from API
  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/c/uploaded`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (Array.isArray(response.data)) {
        const normalized = response.data.map((file) => ({
          ...file,
          name: file.file_name || file.nameFile,
          size: file.file_size || 0, // bytes
          uploadedAt: file.uploaded_at || null,
          extension: file.extension || "",
          status: "completed",
        }));
        setUploadedFiles(normalized);
      } else {
        console.warn("Expected array, got:", response.data);
        setUploadedFiles([]);
      }
    } catch (err) {
      console.error("Failed to fetch uploaded files:", err);
      showSnackbar("Failed to fetch uploaded files", "error");
      setUploadedFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // View file function
  const handleViewFile = async (file) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/c/view/${file_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setState((prev) => ({
        ...prev,
        previewDialog: {
          open: true,
          file: file,
          content: response.data.content || "File content not available",
        },
      }));
    } catch (err) {
      console.error("Failed to view file:", err);
      showSnackbar("Failed to view file", "error");
    }
  };

  // Delete file function
  const handleDeleteFile = async (file) => {
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/c/delete/${file_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove from local state
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));

      setState((prev) => ({
        ...prev,
        deleteDialog: { open: false, file: null, type: null },
      }));

      showSnackbar("File deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete file:", err);
      showSnackbar("Failed to delete file", "error");
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, [getToken]);

  const handleFileUpload = async (fileList, type) => {
    try {
      const token = await getToken();
      if (!token) {
        showSnackbar("Authentication required. Please sign in.", "error");
        return;
      }

      const allowedTypes = type === "document" ? documentTypes : korpusTypes;

      for (const file of fileList) {
        const validation = validateFile(file, allowedTypes);
        if (!validation.valid) {
          showSnackbar(validation.error, "error");
          continue;
        }

        const fileId = file.name + "-" + Date.now();

        setState((prev) => ({
          ...prev,
          [type]: [
            ...(prev[type] || []),
            { id: fileId, name: file.name, status: "uploading" },
          ],
        }));

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(`${API_URL}/c/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setState((prev) => ({
                ...prev,
                uploadProgress: {
                  ...(prev.uploadProgress || {}),
                  [fileId]: percent,
                },
              }));
            },
          });

          setState((prev) => ({
            ...prev,
            [type]: prev[type].map((f) =>
              f.id === fileId ? { ...f, status: "completed" } : f
            ),
            uploadProgress: Object.fromEntries(
              Object.entries(prev.uploadProgress || {}).filter(
                ([id]) => id !== fileId
              )
            ),
          }));

          showSnackbar("File uploaded successfully!", "success");
          // Refresh the uploaded files list
          fetchUploadedFiles();
        } catch (err) {
          setState((prev) => ({
            ...prev,
            [type]: prev[type].map((f) =>
              f.id === fileId ? { ...f, status: "failed" } : f
            ),
          }));
          console.error("Upload failed:", err.response?.data || err.message);
          showSnackbar("Upload failed!", "error");
        }
      }
    } catch (err) {
      console.error("Error getting token:", err);
      showSnackbar("Authentication error. Please sign in again.", "error");
    }
  };

  // UI Components
  const FileListItem = ({ file, type }) => (
    <ListItem
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        mb: 1,
        p: isMobile ? 1 : 2,
        bgcolor: colors.bg,
        transition: "all 0.2s ease",
        "&:hover": { transform: "translateX(2px)" },
      }}
    >
      <ListItemIcon sx={{ minWidth: isMobile ? 44 : 56 }}>
        <Box
          sx={{
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
            borderRadius: "10px",
            bgcolor: isdarkmode ? "#2b2b3a" : "#f5f7fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getFileIcon(file)}
        </Box>
      </ListItemIcon>

      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: isMobile ? "0.875rem" : "1rem",
                color: colors.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: isMobile ? "150px" : "300px",
              }}
            >
              {file.name || file.file_name || file.nameFile}
            </Typography>
            {file.status === "completed" && (
              <CheckCircleIcon
                sx={{ color: colors.success, fontSize: isMobile ? 16 : 20 }}
              />
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography
              sx={{
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                color: isdarkmode ? "#aaa" : "#666",
              }}
            >
              {formatFileSize(file.file_size)} •{" "}
              {new Date(file.date_uploaded).toLocaleString()}
            </Typography>
            {state.uploadProgress[file.id] !== undefined && (
              <Box sx={{ mt: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={state.uploadProgress[file.id]}
                  sx={{ height: 6, borderRadius: "4px" }}
                />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: isdarkmode ? "#aaa" : "#666",
                  }}
                >
                  {Math.round(state.uploadProgress[file.id])}% uploaded
                </Typography>
              </Box>
            )}
          </Box>
        }
        sx={{ my: 0 }}
      />

      <ListItemSecondaryAction>
        <Box sx={{ display: "flex", gap: isMobile ? 0.5 : 1 }}>
          <IconButton
            size="small"
            onClick={() => handleViewFile(file)}
            sx={{
              color: colors.primary,
              p: isMobile ? 0.5 : 1,
            }}
          >
            <ViewIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                deleteDialog: { open: true, file, type },
              }))
            }
            sx={{
              color: colors.error,
              p: isMobile ? 0.5 : 1,
            }}
          >
            <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );

  const UploadZone = ({ type, handleFileUpload, refs }) => {
    const isDragOver =
      state[`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`];
    const zoneColor = type === "document" ? colors.primary : colors.secondary;

    return (
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            [`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`]: true,
          }));
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            [`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
          }));
        }}
        onDrop={(e) => {
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            [`dragOver${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
          }));
          handleFileUpload(Array.from(e.dataTransfer.files), type);
        }}
        onClick={() => refs[`${type}Input`].current?.click()}
        sx={{
          border: `2px dashed ${isDragOver ? zoneColor : colors.border}`,
          borderRadius: "12px",
          p: isMobile ? 3 : 4,
          textAlign: "center",
          bgcolor: isDragOver ? `${zoneColor}08` : "transparent",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            borderColor: zoneColor,
            bgcolor: `${zoneColor}04`,
          },
        }}
      >
        <FileUploadOutlined
          sx={{
            fontSize: isMobile ? 36 : 48,
            color: isDragOver ? zoneColor : "#9ca3af",
            mb: isMobile ? 1 : 2,
          }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: isMobile ? "1rem" : "1.125rem",
            color: colors.text,
            mb: isMobile ? 0.5 : 1,
          }}
        >
          Drop {type === "document" ? "documents" : "corpus"} here
        </Typography>
        <Typography
          sx={{
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            color: isdarkmode ? "#aaa" : "#666",
            mb: isMobile ? 2 : 3,
          }}
        >
          Supported: {Object.values(korpusTypes).join(", ")} (max{" "}
          {maxFileSizeMB}MB)
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: zoneColor,
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            px: isMobile ? 3 : 4,
            py: isMobile ? 0.75 : 1,
            borderRadius: "8px",
            fontSize: isMobile ? "0.875rem" : "1rem",
            "&:hover": {
              bgcolor: zoneColor,
            },
          }}
        >
          Select Files
        </Button>
        <input
          ref={refs[`${type}Input`]}
          type="file"
          multiple
          accept={Object.values(korpusTypes).join(",")}
          onChange={(e) => handleFileUpload(Array.from(e.target.files), type)}
          style={{ display: "none" }}
        />
      </Box>
    );
  };

  // Helper functions
  const showSnackbar = (message, severity) => {
    setState((prev) => ({
      ...prev,
      snackbar: { open: true, message, severity },
    }));
  };

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
        {/* Page Header */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: colors.text,
            mt: isMobile ? 1 : 3,
            mb: isMobile ? 2 : 4,
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          Upload Corpus
        </Typography>

        {/* Corpus Upload Section */}
        <Paper
          sx={{
            p: isMobile ? 2 : 3,
            mb: isMobile ? 2 : 3,
            borderRadius: "12px",
            bgcolor: colors.bg,
            border: `1px solid ${colors.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
              sx={{
                fontWeight: 600,
                fontSize: isMobile ? "1.125rem" : "1.25rem",
                color: colors.text,
              }}
            >
              Upload Corpus
            </Typography>
            <Chip
              label={`${files.korpus.length} file${
                files.korpus.length !== 1 ? "s" : ""
              }`}
              size="small"
              sx={{
                bgcolor: colors.secondary,
                color: "white",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
            />
          </Box>

          <UploadZone
            type="korpus"
            refs={refs}
            handleFileUpload={handleFileUpload}
          />

          <Box sx={{ mt: isMobile ? 2 : 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: isMobile ? 1 : 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? "1rem" : "1.125rem",
                  color: colors.text,
                }}
              >
                Uploaded Corpus ({uploadedFiles.length})
              </Typography>
              <Button
                onClick={fetchUploadedFiles}
                disabled={loading}
                size="small"
                sx={{ textTransform: "none" }}
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography sx={{ color: isdarkmode ? "#aaa" : "#666" }}>
                  Loading files...
                </Typography>
              </Box>
            ) : uploadedFiles.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  color: isdarkmode ? "#aaa" : "#666",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  py: 2,
                }}
              >
                No files uploaded yet
              </Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {uploadedFiles.map((file) => (
                  <FileListItem key={file.id} file={file} type="korpus" />
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Preview Dialog */}
        <Dialog
          open={state.previewDialog.open}
          onClose={() =>
            setState((prev) => ({
              ...prev,
              previewDialog: { open: false, file: null, content: "" },
            }))
          }
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle
            sx={{
              fontSize: isMobile ? "1.125rem" : "1.25rem",
              bgcolor: isdarkmode ? "#2b2b3a" : "#f8fafc",
            }}
          >
            File Preview
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            {state.previewDialog.file && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: isMobile ? "1rem" : "1.125rem",
                    mb: 1,
                  }}
                >
                  {state.previewDialog.file.name ||
                    state.previewDialog.file.file_name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: isMobile ? "0.8125rem" : "0.875rem",
                    mb: 2,
                  }}
                >
                  {formatFileSize(state.previewDialog.file.file_size)} •{" "}
                  {state.previewDialog.file.file_type}
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    bgcolor: isdarkmode ? "#2b2b3a" : "#f5f7fa",
                    border: `1px solid ${colors.border}`,
                    minHeight: "200px",
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                >
                  {state.previewDialog.content ? (
                    <Typography
                      component="pre"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontSize: "0.875rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {state.previewDialog.content}
                    </Typography>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      {getFileIcon(state.previewDialog.file)}
                      <Typography sx={{ mt: 2, color: "text.secondary" }}>
                        File content could not be loaded
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions
            sx={{
              p: isMobile ? 2 : 3,
              bgcolor: isdarkmode ? "#2b2b3a" : "#f8fafc",
            }}
          >
            <Button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  previewDialog: { open: false, file: null, content: "" },
                }))
              }
              sx={{
                textTransform: "none",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={state.deleteDialog.open}
          onClose={() =>
            setState((prev) => ({
              ...prev,
              deleteDialog: { open: false, file: null, type: null },
            }))
          }
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontSize: isMobile ? "1.125rem" : "1.25rem" }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
              Are you sure you want to delete "
              {state.deleteDialog.file?.name ||
                state.deleteDialog.file?.file_name}
              "?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
            <Button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  deleteDialog: { open: false, file: null, type: null },
                }))
              }
              sx={{
                textTransform: "none",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteFile(state.deleteDialog.file)}
              color="error"
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: isMobile ? "0.875rem" : "1rem",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={state.snackbar.open}
          autoHideDuration={6000}
          onClose={() =>
            setState((prev) => ({
              ...prev,
              snackbar: { ...prev.snackbar, open: false },
            }))
          }
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() =>
              setState((prev) => ({
                ...prev,
                snackbar: { ...prev.snackbar, open: false },
              }))
            }
            severity={state.snackbar.severity}
            sx={{
              width: "100%",
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            {state.snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SDGUploadPage;
