import { useEffect, useState, useCallback, useRef } from "react";
import CodeEditor from "./Editor";
import styles from "./File.module.css";
import Header from "./Header";
import { useParams } from "react-router";
import { useGoogleDrive } from "../hooks/useGoogleDrive";
import AuthPopup from "./AuthPopup";
import ErrorScreen from "./ErrorScreen";
import { useColorScheme } from "../hooks/useColorScheme";

// Types
type SaveStatus = 'saved' | 'saving' | 'error';
type FileError = {
  title: string;
  message: string;
  details?: string;
} | null;

interface FileProps {
  initialContent?: string;
  initialFilename?: string;
}

// Language mapping for syntax highlighting
const LANGUAGE_MAP: Record<string, string> = {
  // Common extensions
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'html': 'html',
  'css': 'css',
  'md': 'markdown',
  'json': 'json',
  'xml': 'xml',
  'txt': 'plaintext',
  'abap': 'abap',
  'apex': 'apex',
  'azcli': 'azcli',
  'bat': 'bat',
  'bicep': 'bicep',
  'cml': 'cameligo',
  'clj': 'clojure',
  'coffee': 'coffeescript',
  'cs': 'csharp',
  'csp': 'csp',
  'cypher': 'cypher',
  'dart': 'dart',
  'dockerfile': 'dockerfile',
  'ecl': 'ecl',
  'ex': 'elixir',
  'flow': 'flow9',
  'fs': 'fsharp',
  'ftl': 'freemarker2',
  'go': 'go',
  'graphql': 'graphql',
  'hbs': 'handlebars',
  'hcl': 'hcl',
  'ini': 'ini',
  'jl': 'julia',
  'kt': 'kotlin',
  'less': 'less',
  'lexon': 'lexon',
  'lua': 'lua',
  'liquid': 'liquid',
  'm3': 'm3',
  'mdx': 'mdx',
  'mips': 'mips',
  'msdax': 'msdax',
  'mysql': 'mysql',
  'm': 'objective-c',
  'pas': 'pascal',
  'ligo': 'pascaligo',
  'pl': 'perl',
  'pgsql': 'pgsql',
  'php': 'php',
  'pla': 'pla',
  'pts': 'postiats',
  'pq': 'powerquery',
  'ps1': 'powershell',
  'proto': 'proto',
  'pug': 'pug',
  'r': 'r',
  'razor': 'razor',
  'redis': 'redis',
  'redshift': 'redshift',
  'rst': 'restructuredtext',
  'rb': 'ruby',
  'rs': 'rust',
  'sb': 'sb',
  'scala': 'scala',
  'scm': 'scheme',
  'scss': 'scss',
  'sh': 'shell',
  'sol': 'sol',
  'aes': 'aes',
  'sparql': 'sparql',
  'sql': 'sql',
  'st': 'st',
  'swift': 'swift',
  'sv': 'systemverilog',
  'v': 'verilog',
  'tcl': 'tcl',
  'twig': 'twig',
  'typespec': 'typespec',
  'vb': 'vb',
  'wgsl': 'wgsl',
  'yaml': 'yaml',
  'yml': 'yaml'
};

function File({ initialContent = '', initialFilename = 'Untitled file' }: FileProps) {
  // State
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState(initialFilename);
  const [isStarred, setIsStarred] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [error, setError] = useState<FileError>(null);

  // Refs
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasInitializedRef = useRef(false);

  // Hooks
  const { id } = useParams();
  const { getFile, updateFileContent, updateFilename, toggleFileStar, isAuthorized } = useGoogleDrive();
  const editorTheme = useColorScheme();

  // File fetching logic
  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log('Fetching file with ID:', id);
        const file = await getFile(id || '');
        console.log('Received file data:', file);
        setContent(file.content);
        setFilename(file.filename);
        setIsStarred(file.starred);
        hasInitializedRef.current = true;
      } catch (error) {
        console.error('Error fetching file:', error);
        setError({
          title: 'Error Loading File',
          message: 'There was a problem loading this file.',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    };

    if (isAuthorized && !hasInitializedRef.current) {
      fetchFile();
    }
  }, [getFile, id, isAuthorized]);

  // Content change handler
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setSaveStatus('saving');
  }, []);

  // Auto-save logic with debouncing
  useEffect(() => {
    if (!hasInitializedRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateFileContent(id || '', content);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
        console.error('Failed to save file:', error);
      }
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, id, updateFileContent]);

  // File operations
  const handleRename = async (newFilename: string) => {
    const { name } = await updateFilename(id || '', newFilename);
    setFilename(name);
  };

  const handleStar = async () => {
    const starred = await toggleFileStar(id || '');
    setIsStarred(starred);
  };

  // Helper functions
  const getLanguage = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return LANGUAGE_MAP[extension || ''] || 'plaintext';
  };

  // Render
  return (
    <div className={styles.container}>
      <AuthPopup isOpen={!isAuthorized} />
      {isAuthorized && (
        error ? (
          <ErrorScreen
            title={error.title}
            message={error.message}
            details={error.details}
          />
        ) : (
          <>
            <Header 
              filename={filename}
              isStarred={isStarred}
              onRename={handleRename}
              onToggleStar={handleStar}
              saveStatus={saveStatus}
              fileId={id || ''}
            />
            <CodeEditor
              className={styles.editor}
              value={content}
              language={getLanguage(filename)}
              theme={editorTheme}
              options={{ readOnly: false }}
              onChange={handleContentChange}
            />
          </>
        )
      )}
    </div>
  );
}

export default File;
