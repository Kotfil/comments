import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import {
  Image,
  Description,
  Close,
  Download,
  Visibility,
} from '@mui/icons-material';
import { AttachedFilesProps, FileData } from './attached-files.types';
import { formatFileSize, isImageFile, isTextFile } from '@/lib/file-utils';

export const AttachedFiles: React.FC<AttachedFilesProps> = ({
  files,
  onDownload,
}) => {
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!files || files.length === 0) {
    return null;
  }

  const handlePreview = (file: FileData) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };

  const handleDownload = (file: FileData) => {
    if (onDownload) {
      onDownload(file);
    } else {
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (file: FileData) => {
    if (isImageFile({ type: file.type } as File)) {
      return <Image fontSize="small" />;
    }
    return <Description fontSize="small" />;
  };

  const renderPreviewContent = () => {
    if (!previewFile) return null;

    if (isImageFile({ type: previewFile.type } as File)) {
      return (
        <img
          src={previewFile.data}
          alt={previewFile.name}
          style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
        />
      );
    }

    if (
      isTextFile({ type: previewFile.type, name: previewFile.name } as File)
    ) {
      return (
        <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              margin: 0,
            }}
          >
            {atob(previewFile.data.split(',')[1])}
          </pre>
        </Box>
      );
    }

    return (
      <Typography>
        Предварительный просмотр недоступен для этого типа файла.
        <br />
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => handleDownload(previewFile)}
          sx={{ mt: 2 }}
        >
          Скачать файл
        </Button>
      </Typography>
    );
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Прикрепленные файлы ({files.length}):
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {files.map((file, index) => (
            <Chip
              key={index}
              icon={getFileIcon(file)}
              label={`${file.name} (${formatFileSize(file.size)})`}
              onClick={() => handlePreview(file)}
              onDelete={() => onDownload && onDownload(file)}
              deleteIcon={<Download />}
              variant="outlined"
              color="primary"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Модальное окно предварительного просмотра */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{previewFile?.name}</Typography>
            <IconButton onClick={handleClosePreview}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>{renderPreviewContent()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Закрыть</Button>
          {previewFile && (
            <Button
              onClick={() => handleDownload(previewFile)}
              startIcon={<Download />}
              variant="contained"
            >
              Скачать
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
