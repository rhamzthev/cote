import { useEffect, useState, useCallback, useRef } from "react";
import CodeEditor from "./Editor";
import styles from "./File.module.css";
import Header from "./Header";
import { useLocation } from "react-router";
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

// State parameter interface
interface StateParam {
  ids: string[];
  action: string;
  userId: string;
  exportIds?: string[];
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
  const [fileId, setFileId] = useState<string>('');
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Refs
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasInitializedRef = useRef(false);

  // Hooks
  const location = useLocation();
  const { 
    getFile, 
    updateFileContent, 
    updateFilename, 
    toggleFileStar, 
    isAuthorized,
    currentUser,
    initiateAuth, 
    logout
  } = useGoogleDrive();
  const editorTheme = useColorScheme();

  // Parse state parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stateParam = searchParams.get('state');
    
    if (stateParam) {
      try {
        const state = JSON.parse(stateParam) as StateParam;
        
        // Step 1: Verify action is "open" and ids field is present
        if (state.action !== 'open' || !state.ids || state.ids.length === 0) {
          setError({
            title: 'Invalid File Request',
            message: 'The state parameter contains invalid action or missing file IDs.',
            details: `Expected action "open" but got "${state.action}". File IDs ${state.ids ? 'present' : 'missing'}.`
          });
          return;
        }

        // Set file ID
        setFileId(state.ids[0]);
        setIsLocalMode(false);
        
        // Step 2: Handle userId for session management
        if (state.userId) {
          setUserId(state.userId);
          // Handle user session (will be implemented in useEffect below)
        }
        
      } catch (error) {
        console.error('Error parsing state parameter:', error);
        setError({
          title: 'Invalid State Parameter',
          message: 'Could not parse the state parameter from the URL.',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
    } else {
      // No state parameter - enable local mode
      setIsLocalMode(true);
      console.log('Local mode enabled - no Google Drive integration');
    }
  }, [location.search]);

  // Handle user session based on userId
  useEffect(() => {
    // This feature is not fully implemented yet.
    // The purpose is to ensure the signed-in user matches the userId in the URL.
    if (isLocalMode || !userId) return;
  }, [userId, isLocalMode, logout, initiateAuth]);

  // File fetching logic
  useEffect(() => {
    const fetchFile = async () => {
      if (!fileId) return;
      
      try {
        console.log('Fetching file with ID:', fileId);
        const file = await getFile(fileId);
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

    if (isAuthorized && fileId && !hasInitializedRef.current && !isLocalMode) {
      fetchFile();
    }
  }, [getFile, fileId, isAuthorized, isLocalMode]);

  // Content change handler
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    if (!isLocalMode) {
      setSaveStatus('saving');
    }
  }, [isLocalMode]);

  // Auto-save logic with debouncing
  useEffect(() => {
    if (isLocalMode || !hasInitializedRef.current || !fileId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateFileContent(fileId, content);
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
  }, [content, fileId, updateFileContent, isLocalMode]);

  // File operations
  const handleRename = async (newFilename: string) => {
    setFilename(newFilename);
    
    if (!isLocalMode && fileId) {
      try {
        const { name } = await updateFilename(fileId, newFilename);
        setFilename(name);
      } catch (error) {
        console.error('Error updating filename:', error);
      }
    }
  };

  const handleStar = async () => {
    if (isLocalMode) {
      setIsStarred(!isStarred); // Just toggle locally
      return;
    }
    
    if (fileId) {
      try {
        const starred = await toggleFileStar(fileId, !isStarred);
        setIsStarred(starred);
      } catch (error) {
        console.error('Error toggling star:', error);
      }
    }
  };

  // Helper functions
  const getLanguage = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return LANGUAGE_MAP[extension || ''] || 'plaintext';
  };

  // Render
  return (
    <div className={styles.container}>
      {!isLocalMode && !isAuthorized && <AuthPopup onAuth={initiateAuth} />}
      {(isAuthorized || isLocalMode) && (
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
              onStar={handleStar}
              saveStatus={isLocalMode ? 'saved' : saveStatus}
              isLocalMode={isLocalMode}
              isAuthorized={isAuthorized}
              currentUser={currentUser}
              onInitiateAuth={() => initiateAuth()}
              onLogout={logout}
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
