# EIIP Image Editor Web Application

A professional, Photoshop-style web-based image editor built with React.js and powered by the EIIP (Elidia Technology Pvt Ltd Image Processing) library.

## ✨ Key Features

### 🎨 13 Comprehensive Image Editing Tools
1. **Resize** - Change image dimensions
2. **Scale** - Proportional scaling (0.1x to 3.0x)
3. **Rotate** - 90°, 180°, 270°, or custom angles
4. **Flip** - Horizontal or vertical mirroring
5. **Crop** - **Interactive drag-to-select with visual feedback** 🖱️
6. **Adjust** - Brightness, contrast, saturation controls
7. **Filters** - Grayscale, sepia, invert, vintage, warm, cool, sharpen
8. **Blur** - Gaussian blur with adjustable intensity
9. **Add Text** - Custom text overlays with position, size, color
10. **Watermark** - Semi-transparent copyright protection
11. **Optimize** - Smart compression and thumbnail generation
12. **Compress** - Quality control (10%-100%)
13. **Convert** - Export as PNG, JPEG, or WebP

### 🖱️ Interactive Crop Tool
- **Click and drag** on the image to select crop area
- **Visual selection** with blue handles and semi-transparent overlay
- **Real-time preview** of crop boundaries
- Manual fine-tuning with X, Y, width, height inputs
- Easy-to-use like any professional image editor

### 🎨 Photoshop-Style UI
- Professional dark theme with 20×20px grid background
- Vertical tools panel with keyboard shortcuts
- Context-sensitive properties panel
- Fullscreen canvas editor with checkerboard pattern
- Menu bar (File, Edit, Image, Filter, View)
- Drag-and-drop image upload
- Real-time image dimensions display

### ⌨️ Keyboard Shortcuts
- **R** - Resize, **X** - Scale, **T** - Rotate, **F** - Flip
- **C** - Crop, **A** - Adjust, **E** - Filters, **B** - Blur
- **W** - Watermark, **O** - Optimize, **K** - Compress, **S** - Convert

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation & Running

1. **Clone the repository**
   ```sh
   git clone git@github.com:SaleemLww/EIIP_EDIT.git
   cd EIIP_EDIT
   ```

2. **Install dependencies for both frontend and backend**
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start the backend server**
   ```sh
   cd backend && npm start
   ```
   Backend runs on `http://localhost:5001`
   
4. **Start the frontend app** (in a new terminal)
   ```sh
   cd frontend && npm start
   ```
   Frontend runs on `http://localhost:4000`
   
5. **Open the app**
   ```
   Navigate to http://localhost:4000 in your browser
   ```

## 📖 Detailed Documentation

See [FEATURES.md](./FEATURES.md) for comprehensive documentation including:
- Detailed tool descriptions
- Interactive crop tool guide
- EIIP methods reference
- Common workflows
- Tips & best practices
- Technical implementation details

## 🎯 Usage Examples

### Basic Workflow
1. Click **Open** or drag-and-drop an image
2. Select a tool from the left toolbar (or use keyboard shortcuts)
3. Adjust parameters in the properties panel
4. Click **Apply** to process the image
5. Click **Save** to download the result

### Interactive Crop Example
1. Click **Crop** tool (✂️) or press `C`
2. Click and drag on the image to select the area
3. See the blue selection rectangle with corner handles
4. Fine-tune with X, Y, Width, Height inputs if needed
5. Click **Apply Crop**

## 🛠️ Project Structure

```
EIIP_EDIT/
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/
│   │   │   └── Editor.js  # Main editor component
│   │   ├── index.css      # Photoshop-style CSS
│   │   └── App.js
│   ├── package.json
│   └── public/
├── backend/               # Node.js/Express.js API
│   ├── server.js
│   └── package.json
├── FEATURES.md            # Complete feature documentation
├── IMPLEMENTATION.md      # Technical implementation details
├── UI-DESIGN.md          # UI/UX design specifications
└── README.md             # This file
```

## 🎨 Tech Stack

**Frontend**:
- React.js 18.2.0
- EIIP library v1.2.0 (Elidia Technology Pvt Ltd Image Processing)
- Tailwind CSS v3.4.1
- react-dropzone for file uploads
- HTML5 Canvas API

**Backend**:
- Node.js
- Express.js v4.18.2
- CORS enabled for development

## 🔧 Development

## 🔧 Development

- Backend runs on port **5001** by default
- Frontend (React) runs on port **4000** with hot-reload
- Frontend proxies API requests to the backend
- All image processing happens client-side using EIIP
- State management with React hooks

### Available Scripts

**Frontend**:
```sh
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

**Backend**:
```sh
npm start          # Start Express server
```

## 🌟 EIIP Library

This editor is powered by the **EIIP** (Elidia Technology Pvt Ltd Image Processing) library:
- **Version**: 1.2.0
- **npm**: [eiip](https://www.npmjs.com/package/eiip)
- **Author**: Saleem Ahmad (Elidia Technology Pvt Ltd)
- **License**: MIT

### EIIP Features Used
- Image resizing and scaling
- Rotation and flipping
- Cropping with coordinates
- Color adjustments (brightness, contrast, saturation)
- Effects (blur, sharpen, grayscale, sepia, invert, vintage, warm, cool)
- Text overlay and watermarking
- Image optimization and compression
- Format conversion (PNG, JPEG, WebP)

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires: JavaScript enabled, HTML5 Canvas support, modern ES6+ features

## 🎓 Learning Resources

### For Beginners
1. Open the app and upload an image
2. Try each tool one by one
3. Experiment with different parameters
4. Use keyboard shortcuts for faster workflow
5. Read [FEATURES.md](./FEATURES.md) for detailed guides

### For Developers
- Study `frontend/src/components/Editor.js` for EIIP integration
- See `frontend/src/index.css` for Photoshop-style UI
- Check [IMPLEMENTATION.md](./IMPLEMENTATION.md) for technical details
- Explore [UI-DESIGN.md](./UI-DESIGN.md) for design specifications

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style
- All tools are properly tested
- Documentation is updated
- Commit messages are clear

## 📝 Future Enhancements

Planned features for future versions:
- Layer system with blending modes
- History panel with undo/redo
- Batch processing multiple images
- Custom filter presets
- Advanced crop with aspect ratio lock
- Drawing tools (brush, pen, shapes)
- Zoom and pan controls
- Cloud save functionality

## 📄 License

MIT License

Copyright (c) 2025 Saleem Ahmad (Elidia Technology Pvt Ltd)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📞 Support & Contact

- **GitHub Issues**: [EIIP_EDIT/issues](https://github.com/SaleemLww/EIIP_EDIT/issues)
- **EIIP npm**: [npmjs.com/package/eiip](https://www.npmjs.com/package/eiip)
- **Repository**: [github.com/SaleemLww/EIIP_EDIT](https://github.com/SaleemLww/EIIP_EDIT)

---

**Made with ❤️ using EIIP by Saleem Ahmad (Elidia Technology Pvt Ltd)**

**Last Updated**: October 12, 2025 | **Version**: 1.0.0


## License
MIT
