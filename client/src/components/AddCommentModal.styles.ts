import styled from 'styled-components';
import { Box, Typography, IconButton } from '@mui/material';

export const AddCommentModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  outline: none;
`;

export const ModalContent = styled(Box)`
  padding: 24px;
`;

export const FormSection = styled(Box)`
  margin-bottom: 16px;
`;

export const HTMLToolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

export const HTMLButton = styled(IconButton)`
  && {
    padding: 8px;
    border: 1px solid #d1d5db;
    background-color: white;
    color: #374151;
    
    &:hover {
      background-color: #e5e7eb;
      border-color: #9ca3af;
    }
    
    &:active {
      background-color: #d1d5db;
    }
  }
`;
