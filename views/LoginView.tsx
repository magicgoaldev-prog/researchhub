
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Language } from '../translations';
import { userService } from '../services/userService';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    email: '',
    studentId: '',
    employeeId: '',
    position: '',
  });

  const checkUsername = async () => {
    if (!username) {
      alert('아이디를 입력해주세요.');
      return;
    }
    
    const exists = await userService.usernameExists(username);
    if (exists) {
      alert('이미 사용중인 아이디입니다.');
      setUsernameChecked(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setUsernameChecked(true);
    }
  };

  const sendEmailVerification = () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert(`인증코드가 발송되었습니다: ${code}`);
  };

  const verifyEmail = () => {
    if (verificationCode === sentCode) {
      setEmailVerified(true);
      alert('이메일 인증이 완료되었습니다.');
    } else {
      alert('인증코드가 일치하지 않습니다.');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      // Check against mock users database
      const foundUser = await userService.findUser(username, password);
      if (foundUser) {
        onLogin(foundUser.role as UserRole, foundUser);
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {
      // Registration Flow - Validation
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      if (!usernameChecked) {
        alert('아이디 중복확인을 해주세요.');
        return;
      }
      
      if (!emailVerified) {
        alert('이메일 인증을 완료해주세요.');
        return;
      }

      const newUser: User & { password: string } = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: role,
        username: username,
        password: password,
        metadata: {
          birthdate: formData.birthdate,
          phone: formData.phone,
          studentId: role === UserRole.PARTICIPANT ? formData.studentId : undefined,
          employeeId: role === UserRole.RESEARCHER ? formData.employeeId : undefined,
          position: role === UserRole.RESEARCHER ? formData.position : undefined,
          points: role === UserRole.PARTICIPANT ? 0 : undefined
        }
      };
      
      if (await userService.addUser(newUser)) {
        onLogin(role, newUser);
        alert(`${formData.name}님, 경희대학교 연구 참여 시스템 가입을 환영합니다!`);
      } else {
        alert('회원가입에 실패했습니다.');
      }
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
                  <div className="flex gap-2">
                    <input 
                      required
                      type="email"
                      className="flex-1 px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                      value={formData.email}
                      onChange={e => {
                        setFormData({...formData, email: e.target.value});
                        setEmailVerified(false);
                      }}
                    />
                    <button 
                      type="button"
                      onClick={sendEmailVerification}
                      className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      인증발송
                    </button>
                  </div>
                  {sentCode && (
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="text"
                        placeholder="인증코드 6자리"
                        className="flex-1 px-4 py-2 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={verifyEmail}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                          emailVerified ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {emailVerified ? '인증완료' : '인증확인'}
                      </button>
                    </div>
                  )}
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
              <div className="flex gap-2">
                <input 
                  required
                  type="text"
                  className="flex-1 px-4 py-3 bg-slate-50 border-transparent border-2 focus:border-red-700 rounded-xl outline-none transition-all text-sm"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    setUsernameChecked(false);
                  }}
                />
                {!isLoginMode && (
                  <button 
                    type="button"
                    onClick={checkUsername}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                      usernameChecked ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {usernameChecked ? '확인완료' : '중복확인'}
                  </button>
                )}
              </div>
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

            {!isLoginMode && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 ml-1">비밀번호 확인</label>
                <input 
                  required
                  type="password"
                  className={`w-full px-4 py-3 bg-slate-50 border-transparent border-2 rounded-xl outline-none transition-all text-sm ${
                    password && confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'focus:border-red-700'
                  }`}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs ml-1">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
            )}

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
