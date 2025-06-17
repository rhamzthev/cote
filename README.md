# Côté

A powerful web-based code editor that integrates seamlessly with Google Drive&trade;. Côté brings professional code editing capabilities directly into your Google Drive&trade; workflow, allowing you to edit code files without leaving your browser.

## 🚀 Features

- **Google Drive&trade; Integration**: Open and edit files directly from your Google Drive&trade;
- **Professional Code Editor**: Powered by Monaco Editor (same engine as VS Code)
- **Smart File Management**: Star, organize, and manage your code files within Google Drive&trade;
- **Auto-Save**: Automatic saving and syncing with Google Drive&trade;
- **Theme Support**: Light and dark themes that respect your system preferences
- **Syntax Highlighting**: Full support for multiple programming languages
- **Code Completion**: Intelligent code suggestions and completions
- **Direct File Operations**: Rename and manage files without leaving the editor

## 🔄 Google Drive Integration

Côté integrates with Google Drive using the state parameter approach described in the [Google Drive API documentation](https://developers.google.com/workspace/drive/api/guides/enable-sdk#construct).

### State Parameter Format

When opening a file from Google Drive, the URL will include a state parameter with the following format:

```
/file?state={"ids":["FILE_ID"],"action":"open","userId":"USER_ID"}
```

This approach enables seamless integration with Google Drive's UI, allowing Côté to appear as an option in the "Open with" menu for supported file types.

### State Parameter Handling

When receiving a state parameter, Côté follows these steps:

1. Verifies that the action field has a value of "open" and the ids field is present
2. Uses the userId value to create a new session for the user or switch accounts if needed
3. Uses the files.get method to check permissions, fetch file metadata, and download content

### Required API Endpoints

The backend API must support the following endpoints for proper state parameter handling:

- `/api/auth/user` - Returns information about the currently logged-in user
- `/api/auth/logout` - Logs out the current user
- `/api/drive/files/:id` - Gets file metadata and content

## 🗺️ Roadmap

### Coming Soon
- Create new files directly from the editor
- Full-featured header menu (File, Edit, etc.)
- Profile features including account switching and sharing

### Current Roadblocks
- **OAuth & Store Listing Verification**: Currently working through Google's verification process to make Côté available directly in Google Drive&trade;.

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
