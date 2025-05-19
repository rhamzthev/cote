# Côté

A powerful web-based code editor that integrates seamlessly with Google Drive. Côté brings professional code editing capabilities directly into your Google Drive workflow, allowing you to edit code files without leaving your browser.

## 🚀 Features

- **Google Drive Integration**: Open and edit files directly from your Google Drive
- **Professional Code Editor**: Powered by Monaco Editor (same engine as VS Code)
- **Smart File Management**: Star, organize, and manage your code files within Google Drive
- **Auto-Save**: Automatic saving and syncing with Google Drive
- **Theme Support**: Light and dark themes that respect your system preferences
- **Syntax Highlighting**: Full support for multiple programming languages
- **Code Completion**: Intelligent code suggestions and completions
- **Direct File Operations**: Rename and manage files without leaving the editor

## 🗺️ Roadmap

### Coming Soon
- Create new files directly from the editor
- Full-featured header menu (File, Edit, etc.)
- Profile features including account switching and sharing

### Current Roadblocks
- **OAuth & Store Listing Verification**: Currently working through Google's verification process to make Côté available directly in Google Drive.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerized development)
- [Docker Compose](https://docs.docker.com/compose/) (optional, for containerized development)

## 🛠️ Development Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cote.git
   cd cote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

### Docker Development

1. Build and start the containers:
   ```bash
   docker compose up --build
   ```
   The application will be available at http://localhost:5173

## 🏗️ Building for Production

### Local Build

```bash
npm run build
```

### Docker Build

```bash
docker build -t cote .
```

For cross-platform builds (e.g., building for amd64 on an M1 Mac):
```bash
docker build --platform=linux/amd64 -t cote .
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🏗️ Project Structure

```
cote/
├── src/              # Source files
├── public/           # Static assets
├── nginx/           # Nginx configuration
├── .github/         # GitHub configuration
├── Dockerfile       # Docker configuration
├── compose.yaml     # Docker Compose configuration
└── ...config files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the terms of the license included in the repository.

## 🔗 References

- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
