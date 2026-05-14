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
  preview: string;
  // base64: string;
  file: File;
};

type MultipleFilesUploadProps = {
  onUpload: (filesMetaData: FilesMetaData[]) => void;
};

const MultipleFilesUpload = (props: MultipleFilesUploadProps) => {
  const { onUpload } = props;
  const [uploadedFiles, setUploadedFiles] = useState<FilesMetaData[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (
      acceptedFiles[0].type.includes("application/pdf") ||
      acceptedFiles[0].type.includes("image/png") ||
      acceptedFiles[0].type.includes("image/jpeg") ||
      acceptedFiles[0].type.includes("text/csv")
    ) {
      const file = acceptedFiles[0];
      // const base64Data = await convertToBase64(file);
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          type: file.type,
          preview: `data:${file.type}`,
          // base64: base64Data,
          file,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    onUpload(uploadedFiles);
  }, [uploadedFiles, onUpload]);

  const handleDelete = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <Grid container flexDirection={"column"} gap={2}>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${palette.neutral['40'] as string}`,
          width: "100%",
          padding: "3rem",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          borderRadius: "10px",
          cursor: "pointer",
          flexDirection: "column",
        }}
      >
        <Grid container justifyContent={"center"} rowGap={2}>
          <input {...getInputProps()} />
          <Grid width={"100%"} container justifyContent={"center"}>
            <img
              src={uploadIcon}
              alt="Upload files"
              style={{
                width: "100px",
                height: "50px",
                color: palette.neutral['40'] as string,
              }}
            />
          </Grid>
          {isDragActive ? (
            <Typography variant="body1">
              Drop the files here ...Only pdf, png or jpeg.
            </Typography>
          ) : (
            <Grid>
              <Typography
                variant="body1"
                textAlign={"center"}
                fontWeight={550}
                color={palette.text.primary as string}
              >
                Drag & drop files
              </Typography>
              <Typography
                variant="body1"
                textAlign={"center"}
                fontWeight={550}
                color={palette.text.primary as string}
              >
                Or
              </Typography>
              <Typography
                variant="body1"
                fontWeight={550}
                color={palette.primary.main as string}
                textAlign={"center"}
              >
                Browse Files
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
      <Grid container>
        <Typography variant="body2" color={palette.neutral['50'] as string}>
          {"Supported formats: pdf, png, jpeg, csv"}
        </Typography>
      </Grid>
      {uploadedFiles.map((item, index) => (
        <Grid
          container
          sx={{ background: palette.neutral['10'], padding: 1 }}
          justifyContent={"space-between"}
          alignItems={"center"}
          key={`${item.name}-${item.type}`}
        >
          <Grid
            container
            alignItems={"center"}
            sx={{ width: "fit-content", gap: 5 }}
          >
            {item.type.includes("image") && (
              <img height={"80px"} src={item.preview} alt={`Preview of ${item.name}`} />
            )}
            {!item.type.includes("image") && (
              <Grid
                container
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ width: "80px", height: "80px" }}
              >
                <InsertDriveFileIcon fontSize="large" />
              </Grid>
            )}
            <Typography variant="body1">{item.name}</Typography>
          </Grid>
          <Grid container>
            <IconButton onClick={() => handleDelete(index)} aria-label={`Remove ${item.name}`}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default MultipleFilesUpload;
