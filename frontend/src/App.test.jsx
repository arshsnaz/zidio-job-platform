import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, Container, Box } from '@mui/material';
import theme from './theme';

function TestApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Typography variant="h2" color="primary">
            🎉 ZIDIO Connect - Test Page Working! 🎉
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default TestApp;