# VOLT 

### TRY NOW -> [Visual Circuit Diagram Generator](https://gwetano.kesug.com/volt/)

VOLT is a web-based circuit diagram generator that converts textual circuit definitions into visual schematic diagrams. It provides an intuitive interface for quickly creating and exporting circuit schematics using simple ASCII-like notation.
***

## Features

- **Real-time visualization**: Live preview of circuit diagrams as you type
- **Simple syntax**: Use basic ASCII characters to define circuit components and connections
- **Component library**: Support for resistors, voltage sources, current sources, and ground symbols
- **Smart connections**: Automatic detection of connection patterns and proper component rotation
- **Export functionality**: Download generated diagrams as PNG images

***

## Supported Components

### Electronic Components
- **R**: Resistor
- **V**: Voltage Source
- **I**: Current Source
- **G**: Ground/Earth

### Connections
- **-**: Horizontal line - Horizontal electrical connection
- **|**: Vertical line - Vertical electrical connection
- **+**: Line - Depending on the position of this symbol, generators can change direction

***

## Usage

### Basic Syntax

Create circuits using a simple text-based format where each character represents a component or connection:

| Code | Output |
|----------|----------|
|```-R-``` | ![immagine](images/image_1754731454624.png) |
|```+V-``` | ![immagine](images/image_1754731621625.png) |
|```+I-``` | ![immagine](images/image_1754732146741.png) |
|```-G``` | ![immagine](images/image_1754732208270.png) |

***

### Advanced Connections

The system automatically detects complex connection patterns:
- **T-junctions**: Three-way connections
- **Cross-junctions**: Four-way connections
- **Corners**: Automatic corner detection for L-shaped connections

***

## Getting Started

1. **Open VOLT** in your web browser
2. **Write your circuit** in the left editor panel using the supported syntax
3. **Click Generate** to render the visual diagram
4. **Export** your diagram as a PNG file if needed


> Note: Due to CORS restrictions, the application must be served through a web server rather than opened directly as a file.

***

## Contributing

To contribute to VOLT:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request


## License

This project is released under the MIT License.

***

VOLT 2025