import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './screens/home';
import NotFound from './components/error-page';
import React, { useState } from 'react';
import { Box, Switch } from '@mui/material';
import NavBar from './components/navigationBar';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Paper from './screens/papers';
import Fos from './screens/fos';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
const App = () => {
  const [theme, setTheme] = useState(lightTheme);
  const setThemeType = (type) => setTheme(type === 'dark' ? darkTheme : lightTheme);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
            width: '100%',
          }}
        >
          <Box flex={15}>
            <NavBar />
          </Box>
          <Box flex={1} sx={{ alignItems: 'center', display: 'flex', marginRight: 5 }}>
            <LightModeIcon />
            <Switch onChange={(event, value) => setTheme(value ? darkTheme : lightTheme)} />
            <DarkModeIcon />
          </Box>
        </Box>
        <Routes>
          <Route path="/" element={<Home setTheme={setThemeType} />} />
          <Route path="/papers" element={<Paper />} />
          <Route path="/fos" element={<Fos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
};

export default App;
