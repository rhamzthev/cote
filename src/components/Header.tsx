import { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import starOutline from "/star_outline.svg";
import starFilled from "/star_filled.svg";
import type { GoogleUser } from "../hooks/useGoogleDrive";

type SaveStatus = 'saved' | 'saving' | 'error';

interface HeaderProps {
  filename: string;
  isStarred: boolean;
  onRename: (newFilename: string) => void;
  onStar: () => void;
  saveStatus: SaveStatus;
  isLocalMode: boolean;
  isAuthorized: boolean;
  currentUser: GoogleUser | null;
  onInitiateAuth: () => void;
  onLogout: () => void;
}

function Header({ 
  filename, 
  isStarred, 
  onRename, 
  onStar, 
  saveStatus, 
  isLocalMode,
  isAuthorized,
  currentUser,
  onInitiateAuth,
  onLogout
}: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(filename);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

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

  const getSaveStatusText = () => {
    if (isLocalMode) {
      return 'Local Mode';
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
            <div className={styles.star} onClick={onStar}>
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
      <div className={styles.right}>
        {isAuthorized && currentUser ? (
          <div className={styles.profileContainer} ref={profileMenuRef}>
            <img
              src={currentUser.picture}
              alt="Profile"
              className={styles.profilePicture}
              onClick={() => setShowProfileMenu(prev => !prev)}
            />
            {showProfileMenu && (
              <div className={styles.profileMenu}>
                <div className={styles.profileMenuHeader}>
                  <span className={styles.profileMenuEmail}>{currentUser.email}</span>
                  <button onClick={() => setShowProfileMenu(false)} className={styles.closeButton}>&times;</button>
                </div>
                <div className={styles.profileInfo}>
                  <img src={currentUser.picture} alt="Profile" className={styles.profileMenuPicture} />
                  <div className={styles.profileMenuName}>Hi, {currentUser.name?.split(' ')[0]}!</div>
                </div>
                <div className={styles.profileMenuActions}>
                  <button className={`${styles.actionBtn} ${styles.signOutButton}`} onClick={onLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className={`${styles.actionBtn} ${styles.actionBtnShare}`} onClick={onInitiateAuth}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
