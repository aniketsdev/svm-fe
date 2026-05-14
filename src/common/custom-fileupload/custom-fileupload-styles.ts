import { palette } from '../../../theme/palette';

export type FileUploadType = 'default' | 'drag-drop' | 'button' | 'icon';
export type FileUploadSize = 'sm' | 'md' | 'lg';
export type FileUploadState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'error';

export interface FileUploadStyles {
  container: React.CSSProperties;
  uploadArea: React.CSSProperties;
  uploadAreaHover: React.CSSProperties;
  uploadAreaFocus: React.CSSProperties;
  uploadAreaActive: React.CSSProperties;
  uploadAreaDisabled: React.CSSProperties;
  uploadAreaError: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
  labelHover: React.CSSProperties;
  labelDisabled: React.CSSProperties;
  icon: React.CSSProperties;
  iconHover: React.CSSProperties;
  iconDisabled: React.CSSProperties;
  button: React.CSSProperties;
  buttonHover: React.CSSProperties;
  buttonFocus: React.CSSProperties;
  buttonActive: React.CSSProperties;
  buttonDisabled: React.CSSProperties;
  fileList: React.CSSProperties;
  fileItem: React.CSSProperties;
  fileName: React.CSSProperties;
  fileSize: React.CSSProperties;
  removeButton: React.CSSProperties;
  progressBar: React.CSSProperties;
  progressFill: React.CSSProperties;
  errorMessage: React.CSSProperties;
  helperText: React.CSSProperties;
}

