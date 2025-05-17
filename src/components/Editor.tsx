import React from 'react';
import Editor from '@monaco-editor/react';

interface EditorProps {
  className?: string;
  value?: string;
  language?: string;
  theme?: string;
  options?: {
    readOnly?: boolean;
    [key: string]: unknown;
  };
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<EditorProps> = ({
  value,
  language = 'plaintext',
  theme = 'vs',
  className = '',
  options = {},
  onChange
}) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={theme}
        options={{
          minimap: { enabled: false },
          ...options
        }}
        onChange={(value) => onChange?.(value || '')}
      />
    </div>
  );
};

export default CodeEditor;
