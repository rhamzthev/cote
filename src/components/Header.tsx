import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import starOutline from "/star_outline.svg";
import starFilled from "/star_filled.svg";

type SaveStatus = 'saved' | 'saving' | 'error';

interface HeaderProps {
  filename: string;
  fileId: string;
  isStarred: boolean;
  onRename: (newFilename: string) => Promise<void>;
  onToggleStar: () => Promise<void>;
  saveStatus: SaveStatus;
  isLocalMode?: boolean;
}

function Header({ filename, isStarred, onRename, onToggleStar, saveStatus, isLocalMode = false }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(filename);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when filename changes
  useEffect(() => {
    setInputValue(filename);
  }, [filename]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    if (inputValue !== filename) {
      try {
        await onRename(inputValue);
      } catch (error) {
        console.error('Failed to rename file:', error);
        setInputValue(filename); // Reset to original name on error
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setInputValue(filename);
      setIsEditing(false);
    }
  };

  const toggleStar = () => {
    onToggleStar();
  };

  const getSaveStatusText = () => {
    if (isLocalMode) {
      return 'LOCAL MODE';
    }
    
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved to Drive';
      case 'error':
        return 'Error saving';
      default:
        return '';
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <a href="/">
            <img src="/logo.svg" alt="logo" />
          </a>
        </div>
        <div className={styles.fileInfo}>
          <div className={styles.titleContainer}>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                className={styles.titleInput}
              />
            ) : (
              <h1
                className={styles.titleText}
                onClick={() => setIsEditing(true)}
              >
                {filename || 'Untitled'}
              </h1>
            )}
            <div className={styles.star} onClick={toggleStar}>
              <img src={isStarred ? starFilled : starOutline} alt="Star" />
            </div>
            <div className={`${styles.saveStatus} ${isLocalMode ? styles.saveStatusLocal : styles[`saveStatus${saveStatus.charAt(0).toUpperCase() + saveStatus.slice(1)}`]}`}>
              {getSaveStatusText()}
            </div>
          </div>
          {/* <div className={styles.meta}>
            <div className={styles.menu}>
              <button className={styles.menuItem}>File</button>
              <button className={styles.menuItem}>Edit</button>
              <button className={styles.menuItem}>View</button>
              <button className={styles.menuItem}>Help</button>
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className={styles.right}>
        <button className={`${styles.actionBtn} ${styles.actionBtnShare}`}>Share</button>
        <div className={styles.userAvatar}>
          <img src="/user-avatar-placeholder.svg" alt="User" style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
        </div>
      </div> */}
    </div>
  );
}

export default Header;
