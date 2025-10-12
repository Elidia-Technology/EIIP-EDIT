import React, { useRef, useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { Brightness4, Brightness7, CloudUpload, Download } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import EIIP from 'eiip';

const canvasStyle = {
  width: '100vw',
  height: 'calc(100vh - 64px)',
  display: 'block',
  background: '#222',
};

export default function Editor({ theme, setTheme }) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [eiip, setEiip] = useState(null);

  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        setImage(img);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Initialize EIIP with the canvas
        const eiipInstance = new EIIP(canvas);
        setEiip(eiipInstance);
        console.log('EIIP initialized successfully!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    noClick: true // Prevent clicking on canvas from opening file dialog
  });

  const handleUploadClick = (e) => {
    e.stopPropagation();
    document.getElementById('file-input').click();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Box {...getRootProps()}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            EIIP Image Editor
          </Typography>
          <IconButton color="inherit" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            color="primary"
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUploadClick}
            sx={{ ml: 2 }}
          >
            {isDragActive ? 'Drop image...' : 'Upload Image'}
          </Button>
          <input id="file-input" {...getInputProps()} style={{ display: 'none' }} />
          <Button
            color="secondary"
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{ ml: 2 }}
            disabled={!image}
          >
            Download
          </Button>
        </Toolbar>
      </AppBar>
      <canvas ref={canvasRef} style={canvasStyle} />
    </Box>
  );
}
