import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { FileUpload, FileUploadProps } from './file-upload';
import { UploadedFile } from './file-upload.types';

export default {
  title: 'Molecules/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<FileUploadProps> = (args) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    console.log('Files changed:', newFiles);
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <FileUpload {...args} onFilesChange={handleFilesChange} />

      {files.length > 0 && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          <h4>Выбранные файлы:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} - {Math.round(file.size / 1024)}KB - {file.type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  maxFileSize: 100 * 1024, // 100KB
  allowedTypes: ['image/*', '.txt'],
  maxFiles: 3,
  disabled: false,
};

export const LimitedFiles = Template.bind({});
LimitedFiles.args = {
  maxFileSize: 100 * 1024,
  allowedTypes: ['image/*', '.txt'],
  maxFiles: 1,
  disabled: false,
};

export const LargeFiles = Template.bind({});
LargeFiles.args = {
  maxFileSize: 1024 * 1024, // 1MB
  allowedTypes: ['image/*', '.txt'],
  maxFiles: 5,
  disabled: false,
};

export const ImagesOnly = Template.bind({});
ImagesOnly.args = {
  maxFileSize: 100 * 1024,
  allowedTypes: ['image/*'],
  maxFiles: 3,
  disabled: false,
};

export const TextFilesOnly = Template.bind({});
TextFilesOnly.args = {
  maxFileSize: 100 * 1024,
  allowedTypes: ['.txt'],
  maxFiles: 3,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  maxFileSize: 100 * 1024,
  allowedTypes: ['image/*', '.txt'],
  maxFiles: 3,
  disabled: true,
};
