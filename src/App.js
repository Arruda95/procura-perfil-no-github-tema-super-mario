import React, { useState } from 'react';
import './styles/global.css';
import './styles/animations.css';
import './styles/mario-theme.css'; // Adicione a importação do novo CSS
import SearchBar from './components/SearchBar';
import Profile from './components/Profile';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
import MarioBackground from './components/MarioBackground'; // Importe o novo componente
import { fetchUserProfile } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSearch = async (username) => {
    setIsLoading(true);
    setError('');
    setUser(null);
    
    try {
      const userData = await fetchUserProfile(username);
      setUser(userData);
      setNotification({
        message: `Perfil de ${userData.name || userData.login} encontrado!`,
        type: 'success'
      });
    } catch (err) {
      setError(err.message);
      setNotification(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <div className="app-container">
      {/* Adiciona o fundo do Mario */}
      <MarioBackground />
      
      <header className="app-header">
        <h1 className="app-title mario-title">Busca de Perfil no GitHub</h1>
        <p className="app-subtitle mario-subtitle">Encontre e visualize informações de usuários do GitHub</p>
      </header>
      
      <main className="app-content">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} useMarioTheme={true} />
        
        {isLoading && <LoadingSpinner />}
        
        <ErrorMessage message={error} />
        
        {!isLoading && !error && user && <Profile user={user} useMarioTheme={true} />}
        
        {notification && (
          <Notification 
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}
      </main>
      
      <footer className="app-footer mario-footer">
        <div className="mario-ground"></div>
        <p>
          <span className="mario-coin"></span> 2025 <span className="mario-coin"></span>
        </p>
        <p>
          Criado por <a href="https://github.com/Arruda95" target="_blank" rel="noopener noreferrer">
            Arruda95
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;