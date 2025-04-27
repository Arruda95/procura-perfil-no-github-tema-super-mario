import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { searchUsers } from '../services/api';
import UserSuggestions from './UserSuggestions';
import '../styles/search-bar.css';
// No need to import mario-theme.css as it's already imported in App.js

const SearchBar = ({ onSearch, isLoading, useMarioTheme = false }) => {
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Detect clicks outside the component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for suggestions when user types
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (username.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Add debounce to avoid excessive requests
    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(username);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounceTimerRef.current);
    };
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username);
      setShowSuggestions(false);
    }
  };

  const handleSelectUser = (selectedUsername) => {
    setUsername(selectedUsername);
    onSearch(selectedUsername);
    setShowSuggestions(false);
  };

  const clearInput = () => {
    setUsername('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Apply Mario theme classes if enabled
  const inputWrapperClasses = `search-input-wrapper ${hasFocus ? 'focused' : ''} ${isSearching ? 'searching' : ''} ${useMarioTheme ? 'mario-input-wrapper' : ''}`;
  
  const buttonClasses = `search-submit-button ${isLoading ? 'loading' : ''} ${useMarioTheme ? 'mario-button' : ''}`;
  
  return (
    <div ref={searchContainerRef} className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className={inputWrapperClasses}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => {
              setHasFocus(true);
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setHasFocus(false)}
            placeholder="Digite o nome do usuário GitHub"
            className={`search-input ${useMarioTheme ? 'mario-input' : ''}`}
            aria-label="Nome de usuário GitHub"
            autoComplete="off"
          />
          {isSearching && (
            <div className="mini-loader" />
          )}
          {username && !isSearching && (
            <button 
              type="button" 
              className="clear-button"
              onClick={clearInput}
              aria-label="Limpar campo de busca"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className={buttonClasses}
          disabled={!username.trim() || isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      
      <UserSuggestions 
        suggestions={suggestions} 
        onSelectUser={handleSelectUser} 
        visible={showSuggestions}
        useMarioTheme={useMarioTheme}
      />
    </div>
  );
};

export default SearchBar;