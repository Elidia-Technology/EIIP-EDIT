import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import EIIP from 'eiip';

export default function Editor() {
  const canvasRef = useRef(null);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [eiip] = useState(() => new EIIP({ debug: true }));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [processing, setProcessing] = useState(false);
  
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

  const displayImageOnCanvas = (dataUrl) => {
    if (!canvasRef.current) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      setResizeWidth(img.width);
      setResizeHeight(img.height);
      setCropWidth(Math.min(400, img.width));
      setCropHeight(Math.min(400, img.height));
      setCropX(0);
      setCropY(0);
    };
    img.src = dataUrl;
  };

  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Store original file
    setOriginalFile(file);
    setCurrentImageFile(file);
    
    // Display image
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentImageURL(e.target.result);
      displayImageOnCanvas(e.target.result);
      console.log('✅ Image loaded successfully!');
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
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    console.log('✅ Image downloaded');
  };

  // EIIP-based Image Processing Functions (all async)
  const handleResize = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.resizeImage(currentImageURL, {
        width: resizeWidth,
        height: resizeHeight,
        fit: 'fill',
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Resized to ${resizeWidth}x${resizeHeight}`);
    } catch (error) {
      console.error('❌ Resize error:', error);
      alert('Resize failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate = async (angle) => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const degrees = angle || rotateAngle;
      const result = await eiip.rotateImage(currentImageURL, degrees, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Rotated by ${degrees} degrees`);
    } catch (error) {
      console.error('❌ Rotate error:', error);
      alert('Rotate failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleFlip = async (direction) => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.flipImage(currentImageURL, direction, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Flipped ${direction}`);
    } catch (error) {
      console.error('❌ Flip error:', error);
      alert('Flip failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCrop = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.cropImage(currentImageURL, {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight
      }, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Cropped: x=${cropX}, y=${cropY}, w=${cropWidth}, h=${cropHeight}`);
    } catch (error) {
      console.error('❌ Crop error:', error);
      alert('Crop failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleAdjustColors = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      // Map our values to EIIP's color adjustment
      const result = await eiip.adjustColors(currentImageURL, {
        brightness: brightness / 100, // Convert to 0-1 range
        contrast: contrast / 100,     // Convert to 0-1 range
        saturation: saturation / 100 + 1, // Convert to 0-2 range
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Colors adjusted`);
    } catch (error) {
      console.error('❌ Color adjustment error:', error);
      alert('Color adjustment failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleBlur = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const intensity = blurAmount / 20; // Convert to 0-1 range
      const result = await eiip.applyEffect(currentImageURL, 'blur', intensity, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Blur applied: ${blurAmount}`);
    } catch (error) {
      console.error('❌ Blur error:', error);
      alert('Blur failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleGrayscale = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.applyEffect(currentImageURL, 'grayscale', 1.0, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log('✅ Grayscale applied');
    } catch (error) {
      console.error('❌ Grayscale error:', error);
      alert('Grayscale failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleInvert = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.applyEffect(currentImageURL, 'invert', 1.0, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log('✅ Invert applied');
    } catch (error) {
      console.error('❌ Invert error:', error);
      alert('Invert failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSepia = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.applyEffect(currentImageURL, 'sepia', 1.0, {
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log('✅ Sepia applied');
    } catch (error) {
      console.error('❌ Sepia error:', error);
      alert('Sepia failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleWatermark = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.addWatermark(currentImageURL, {
        text: watermarkText,
        position: 'top-left',
        fontSize: 30,
        fontFamily: 'Arial',
        color: 'rgba(255, 255, 255, 0.5)',
        quality: 0.9,
        format: 'png'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Watermark added: ${watermarkText}`);
    } catch (error) {
      console.error('❌ Watermark error:', error);
      alert('Watermark failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (!currentImageURL) return;
    setProcessing(true);
    try {
      const result = await eiip.compressImage(currentImageURL, {
        quality: compressionQuality,
        format: 'jpeg'
      });
      
      setCurrentImageURL(result.dataUrl);
      displayImageOnCanvas(result.dataUrl);
      console.log(`✅ Compressed with quality: ${compressionQuality}`);
    } catch (error) {
      console.error('❌ Compress error:', error);
      alert('Compression failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = (format) => {
    if (!canvasRef.current) return;
    try {
      const canvas = canvasRef.current;
      const mimeType = `image/${format}`;
      const dataURL = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.9 : undefined);
      const link = document.createElement('a');
      link.download = `converted-image.${format}`;
      link.href = dataURL;
      link.click();
      console.log(`✅ Converted and downloaded as ${format}`);
    } catch (error) {
      console.error('❌ Convert error:', error);
      alert('Conversion failed: ' + error.message);
    }
  };

  const handleReset = () => {
    if (!originalFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentImageURL(e.target.result);
      setCurrentImageFile(originalFile);
      displayImageOnCanvas(e.target.result);
      console.log('✅ Image reset to original');
    };
    reader.readAsDataURL(originalFile);
  };

  const renderToolPanel = () => {
    if (!selectedTool) return null;

    const panelClass = `${panelBgClass} rounded panel-border`;
    const inputClass = `w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#4a4a4a] text-white text-sm focus:outline-none focus:border-[#0078d4] transition-colors`;
    const labelClass = `block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide`;
    const btnClass = `w-full px-4 py-2.5 bg-[#0078d4] text-white rounded hover:bg-[#0066b8] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`;
    const btnSecondaryClass = `w-full px-4 py-2.5 bg-[#4a4a4a] text-white rounded hover:bg-[#5a5a5a] transition-all text-sm font-medium`;
    const sectionClass = `mb-4 pb-4 border-b border-[#4a4a4a] last:border-0`;

    switch (selectedTool) {
      case 'resize':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Image Size</h3>
            <div className="space-y-4">
              <div className={sectionClass}>
                <label className={labelClass}>Width (px)</label>
                <input type="number" value={resizeWidth} onChange={(e) => setResizeWidth(Number(e.target.value))} className={inputClass} />
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Height (px)</label>
                <input type="number" value={resizeHeight} onChange={(e) => setResizeHeight(Number(e.target.value))} className={inputClass} />
              </div>
              <button onClick={handleResize} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Apply'}
              </button>
            </div>
          </div>
        );

      case 'rotate':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Rotate Image</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleRotate(90)} className={btnSecondaryClass} disabled={processing}>90°</button>
                <button onClick={() => handleRotate(180)} className={btnSecondaryClass} disabled={processing}>180°</button>
                <button onClick={() => handleRotate(270)} className={btnSecondaryClass} disabled={processing}>270°</button>
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Custom Angle (degrees)</label>
                <input type="number" value={rotateAngle} onChange={(e) => setRotateAngle(Number(e.target.value))} className={inputClass} />
              </div>
              <button onClick={handleRotate} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Apply Custom'}
              </button>
            </div>
          </div>
        );

      case 'flip':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Flip Image</h3>
            <div className="space-y-3">
              <button onClick={() => handleFlip('horizontal')} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Flip Horizontal ↔'}
              </button>
              <button onClick={() => handleFlip('vertical')} className={btnSecondaryClass} disabled={processing}>
                {processing ? 'Processing...' : 'Flip Vertical ↕'}
              </button>
            </div>
          </div>
        );

      case 'crop':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Crop Image</h3>
            <div className="space-y-4">
              <div className={sectionClass}>
                <label className={labelClass}>X Position</label>
                <input type="number" value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className={inputClass} />
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Y Position</label>
                <input type="number" value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className={inputClass} />
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Width</label>
                <input type="number" value={cropWidth} onChange={(e) => setCropWidth(Number(e.target.value))} className={inputClass} />
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Height</label>
                <input type="number" value={cropHeight} onChange={(e) => setCropHeight(Number(e.target.value))} className={inputClass} />
              </div>
              <button onClick={handleCrop} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        );

      case 'adjust':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Adjustments</h3>
            <div className="space-y-4">
              <div className={sectionClass}>
                <label className={labelClass}>Brightness: {brightness}</label>
                <input type="range" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} min="-100" max="100" className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#0078d4]" />
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Contrast: {contrast}</label>
                <input type="range" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} min="-100" max="100" className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#0078d4]" />
              </div>
              <div className={sectionClass}>
                <label className={labelClass}>Saturation: {saturation}</label>
                <input type="range" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} min="-100" max="100" className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#0078d4]" />
              </div>
              <button onClick={handleAdjustColors} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Apply Adjustments'}
              </button>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Filter Gallery</h3>
            <div className="space-y-3">
              <button onClick={handleGrayscale} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Grayscale'}
              </button>
              <button onClick={handleSepia} className={btnSecondaryClass} disabled={processing}>
                {processing ? 'Processing...' : 'Sepia Tone'}
              </button>
              <button onClick={handleInvert} className={btnSecondaryClass} disabled={processing}>
                {processing ? 'Processing...' : 'Invert Colors'}
              </button>
            </div>
          </div>
        );

      case 'blur':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Blur</h3>
            <div className="space-y-4">
              <div className={sectionClass}>
                <label className={labelClass}>Amount: {blurAmount}</label>
                <input type="range" value={blurAmount} onChange={(e) => setBlurAmount(Number(e.target.value))} min="1" max="20" className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#0078d4]" />
              </div>
              <button onClick={handleBlur} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Apply Blur'}
              </button>
            </div>
          </div>
        );

      case 'watermark':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Text Overlay</h3>
            <div className="space-y-4">
              <div className={sectionClass}>
                <label className={labelClass}>Text Content</label>
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className={inputClass} placeholder="Enter text..." />
              </div>
              <button onClick={handleWatermark} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Add Text'}
              </button>
            </div>
          </div>
        );

      case 'compress':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Optimize Image</h3>
            <div className="space-y-4">
              <div className={sectionClass}>
                <label className={labelClass}>Quality: {(compressionQuality * 100).toFixed(0)}%</label>
                <input type="range" value={compressionQuality} onChange={(e) => setCompressionQuality(Number(e.target.value))} min="0.1" max="1" step="0.1" className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#0078d4]" />
              </div>
              <button onClick={handleCompress} className={btnClass} disabled={processing}>
                {processing ? 'Processing...' : 'Compress'}
              </button>
            </div>
          </div>
        );

      case 'convert':
        return (
          <div className={panelClass}>
            <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-[#4a4a4a] pb-2">Export As</h3>
            <div className="space-y-3">
              <button onClick={() => handleConvert('png')} className={btnClass}>PNG</button>
              <button onClick={() => handleConvert('jpeg')} className={btnSecondaryClass}>JPEG</button>
              <button onClick={() => handleConvert('webp')} className={btnSecondaryClass}>WebP</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const bgClass = theme === 'dark' ? 'bg-[#2a2a2a] text-white' : 'bg-gray-50 text-gray-900';
  const sidebarBgClass = theme === 'dark' ? 'bg-[#323232]' : 'bg-white';
  const headerBgClass = theme === 'dark' ? 'bg-[#323232] border-[#1a1a1a]' : 'bg-white border-gray-200';
  const panelBgClass = theme === 'dark' ? 'bg-[#3a3a3a]' : 'bg-white';
  const toolPanelBg = theme === 'dark' ? 'bg-[#2e2e2e]' : 'bg-gray-50';

  return (
    <div {...getRootProps()} className={`h-screen flex flex-col ${bgClass} select-none`}>
      {/* Photoshop-style Header/Menu Bar */}
      <header className={`${headerBgClass} border-b panel-border`}>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className={`p-2 rounded hover:bg-[#4a4a4a] transition-colors ${sidebarOpen ? 'bg-[#4a4a4a]' : ''}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold text-white text-sm">
                EI
              </div>
              <h1 className="text-lg font-semibold tracking-tight">
                EIIP Editor
              </h1>
            </div>
          </div>
          
          {/* Center - File menu style */}
          <div className="flex items-center space-x-1 text-sm">
            <button className="px-3 py-1 hover:bg-[#4a4a4a] rounded transition-colors">File</button>
            <button className="px-3 py-1 hover:bg-[#4a4a4a] rounded transition-colors">Edit</button>
            <button className="px-3 py-1 hover:bg-[#4a4a4a] rounded transition-colors">Image</button>
            <button className="px-3 py-1 hover:bg-[#4a4a4a] rounded transition-colors">Filter</button>
            <button className="px-3 py-1 hover:bg-[#4a4a4a] rounded transition-colors">View</button>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentImageURL && (
              <span className="px-3 py-1 bg-[#4a4a4a] text-white rounded text-xs font-mono">
                {canvasRef.current?.width || 0} × {canvasRef.current?.height || 0} px
              </span>
            )}
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded hover:bg-[#4a4a4a] transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <button 
              onClick={handleUploadClick}
              className="px-4 py-1.5 bg-[#0078d4] text-white rounded hover:bg-[#0066b8] transition-all text-sm font-medium"
            >
              {isDragActive ? '📁 Drop...' : 'Open'}
            </button>
            <input id="file-input" {...getInputProps()} style={{ display: 'none' }} />
            
            {currentImageURL && (
              <>
                <button 
                  onClick={handleReset}
                  disabled={processing}
                  className="px-4 py-1.5 bg-[#4a4a4a] text-white rounded hover:bg-[#5a5a5a] transition-all text-sm disabled:opacity-50"
                >
                  Reset
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={processing}
                  className="px-4 py-1.5 bg-[#0078d4] text-white rounded hover:bg-[#0066b8] transition-all text-sm disabled:opacity-50"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Photoshop-style Tools Panel (Left Sidebar) */}
        {sidebarOpen && (
          <aside className={`${sidebarBgClass} w-16 border-r border-[#1a1a1a] panel-border flex flex-col items-center py-3 space-y-1`}>
            {[
              { id: 'resize', icon: '↔️', label: 'Resize', shortcut: 'R' },
              { id: 'rotate', icon: '🔄', label: 'Rotate', shortcut: 'T' },
              { id: 'flip', icon: '🔃', label: 'Flip', shortcut: 'F' },
              { id: 'crop', icon: '✂️', label: 'Crop', shortcut: 'C' },
              { id: 'adjust', icon: '🎨', label: 'Adjust', shortcut: 'A' },
              { id: 'filters', icon: '✨', label: 'Filters', shortcut: 'E' },
              { id: 'blur', icon: '💫', label: 'Blur', shortcut: 'B' },
              { id: 'watermark', icon: '📝', label: 'Text', shortcut: 'W' },
              { id: 'compress', icon: '🗜️', label: 'Compress', shortcut: 'K' },
              { id: 'convert', icon: '�', label: 'Convert', shortcut: 'S' },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                className={`w-12 h-12 rounded flex flex-col items-center justify-center transition-all group relative ${
                  selectedTool === tool.id 
                    ? 'tool-active text-white' 
                    : 'hover:bg-[#4a4a4a] text-gray-300'
                }`}
                title={`${tool.label} (${tool.shortcut})`}
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="text-[9px] mt-0.5 opacity-70">{tool.shortcut}</span>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {tool.label}
                </div>
              </button>
            ))}
          </aside>
        )}

        {/* Properties/Options Panel (Right Side) */}
        {selectedTool && (
          <div className={`${toolPanelBg} w-72 border-r border-[#1a1a1a] panel-border overflow-y-auto`}>
            <div className="p-4">
              {renderToolPanel()}
            </div>
          </div>
        )}

        {/* Canvas Area with Photoshop-style Grid Background */}
        <main className="flex-1 flex items-center justify-center p-6 canvas-grid-bg relative overflow-hidden">
          {!currentImageURL ? (
            <div className="text-center z-10">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-gray-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">
                No Image Loaded
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Drag and drop an image here or click Open
              </p>
              <button 
                onClick={handleUploadClick}
                className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#0066b8] transition-all text-sm font-medium"
              >
                Choose Image
              </button>
            </div>
          ) : null}
          
          {processing && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-[#2a2a2a] rounded-lg p-8 text-center panel-border">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-[#4a4a4a] border-t-[#0078d4] rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-semibold text-gray-200">Processing Image...</p>
                <p className="text-xs text-gray-400 mt-1">Please wait</p>
              </div>
            </div>
          )}
          
          <div className={`${!currentImageURL ? 'hidden' : ''} max-w-full max-h-full flex items-center justify-center`}>
            <div className="canvas-checkerboard rounded shadow-2xl p-4 inline-block">
              <canvas ref={canvasRef} className="max-w-full max-h-full shadow-lg" style={{ maxHeight: 'calc(100vh - 200px)' }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
