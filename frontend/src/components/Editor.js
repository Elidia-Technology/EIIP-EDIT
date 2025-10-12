import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import EIIP from 'eiip';

export default function Editor() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [eiip, setEiip] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [theme, setTheme] = useState('dark');
  
  // Tool parameters
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [rotateAngle, setRotateAngle] = useState(90);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blurAmount, setBlurAmount] = useState(5);
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [watermarkText, setWatermarkText] = useState('WATERMARK');
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(400);
  const [cropHeight, setCropHeight] = useState(400);

  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        if (!canvasRef.current) {
          console.error('Canvas ref is not available');
          return;
        }
        
        setImage(img);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const eiipInstance = new EIIP(canvas);
        setEiip(eiipInstance);
        
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        setCropWidth(Math.min(400, img.width));
        setCropHeight(Math.min(400, img.height));
        
        console.log('EIIP initialized successfully!');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    noClick: true
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

  // EIIP Functions
  const handleResize = () => {
    if (!eiip) return;
    try {
      eiip.resize(resizeWidth, resizeHeight);
      console.log(`Resized to ${resizeWidth}x${resizeHeight}`);
    } catch (error) {
      console.error('Resize error:', error);
    }
  };

  const handleRotate = (angle) => {
    if (!eiip) return;
    try {
      eiip.rotate(angle || rotateAngle);
      console.log(`Rotated by ${angle || rotateAngle} degrees`);
    } catch (error) {
      console.error('Rotate error:', error);
    }
  };

  const handleFlip = (direction) => {
    if (!eiip) return;
    try {
      eiip.flip(direction);
      console.log(`Flipped ${direction}`);
    } catch (error) {
      console.error('Flip error:', error);
    }
  };

  const handleCrop = () => {
    if (!eiip) return;
    try {
      eiip.crop(cropX, cropY, cropWidth, cropHeight);
      console.log(`Cropped: x=${cropX}, y=${cropY}, w=${cropWidth}, h=${cropHeight}`);
    } catch (error) {
      console.error('Crop error:', error);
    }
  };

  const handleBrightness = () => {
    if (!eiip) return;
    try {
      eiip.brightness(brightness);
      console.log(`Brightness adjusted: ${brightness}`);
    } catch (error) {
      console.error('Brightness error:', error);
    }
  };

  const handleContrast = () => {
    if (!eiip) return;
    try {
      eiip.contrast(contrast);
      console.log(`Contrast adjusted: ${contrast}`);
    } catch (error) {
      console.error('Contrast error:', error);
    }
  };

  const handleSaturation = () => {
    if (!eiip) return;
    try {
      eiip.saturation(saturation);
      console.log(`Saturation adjusted: ${saturation}`);
    } catch (error) {
      console.error('Saturation error:', error);
    }
  };

  const handleBlur = () => {
    if (!eiip) return;
    try {
      eiip.blur(blurAmount);
      console.log(`Blur applied: ${blurAmount}`);
    } catch (error) {
      console.error('Blur error:', error);
    }
  };

  const handleGrayscale = () => {
    if (!eiip) return;
    try {
      eiip.grayscale();
      console.log('Grayscale applied');
    } catch (error) {
      console.error('Grayscale error:', error);
    }
  };

  const handleInvert = () => {
    if (!eiip) return;
    try {
      eiip.invert();
      console.log('Invert applied');
    } catch (error) {
      console.error('Invert error:', error);
    }
  };

  const handleSepia = () => {
    if (!eiip) return;
    try {
      eiip.sepia();
      console.log('Sepia applied');
    } catch (error) {
      console.error('Sepia error:', error);
    }
  };

  const handleWatermark = () => {
    if (!eiip) return;
    try {
      eiip.watermark(watermarkText, 50, 50, {
        font: '30px Arial',
        color: 'rgba(255, 255, 255, 0.5)',
      });
      console.log(`Watermark added: ${watermarkText}`);
    } catch (error) {
      console.error('Watermark error:', error);
    }
  };

  const handleCompress = () => {
    if (!eiip) return;
    try {
      const compressed = eiip.compress(compressionQuality);
      console.log(`Compressed with quality: ${compressionQuality}`, compressed);
    } catch (error) {
      console.error('Compress error:', error);
    }
  };

  const handleReset = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const eiipInstance = new EIIP(canvas);
    setEiip(eiipInstance);
    console.log('Image reset to original');
  };

  const renderToolPanel = () => {
    if (!selectedTool) return null;

    const panelClass = `bg-${theme === 'dark' ? 'gray-800' : 'white'} p-6 rounded-lg shadow-xl`;
    const inputClass = `w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`;
    const btnClass = `w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105`;
    const btnSecondaryClass = `w-full px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold`;

    switch (selectedTool) {
      case 'resize':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Resize Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Width</label>
                <input type="number" value={resizeWidth} onChange={(e) => setResizeWidth(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Height</label>
                <input type="number" value={resizeHeight} onChange={(e) => setResizeHeight(Number(e.target.value))} className={inputClass} />
              </div>
              <button onClick={handleResize} className={btnClass}>Apply Resize</button>
            </div>
          </div>
        );

      case 'rotate':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Rotate Image</h3>
            <div className="space-y-3">
              <button onClick={() => handleRotate(90)} className={btnClass}>Rotate 90°</button>
              <button onClick={() => handleRotate(180)} className={btnSecondaryClass}>Rotate 180°</button>
              <button onClick={() => handleRotate(270)} className={btnSecondaryClass}>Rotate 270°</button>
              <div>
                <label className="block text-sm font-semibold mb-2">Custom Angle</label>
                <input type="number" value={rotateAngle} onChange={(e) => setRotateAngle(Number(e.target.value))} className={inputClass} />
              </div>
              <button onClick={handleRotate} className={btnSecondaryClass}>Apply Custom</button>
            </div>
          </div>
        );

      case 'flip':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Flip Image</h3>
            <div className="space-y-3">
              <button onClick={() => handleFlip('horizontal')} className={btnClass}>Flip Horizontal</button>
              <button onClick={() => handleFlip('vertical')} className={btnSecondaryClass}>Flip Vertical</button>
            </div>
          </div>
        );

      case 'crop':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Crop Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">X Position</label>
                <input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Y Position</label>
                <input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Width</label>
                <input type="number" value={cropWidth} onChange={(e) => setCropWidth(Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Height</label>
                <input type="number" value={cropHeight} onChange={(e) => setCropHeight(Number(e.target.value))} className={inputClass} />
              </div>
              <button onClick={handleCrop} className={btnClass}>Apply Crop</button>
            </div>
          </div>
        );

      case 'adjust':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Adjust Colors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Brightness: {brightness}</label>
                <input type="range" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} min="-100" max="100" className="w-full" />
                <button onClick={handleBrightness} className={`${btnClass} mt-2`}>Apply Brightness</button>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Contrast: {contrast}</label>
                <input type="range" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} min="-100" max="100" className="w-full" />
                <button onClick={handleContrast} className={`${btnClass} mt-2`}>Apply Contrast</button>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Saturation: {saturation}</label>
                <input type="range" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} min="-100" max="100" className="w-full" />
                <button onClick={handleSaturation} className={`${btnClass} mt-2`}>Apply Saturation</button>
              </div>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Filters</h3>
            <div className="space-y-3">
              <button onClick={handleGrayscale} className={btnClass}>Grayscale</button>
              <button onClick={handleSepia} className={btnSecondaryClass}>Sepia</button>
              <button onClick={handleInvert} className={btnSecondaryClass}>Invert</button>
            </div>
          </div>
        );

      case 'blur':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Blur Effect</h3>
            <div className="space-y-4">
              <label className="block text-sm font-semibold mb-2">Blur Amount: {blurAmount}</label>
              <input type="range" value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))} min="1" max="20" className="w-full" />
              <button onClick={handleBlur} className={btnClass}>Apply Blur</button>
            </div>
          </div>
        );

      case 'watermark':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Add Watermark</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Watermark Text</label>
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className={inputClass} />
              </div>
              <button onClick={handleWatermark} className={btnClass}>Add Watermark</button>
            </div>
          </div>
        );

      case 'compress':
        return (
          <div className={panelClass}>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Compress Image</h3>
            <div className="space-y-4">
              <label className="block text-sm font-semibold mb-2">Quality: {compressionQuality.toFixed(1)}</label>
              <input type="range" value={compressionQuality} onChange={(e) => setCompressionQuality(Number(e.target.value))} min="0.1" max="1" step="0.1" className="w-full" />
              <button onClick={handleCompress} className={btnClass}>Compress</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const sidebarBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const headerBgClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div {...getRootProps()} className={`h-screen flex flex-col ${bgClass}`}>
      {/* Header */}
      <header className={`${headerBgClass} border-b shadow-lg`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              EIIP Image Editor
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {image && (
              <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold">
                {canvasRef.current?.width || 0} × {canvasRef.current?.height || 0}
              </span>
            )}
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={handleUploadClick}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isDragActive ? '📁 Drop image...' : '📤 Upload'}
            </button>
            <input id="file-input" {...getInputProps()} style={{ display: 'none' }} />
            
            {image && (
              <>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold"
                >
                  🔄 Reset
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  💾 Download
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className={`${sidebarBgClass} w-64 border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto shadow-xl`}>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Tools</h2>
              <div className="space-y-2">
                {[
                  { id: 'resize', icon: '📐', label: 'Resize' },
                  { id: 'rotate', icon: '🔄', label: 'Rotate' },
                  { id: 'flip', icon: '🔃', label: 'Flip' },
                  { id: 'crop', icon: '✂️', label: 'Crop' },
                  { id: 'adjust', icon: '🎨', label: 'Adjust Colors' },
                  { id: 'filters', icon: '✨', label: 'Filters' },
                  { id: 'blur', icon: '💫', label: 'Blur' },
                  { id: 'watermark', icon: '📝', label: 'Watermark' },
                  { id: 'compress', icon: '🗜️', label: 'Compress' },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => { setSelectedTool(tool.id); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-semibold ${
                      selectedTool === tool.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                        : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                    }`}
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Tool Panel */}
        {selectedTool && (
          <div className="w-80 p-6 overflow-y-auto border-r border-gray-700">
            {renderToolPanel()}
          </div>
        )}

        {/* Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {!image ? (
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-32 h-32 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-300 mb-3">
                Drop Your Image Here
              </h2>
              <p className="text-gray-500 text-lg">
                or click the Upload button to get started
              </p>
            </div>
          ) : null}
          
          <div className={`max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden ${!image ? 'hidden' : ''}`}>
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
          </div>
        </main>
      </div>
    </div>
  );
}
