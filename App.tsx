
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

  const t = (key: keyof typeof translations.ko) => {
    return translations[lang][key] || translations.ko[key];
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('rh_user');
    const savedLang = localStorage.getItem('rh_lang') as Language;
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedLang) setLang(savedLang);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('rh_lang', newLang);
  };

  const handleLogin = (role: UserRole, user?: User) => {
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('rh_user', JSON.stringify(user));
    } else {
      let defaultUser: User;
      switch(role) {
        case UserRole.RESEARCHER: defaultUser = MOCK_USER_RESEARCHER; break;
        case UserRole.ADMIN: defaultUser = MOCK_USER_ADMIN; break;
        default: defaultUser = MOCK_USER_PARTICIPANT;
      }
      setCurrentUser(defaultUser);
      localStorage.setItem('rh_user', JSON.stringify(defaultUser));
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rh_user');
  };

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
