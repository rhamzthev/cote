import { useState, useRef, useEffect } from "react";
import "./Header.css";
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
}

function Header({ filename, isStarred, onRename, onToggleStar, saveStatus }: HeaderProps) {
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
    <div className="header">
      <div className="header__left">
        <div className="header__logo">
          <a href="https://drive.google.com/drive">
            <img src="/logo.svg" alt="logo" />
          </a>
        </div>
        <div className="header__file-info">
          <div className="header__title-container">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                className="header__title-input"
              />
            ) : (
              <h1
                className="header__title-text"
                onClick={() => setIsEditing(true)}
              >
                {filename || 'Untitled'}
              </h1>
            )}
            <div className="header__star" onClick={toggleStar}>
              <img src={isStarred ? starFilled : starOutline} alt="Star" />
            </div>
            <div className={`header__save-status header__save-status--${saveStatus}`}>
              {getSaveStatusText()}
            </div>
          </div>
          {/* <div className="header__meta">
            <div className="header__menu">
              <button className="header__menu-item">File</button>
              <button className="header__menu-item">Edit</button>
              <button className="header__menu-item">View</button>
              <button className="header__menu-item">Help</button>
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="header__right">
        <button className="header__action-btn header__action-btn--share">Share</button>
        <div className="header__user-avatar">
          <img src="/user-avatar-placeholder.svg" alt="User" style={{ height: '32px', width: '32px', borderRadius: '50%' }} />
        </div>
      </div> */}
    </div>
  );
}

export default Header;
