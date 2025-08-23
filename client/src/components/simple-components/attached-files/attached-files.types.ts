export interface FileData {
  name: string;
  type: string;
  size: number;
  data: string; // base64 строка
}

export interface AttachedFilesProps {
  files?: FileData[];
  onDownload?: (file: FileData) => void;
}
