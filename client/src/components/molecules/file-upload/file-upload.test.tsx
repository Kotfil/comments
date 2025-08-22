import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from './file-upload';
import { UploadedFile } from './file-upload.types';

// Мокаем Material-UI компоненты
jest.mock('@mui/material', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Alert: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Chip: ({ children, onDelete, ...props }: any) => (
    <div {...props}>
      {children}
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  ),
}));

// Мокаем Material-UI иконки
jest.mock('@mui/icons-material', () => ({
  CloudUpload: () => <span>CloudUpload</span>,
  Delete: () => <span>Delete</span>,
  Description: () => <span>Description</span>,
  Image: () => <span>Image</span>,
}));

describe('FileUpload', () => {
  const mockOnFilesChange = jest.fn();
  const defaultProps = {
    onFilesChange: mockOnFilesChange,
    maxFileSize: 100 * 1024, // 100KB
    allowedTypes: ['image/*', '.txt'],
    maxFiles: 3,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload button', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByText('Выбрать файлы')).toBeInTheDocument();
  });

  it('shows file type restrictions', () => {
    render(<FileUpload {...defaultProps} />);
    expect(
      screen.getByText(/Разрешены: картинки и TXT файлы/)
    ).toBeInTheDocument();
  });

  it('shows file size limit', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByText(/максимум 100KB каждый/)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(<FileUpload {...defaultProps} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'test.txt',
          type: 'text/plain',
          size: 12,
        }),
      ]);
    });
  });

  it('validates file size', async () => {
    render(<FileUpload {...defaultProps} />);

    // Создаем файл больше 100KB
    const largeFile = new File(['x'.repeat(200 * 1024)], 'large.txt', {
      type: 'text/plain',
    });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Файл слишком большой/)).toBeInTheDocument();
    });

    expect(mockOnFilesChange).not.toHaveBeenCalled();
  });

  it('validates file type', async () => {
    render(<FileUpload {...defaultProps} />);

    const invalidFile = new File(['test'], 'test.pdf', {
      type: 'application/pdf',
    });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(
        screen.getByText(/Неподдерживаемый тип файла/)
      ).toBeInTheDocument();
    });

    expect(mockOnFilesChange).not.toHaveBeenCalled();
  });

  it('respects max files limit', async () => {
    render(<FileUpload {...defaultProps} maxFiles={1} />);

    const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
    const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file1, file2] } });

    await waitFor(() => {
      expect(screen.getByText(/Максимум 1 файлов/)).toBeInTheDocument();
    });
  });

  it('disables upload when disabled prop is true', () => {
    render(<FileUpload {...defaultProps} disabled={true} />);
    const button = screen.getByText('Выбрать файлы');
    expect(button).toBeDisabled();
  });

  it('disables upload when max files reached', async () => {
    render(<FileUpload {...defaultProps} maxFiles={1} />);

    const file = new File(['content'], 'file.txt', { type: 'text/plain' });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const button = screen.getByText('Выбрать файлы');
      expect(button).toBeDisabled();
    });
  });

  it('allows image files', async () => {
    render(<FileUpload {...defaultProps} />);

    const imageFile = new File(['image data'], 'image.jpg', {
      type: 'image/jpeg',
    });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [imageFile] } });

    await waitFor(() => {
      expect(mockOnFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'image.jpg',
          type: 'image/jpeg',
        }),
      ]);
    });
  });

  it('allows txt files', async () => {
    render(<FileUpload {...defaultProps} />);

    const txtFile = new File(['text content'], 'document.txt', {
      type: 'text/plain',
    });
    const input = screen.getByDisplayValue('') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [txtFile] } });

    await waitFor(() => {
      expect(mockOnFilesChange).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'document.txt',
          type: 'text/plain',
        }),
      ]);
    });
  });
});
