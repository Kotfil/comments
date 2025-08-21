import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

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
