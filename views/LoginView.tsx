
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Language } from '../translations';

interface LoginViewProps {
  onLogin: (role: UserRole, user?: User) => void;
  t: (key: any) => string;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, t, lang, onLangChange }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.PARTICIPANT);
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    email: '',
    studentId: '',
    employeeId: '',
    position: '',
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      // Admin Check
      if (username === 'Han_kim' && password === '2025yein') {
        onLogin(UserRole.ADMIN, {
          id: 'admin-001',
          name: 'Han Kim (Admin)',
          email: 'admin@khu.ac.kr',
          role: UserRole.ADMIN,
          username: 'Han_kim'
        });
        return;
      }

      // Simple mock login for other roles
      if (username && password) {
        onLogin(role, {
          id: `mock-${Date.now()}`,
          name: username,
          email: `${username}@khu.ac.kr`,
          role: role,
          username: username
        });
      } else {
        alert('아이디와 비밀번호를 입력해주세요.');
      }
    } else {
      // Registration Flow
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: role,
        username: username,
        metadata: {
          birthdate: formData.birthdate,
          phone: formData.phone,
          studentId: role === UserRole.PARTICIPANT ? formData.studentId : undefined,
          employeeId: role === UserRole.RESEARCHER ? formData.employeeId : undefined,
          position: role === UserRole.RESEARCHER ? formData.position : undefined,
          points: role === UserRole.PARTICIPANT ? 0 : undefined
        }
      };
      
      onLogin(role, mockUser);
      alert(`${formData.name}님, 경희대학교 연구 참여 시스템 가입을 환영합니다!`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Language Toggle */}
      <div className="mb-6 flex space-x-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
        {['ko', 'en', 'zh'].map((l) => (
          <button
            key={l}
            onClick={() => onLangChange(l as Language)}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${lang === l ? 'bg-red-700 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {l === 'ko' ? '한국어' : l === 'en' ? 'EN' : '中文'}
          </button>
        ))}
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-red-700 transition-all duration-500">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-red-700 text-white p-4 rounded-2xl font-bold text-3xl mb-4 shadow-lg ring-4 ring-red-50">KHU</div>
            <h1 className="text-2xl font-bold text-slate-900">{t('brand')}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {isLoginMode ? '환영합니다! 서비스를 이용하려면 로그인하세요.' : '새로운 연구 여정을 지금 시작하세요.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${isLoginMode ? 'bg-white text-red-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              로그인
            </button>
            <button 
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${!isLoginMode ? 'bg-white text-red-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Role Selection (Only in Login or Registration) */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button 
                type="button"
                onClick={() => setRole(UserRole.PARTICIPANT)}
                className={`py-2 text-xs font-bold rounded-lg border-2 transition-all ${role === UserRole.PARTICIPANT ? 'border-red-700 bg-red-50 text-red-700' : 'border-slate-100 bg-white text-slate-400'}`}
              >
                참여자
              </button>
              <button 
                type="button"
                onClick={() => setRole(UserRole.RESEARCHER)}
                className={`py-2 text-xs font-bold rounded-lg border-2 transition-all ${role === UserRole.RESEARCHER ? 'border-red-700 bg-red-50 text-red-700' : 'border-slate-100 bg-white text-slate-400'}`}
              >
                연구자
              </button>
            </div>

            {!isLoginMode && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 ml-1">이름</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 ml-1">생년월일</label>
                    <input 
                      required
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                      value={formData.birthdate}
                      onChange={e => setFormData({...formData, birthdate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 ml-1">연락처</label>
                  <input 
                    required
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 ml-1">이메일 주소</label>
                  <input 
                    required
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {role === UserRole.PARTICIPANT ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 ml-1">학번</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                      value={formData.studentId}
                      onChange={e => setFormData({...formData, studentId: e.target.value})}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 ml-1">사번</label>
                      <input 
                        required
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                        value={formData.employeeId}
                        onChange={e => setFormData({...formData, employeeId: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 ml-1">직책</label>
                      <input 
                        required
                        type="text"
                        placeholder="예: 교수, 대학원생"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                        value={formData.position}
                        onChange={e => setFormData({...formData, position: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 ml-1">아이디</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 ml-1">비밀번호</label>
              <input 
                required
                type="password"
                className="w-full px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-red-700/20 active:scale-[0.98] mt-4"
            >
              {isLoginMode ? '로그인' : '회원가입 완료'}
            </button>
          </form>

          {isLoginMode && (
            <p className="mt-8 text-center text-xs text-slate-400">
              Kyung Hee University Research Management Platform<br/>
              <span className="mt-1 inline-block">관리자 계정 문의: admin@khu.ac.kr</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginView;
