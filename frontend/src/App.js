import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Editor from './components/Editor';

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

function App() {
  const [theme, setTheme] = React.useState('light');
  const muiTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Editor theme={theme} setTheme={setTheme} />
    </ThemeProvider>
  );
}

export default App;
