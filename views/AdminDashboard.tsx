
import React, { useState } from 'react';
import { User, Study, StudyStatus, UserRole } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_USER_PARTICIPANT, MOCK_USER_RESEARCHER } from '../constants';

interface AdminDashboardProps {
  user: User;
  studies: Study[];
  setStudies: React.Dispatch<React.SetStateAction<Study[]>>;
  t: (key: any) => string;
  activeTab: string;
}

const data = [
  { name: '1', participation: 400 },
  { name: '2', participation: 600 },
  { name: '3', participation: 550 },
  { name: '4', participation: 900 },
  { name: '5', participation: 1200 },
  { name: '6', participation: 1400 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ studies, setStudies, t, activeTab }) => {
  const [viewMode, setViewMode] = useState<'stats' | 'users'>('stats');
  const [selectedReviewStudy, setSelectedReviewStudy] = useState<Study | null>(null);
  const [showAllPending, setShowAllPending] = useState(false);

  const pendingStudies = studies.filter(s => s.status === StudyStatus.PENDING);
  const users: User[] = [
    MOCK_USER_PARTICIPANT, 
    MOCK_USER_RESEARCHER, 
    { id: 'u3', name: '이영희', email: 'yh.lee@khu.ac.kr', role: UserRole.PARTICIPANT },
    { id: 'u4', name: '장동건', email: 'dg.jang@khu.ac.kr', role: UserRole.RESEARCHER },
    { id: 'u5', name: '전지현', email: 'jh.jeon@khu.ac.kr', role: UserRole.PARTICIPANT }
  ];

  const handleApprove = (id: string) => {
    setStudies(studies.map(s => s.id === id ? { ...s, status: StudyStatus.ACTIVE } : s));
    setSelectedReviewStudy(null);
  };

  const handleReject = (id: string) => {
    setStudies(studies.map(s => s.id === id ? { ...s, status: StudyStatus.DRAFT } : s));
    setSelectedReviewStudy(null);
  };

  const handleManageUser = (name: string) => {
    alert(`${name} 사용자의 권한 설정을 엽니다.`);
  };

  const handleRestrictUser = (name: string) => {
    if (confirm(`${name} 사용자의 활동을 일시적으로 제한하시겠습니까?`)) {
      alert(`${name} 사용자 제한이 설정되었습니다.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('systemOverview')}</h1>
          <p className="text-slate-500">경희대학교 연구 관리 시스템 (Admin Portal)</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border">
           <button 
             onClick={() => setViewMode('stats')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'stats' ? 'bg-red-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             Statistics
           </button>
           <button 
             onClick={() => setViewMode('users')}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'users' ? 'bg-red-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             Users
           </button>
        </div>
      </div>

      {viewMode === 'stats' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Studies', value: studies.filter(s => s.status === 'ACTIVE').length, color: 'text-red-700' },
              { label: 'Total Participants', value: '2,401', color: 'text-emerald-600' },
              { label: 'Avg. Attendance', value: '92%', color: 'text-amber-600' },
              { label: 'Credits Issued', value: '10.5k', color: 'text-indigo-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6">{t('participationTrends')}</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorParticip" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#b91c1c', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="participation" stroke="#b91c1c" strokeWidth={3} fillOpacity={1} fill="url(#colorParticip)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-6">{t('pendingApprovals')}</h2>
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px]">
                {pendingStudies.length > 0 ? (
                  pendingStudies.map(study => (
                    <div key={study.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-slate-800 text-sm truncate">{study.title}</p>
                        <p className="text-xs text-slate-500">by {study.researcherName}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedReviewStudy(study)}
                        className="bg-red-700 hover:bg-red-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        Review
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 py-8">
                    <p className="text-sm">승인 대기중인 연구가 없습니다.</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowAllPending(true)}
                className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-colors"
              >
                모든 대기 목록 보기
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b">
               <tr>
                 <th className="px-6 py-4 font-bold text-slate-600">사용자 이름</th>
                 <th className="px-6 py-4 font-bold text-slate-600">이메일</th>
                 <th className="px-6 py-4 font-bold text-slate-600">역할</th>
                 <th className="px-6 py-4 font-bold text-slate-600">관리</th>
               </tr>
             </thead>
             <tbody className="divide-y">
               {users.map(u => (
                 <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                   <td className="px-6 py-4 font-semibold text-slate-900">{u.name}</td>
                   <td className="px-6 py-4 text-slate-500">{u.email}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === UserRole.ADMIN ? 'bg-slate-800 text-white' : u.role === UserRole.RESEARCHER ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                       {u.role}
                     </span>
                   </td>
                   <td className="px-6 py-4 flex gap-2">
                     <button onClick={() => handleManageUser(u.name)} className="text-indigo-600 hover:underline font-medium">관리</button>
                     <button onClick={() => handleRestrictUser(u.name)} className="text-red-600 hover:underline font-medium">제한</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedReviewStudy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">연구 계획 검토</h2>
                <div className="space-y-4">
                   <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">제목</p>
                      <p className="font-bold text-slate-800">{selectedReviewStudy.title}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">설명</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{selectedReviewStudy.description}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-slate-500 mb-1">연구자</p>
                        <p className="font-bold">{selectedReviewStudy.researcherName}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <p className="text-slate-500 mb-1">보상</p>
                        <p className="font-bold">{selectedReviewStudy.rewardPoints} Pts</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     onClick={() => handleReject(selectedReviewStudy.id)}
                     className="flex-1 px-6 py-3 border border-red-200 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-colors"
                   >
                     반려
                   </button>
                   <button 
                     onClick={() => handleApprove(selectedReviewStudy.id)}
                     className="flex-1 px-6 py-3 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 transition-colors shadow-lg shadow-red-700/20"
                   >
                     최종 승인
                   </button>
                </div>
                <button 
                   onClick={() => setSelectedReviewStudy(null)}
                   className="w-full text-slate-400 text-sm hover:underline"
                >
                  나중에 하기
                </button>
             </div>
          </div>
        </div>
      )}

      {/* All Pending Modal */}
      {showAllPending && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
             <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold">연구 승인 대기 목록 (전체)</h2>
                <button onClick={() => setShowAllPending(false)} className="text-slate-400 hover:text-slate-600">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                   </svg>
                </button>
             </div>
             <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {pendingStudies.map(s => (
                  <div key={s.id} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                     <div>
                        <p className="font-bold text-slate-800">{s.title}</p>
                        <p className="text-xs text-slate-500">{s.researcherName} 연구진 • {s.rewardPoints} Pts</p>
                     </div>
                     <button 
                        onClick={() => {
                          setSelectedReviewStudy(s);
                          setShowAllPending(false);
                        }}
                        className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                     >
                       검토하기
                     </button>
                  </div>
                ))}
                {pendingStudies.length === 0 && <p className="text-center text-slate-400 py-12">승인 대기 중인 연구가 없습니다.</p>}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