export const getFileUploadStyles = (
  _type: FileUploadType,
  size: FileUploadSize
): FileUploadStyles => {
  const baseFontFamily = '"Figtree", sans-serif';
  
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: '8px 12px',
      minHeight: '32px',
      fontSize: '14px',
      iconSize: '16px',
      borderRadius: '4px',
    },
    md: {
      padding: '12px 16px',
      minHeight: '40px',
      fontSize: '16px',
      iconSize: '20px',
      borderRadius: '6px',
    },
    lg: {
      padding: '16px 20px',
      minHeight: '48px',
      fontSize: '18px',
      iconSize: '24px',
      borderRadius: '8px',
    },
  };

  const config = sizeConfig[size];

  // Base styles
  const baseStyles: FileUploadStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
    },
    uploadArea: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: size === 'sm' ? "8px 12px" : size === 'md' ? "24px 20px" : "40px 20px",
      minHeight: size === 'sm' ? "48px" : size === 'md' ? "120px" : "200px",
      border: `2px dashed ${palette.neutral['10'] as string}`, // Neutral/10
      borderRadius: "12px", // More rounded corners
      backgroundColor: palette.solid.white as string,
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      fontFamily: baseFontFamily,
      position: "relative",
      overflow: "hidden",
    },
    uploadAreaHover: {
      borderColor: palette.secondary.main as string, // Green border on hover
      backgroundColor: palette.secondary['01'],
    },
    uploadAreaFocus: {
      borderColor: palette.secondary.main as string, // Primary Green
      backgroundColor: palette.secondary['01'],
      boxShadow: `0 0 0 2px ${palette.secondary['05']}`,
    },
    uploadAreaActive: {
      borderColor: palette.secondary.main as string, // Primary Green
      backgroundColor: palette.secondary['05'],
    },
    uploadAreaDisabled: {
      borderColor: palette.neutral['10'] as string, // Neutral/10
      backgroundColor: palette.neutral['00'] as string, // Neutral/00
      cursor: "not-allowed",
      opacity: 0.6,
    },
    uploadAreaError: {
      borderColor: palette.negative.main as string, // Error Red
      backgroundColor: palette.negative['01'],
    },
    input: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
      cursor: "pointer",
      zIndex: 0,
      pointerEvents: "none",
    },
    label: {
      fontSize: config.fontSize,
      fontWeight: 500,
      color: palette.neutral['80'] as string, // Neutral/80
      textAlign: "center",
      fontFamily: baseFontFamily,
      lineHeight: 1.5,
      margin: 0,
    },
    labelHover: {
      color: palette.secondary.main as string, // Primary Green
    },
    labelDisabled: {
      color: palette.neutral['40'] as string, // Neutral/40
    },
    icon: {
      fontSize: config.iconSize,
      color: palette.secondary.main as string, // Green color for icon
      marginBottom: "0px", // No margin since we handle it in the circular background
    },
    iconHover: {
      color: palette.secondary.main as string, // Primary Green
    },
    iconDisabled: {
      color: palette.neutral['40'] as string, // Neutral/40
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: config.padding,
      minHeight: config.minHeight,
      backgroundColor: palette.secondary.main as string, // Primary Green
      color: palette.solid.white as string,
      border: "none",
      borderRadius: config.borderRadius,
      fontSize: config.fontSize,
      fontWeight: 500,
      fontFamily: baseFontFamily,
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      textDecoration: "none",
    },
    buttonHover: {
      backgroundColor: palette.secondary.dark as string, // Darker green
    },
    buttonFocus: {
      backgroundColor: palette.secondary.dark as string, // Darker green
      boxShadow: "0 0 0 2px rgba(67, 147, 34, 0.2)",
    },
    buttonActive: {
      backgroundColor: palette.secondary.dark as string, // Even darker green
    },
    buttonDisabled: {
      backgroundColor: palette.neutral['40'] as string, // Neutral/40
      cursor: "not-allowed",
      opacity: 0.6,
    },
    fileList: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "8px",
    },
    fileItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 12px",
      backgroundColor: palette.neutral['00'] as string, // Light background
      border: `1px solid ${palette.outline.decorative as string}`, // Light border
      borderRadius: "4px",
      fontFamily: baseFontFamily,
    },
    fileName: {
      fontSize: "14px",
      fontWeight: 500,
      color: palette.neutral['80'] as string, // Neutral/80
      fontFamily: baseFontFamily,
      flex: 1,
      marginRight: "8px",
    },
    fileSize: {
      fontSize: "12px",
      color: palette.neutral['40'] as string, // Neutral/40
      fontFamily: baseFontFamily,
      marginRight: "8px",
    },
    removeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      color: palette.negative.main as string, // Error Red
      fontSize: "14px",
      transition: "all 0.2s ease-in-out",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      backgroundColor: palette.outline.decorative as string, // Light background
      borderRadius: "2px",
      overflow: "hidden",
      marginTop: "4px",
    },
    progressFill: {
      height: "100%",
      backgroundColor: palette.secondary.main as string, // Primary Green
      transition: "width 0.3s ease-in-out",
    },
    errorMessage: {
      color: palette.negative.main as string, // Error Red
      fontSize: "12px",
      marginTop: "4px",
      fontFamily: baseFontFamily,
      fontWeight: 400,
      lineHeight: 1.2,
    },
    helperText: {
      color: palette.neutral['40'] as string, // Neutral/40
      fontSize: "14px", // Slightly larger for better readability
      marginTop: "4px",
      fontFamily: baseFontFamily,
      fontWeight: 400,
      lineHeight: 1.2,
    },
  };

  return baseStyles;
};

export const customFileUploadStyles = {
  // Default styles for common use cases
  default: getFileUploadStyles('default', 'md'),
  small: getFileUploadStyles('default', 'sm'),
  large: getFileUploadStyles('default', 'lg'),
  
  // Button variant
  button: getFileUploadStyles('button', 'md'),
  buttonSmall: getFileUploadStyles('button', 'sm'),
  buttonLarge: getFileUploadStyles('button', 'lg'),
  
  // Drag and drop variant
  dragDrop: getFileUploadStyles('drag-drop', 'md'),
  dragDropSmall: getFileUploadStyles('drag-drop', 'sm'),
  dragDropLarge: getFileUploadStyles('drag-drop', 'lg'),
  
  // Icon variant
  icon: getFileUploadStyles('icon', 'md'),
  iconSmall: getFileUploadStyles('icon', 'sm'),
  iconLarge: getFileUploadStyles('icon', 'lg'),
};
