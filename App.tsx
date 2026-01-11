
import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Study, 
  StudyStatus,
  Reservation
} from './types';
import { 
  MOCK_USER_PARTICIPANT, 
  MOCK_USER_RESEARCHER, 
  MOCK_USER_ADMIN, 
  MOCK_STUDIES 
} from './constants';
import { Language, translations } from './translations';
import { userService } from './services/userService';
import Navbar from './components/Navbar';
import ParticipantDashboard from './views/ParticipantDashboard';
import ResearcherDashboard from './views/ResearcherDashboard';
import AdminDashboard from './views/AdminDashboard';
import LoginView from './views/LoginView';
import SupportView from './views/SupportView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studies, setStudies] = useState<Study[]>(MOCK_STUDIES);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<Language>('ko');
  const [isLoading, setIsLoading] = useState(true);

  const t = (key: keyof typeof translations.ko) => {
    return translations[lang][key] || translations.ko[key];
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    const savedUserId = localStorage.getItem('rh_user_id');
    const savedLang = localStorage.getItem('rh_lang') as Language;
    
    if (savedUserId) {
      await loadUserById(savedUserId);
    }
    if (savedLang) setLang(savedLang);
    
    setIsLoading(false);
  };

  const loadUserById = async (userId: string) => {
    try {
      const users = await userService.getUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
      } else {
        localStorage.removeItem('rh_user_id');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('rh_user_id');
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('rh_lang', newLang);
  };

  const handleLogin = (role: UserRole, user?: User) => {
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('rh_user_id', user.id);
    } else {
      let defaultUser: User;
      switch(role) {
        case UserRole.RESEARCHER: defaultUser = MOCK_USER_RESEARCHER; break;
        case UserRole.ADMIN: defaultUser = MOCK_USER_ADMIN; break;
        default: defaultUser = MOCK_USER_PARTICIPANT;
      }
      setCurrentUser(defaultUser);
      localStorage.setItem('rh_user_id', defaultUser.id);
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rh_user_id');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block bg-red-700 text-white p-4 rounded-2xl font-bold text-3xl mb-4 shadow-lg ring-4 ring-red-50">KHU</div>
          <p className="text-slate-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} t={t} lang={lang} onLangChange={handleLanguageChange} />;
  }

  const renderContent = () => {
    if (activeTab === 'support') {
      return <SupportView t={t} lang={lang} />;
    }

    switch(currentUser.role) {
      case UserRole.PARTICIPANT:
        return <ParticipantDashboard user={currentUser} studies={studies} t={t} lang={lang} activeTab={activeTab} reservations={reservations} setReservations={setReservations} />;
      case UserRole.RESEARCHER:
        return <ResearcherDashboard user={currentUser} studies={studies} setStudies={setStudies} t={t} activeTab={activeTab} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={currentUser} studies={studies} setStudies={setStudies} t={t} activeTab={activeTab} />;
      default:
        return <div>Role Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        t={t} 
        lang={lang}
        onLangChange={handleLanguageChange}
      />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {renderContent()}
      </main>
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 {t('brand')}. Kyung Hee University.
        </div>
      </footer>
    </div>
  );
};

export default App;
