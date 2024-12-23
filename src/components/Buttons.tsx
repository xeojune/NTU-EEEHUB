import React, { useState } from "react";
import styled from 'styled-components';

interface ButtonProps {
    width?: string;
    height?: string;
    background?: string;
    color?: string;
    radius?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

const StyledButton = styled.button<ButtonProps> `
    width: ${props => props.width ? props.width : '100%'};
    background-color: ${props => props.background ? props.background: '#67A8E3'};
    border-radius: ${props => props.radius ? props.radius: '0'};
    height: ${props => props.height ? props.height : '100%'};
    color: ${props => props.color ? props.color : '#ffffff'};
    border: 1px solid gray;
    outline: none;
    padding: 5px;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        cursor: pointer;
        background-color: red;
        color: ${props => props.color ? props.color : '#ffffff'};
        transition: background-color 0.2s ease;
        outline: none;
    }
    &:active {
        outline: none;
    }
    &:disabled {
        background-color: #dadada;
        color: white;
        cursor: not-allowed;
    }
`;

const Button: React.FC<ButtonProps> = ({
    width = '100%',
    height = '100%',
    background = '#67A8E3',
    color = '#FFFFFF',
    radius = '0',
    onClick = () => {},
    children,
    disabled = false
}) => {
    return (
        <StyledButton 
            width={width}
            height={height}
            background={background} 
            color={color} 
            radius={radius}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </StyledButton>
    );
};

export { Button };