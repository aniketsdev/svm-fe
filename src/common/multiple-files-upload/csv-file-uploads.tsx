import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Grid, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../../../assets/icons/file_upload.svg";
import { palette } from '../../../theme/palette';

export type FilesMetaData = {
  name: string;
  type: string;
  file: File;
};

type MultipleFilesUploadProps = {
  onUpload: (filesMetaData: FilesMetaData[]) => void;
};

const CsvFileUpload = ({ onUpload }: MultipleFilesUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<FilesMetaData | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (
      file.type.includes("text/csv") ||
      file.type.includes("application/vnd.ms-excel") || // XLS
      file.type.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ) // XLSX
    ) {
      setUploadedFile({
        name: file.name,
        type: file.type,
        file,
      });
    }
  }, []);

  useEffect(() => {
    if (uploadedFile) {
      onUpload([uploadedFile]);
    }
  }, [uploadedFile, onUpload]);

  const handleDelete = () => {
    setUploadedFile(null);
    onUpload([]); // Notify parent that no file is selected
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Accept only one file
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  return (
    <Grid container flexDirection="column" gap={2} sx={{ width: "70%" }}>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${palette.neutral['40'] as string}`,
          width: "80%",
          padding: "3rem",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "10px",
          cursor: "pointer",
          flexDirection: "column",
        }}
      >
        <Grid container justifyContent="center" rowGap={2}>
          <input {...getInputProps()} />
          <Grid width="100%" container justifyContent="center">
            <img
              src={uploadIcon}
              style={{
                width: "100px",
                height: "50px",
                color: palette.neutral['40'] as string,
              }}
            />
          </Grid>
          {isDragActive ? (
            <Typography variant="body1">
              Drop the file here... Only CSV, XLS, or XLSX allowed.
            </Typography>
          ) : (
            <Grid>
              <Typography
                variant="body1"
                fontWeight={550}
                color={palette.primary.main as string}
                textAlign="center"
              >
                Browse File
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
      <Grid>
        <Typography variant="body2" color={palette.neutral['50'] as string}>
          Supported formats: CSV, XLS, XLSX
        </Typography>
      </Grid>
      {uploadedFile && (
        <Grid
          container
          sx={{ background: palette.neutral['10'], padding: 1 }}
          justifyContent="space-between"
          alignItems="center"
          width={"80%"}
        >
          <Grid container alignItems="center" width="fit-content" gap={5}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              width="80px"
              height="80px"
            >
              <InsertDriveFileIcon fontSize="large" />
            </Grid>
            <Typography variant="body1">{uploadedFile.name}</Typography>
          </Grid>
          <Grid>
            <IconButton onClick={handleDelete}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default CsvFileUpload;
