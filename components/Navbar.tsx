
import React from 'react';
import { User, UserRole } from '../types';
import { Language } from '../translations';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  t: (key: any) => string;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, activeTab, setActiveTab, t, lang, onLangChange }) => {
  const getSecondaryTabName = () => {
    if (user.role === UserRole.PARTICIPANT) return 'available';
    if (user.role === UserRole.RESEARCHER) return 'my-studies';
    return 'logs';
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-red-700 text-white p-2 rounded-lg font-bold">KHU</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">ResearchHub</span>
        </div>

        <div className="hidden lg:flex space-x-6 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`${activeTab === 'dashboard' ? 'text-red-700 font-bold border-b-2 border-red-700' : 'text-slate-600 hover:text-red-700'} h-16 transition-colors`}
          >
            {t('dashboard')}
          </button>
          <button 
            onClick={() => setActiveTab(getSecondaryTabName())}
            className={`${activeTab === getSecondaryTabName() ? 'text-red-700 font-bold border-b-2 border-red-700' : 'text-slate-600 hover:text-red-700'} h-16 transition-colors`}
          >
            {user.role === UserRole.PARTICIPANT ? t('availableStudies') : user.role === UserRole.RESEARCHER ? t('myStudies') : t('systemLogs')}
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`${activeTab === 'support' ? 'text-red-700 font-bold border-b-2 border-red-700' : 'text-slate-600 hover:text-red-700'} h-16 transition-colors`}
          >
            {t('support')}
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <select 
            value={lang} 
            onChange={(e) => onLangChange(e.target.value as Language)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-red-700 outline-none"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
          </div>
          
          <button 
            onClick={onLogout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm transition-colors font-medium"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
