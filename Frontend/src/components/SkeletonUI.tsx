import React from 'react';
import styled, {keyframes} from 'styled-components';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  marginTop?: string;
  marginBottom?: string;
}

const fadeAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const SkeletonBox = styled.div<SkeletonProps>`
  background-color: #575A59;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '15px'};
  border-radius: ${(props) => props.borderRadius || '4px'};
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-bottom: ${(props) => props.marginBottom || '0px'};
  animation: ${fadeAnimation} 1.5s ease-in-out infinite; /* Apply the animation */
`;

const SkeletonTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* Add some spacing between text skeletons */
`;

interface SkeletonUIProps extends SkeletonProps {
  rows?: number; // Number of skeleton rows
  rowGap?: string; // Gap between skeleton rows
  isText?: boolean; // Flag to render as text column
}

const SkeletonUI: React.FC<SkeletonUIProps> = ({
  rows = 1,
  rowGap = '10px',
  width,
  height,
  borderRadius,
  marginTop,
  marginBottom,
  isText = false,
}) => {
  if (isText) {
    return (
      <SkeletonTextWrapper>
        {Array.from({ length: rows }).map((_, idx) => (
          <SkeletonBox
            key={idx}
            width={width}
            height={height}
            borderRadius={borderRadius}
            marginBottom={rowGap || marginBottom}
          />
        ))}
      </SkeletonTextWrapper>
    );
  }

  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <SkeletonBox
          key={idx}
          width={width}
          height={height}
          borderRadius={borderRadius}
          marginTop={marginTop}
          marginBottom={rowGap || marginBottom}
        />
      ))}
    </>
  );
};

export default SkeletonUI;
