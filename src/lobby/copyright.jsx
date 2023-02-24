import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import React from 'react'

const StyledTypography = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(3, 'auto'),
    fontSize: 'smaller',
    opacity: 0.5
}));

export default function Copyright() {
    return (
        <StyledTypography align="center">
            {`© ${new Date().getFullYear()} Lewis Silletto`}
        </StyledTypography>
    );
}
