import styled from 'styled-components';

interface CommentContainerProps {
  level: number;
}

export const CommentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const VerticalLine = styled.div`
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e5e7eb;
  z-index: 1;
`;

export const CommentContainer = styled.div<CommentContainerProps>`
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  margin-left: ${({ level }) => level * 40}px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  
  .replies {
    margin-top: 16px;
  }
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Username = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  line-height: 1.2;
`;

export const Timestamp = styled.span`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
`;

export const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

export const VoteCounter = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-left: 4px;
`;

export const CommentContent = styled.div`
  margin-bottom: 12px;
`;

export const CommentText = styled.p`
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #eff6ff;
  }
`;
