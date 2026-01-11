
import React, { useState } from 'react';
import { User, Study, StudyStatus, StudyType } from '../types';

interface ResearcherDashboardProps {
  user: User;
  studies: Study[];
  setStudies: React.Dispatch<React.SetStateAction<Study[]>>;
  t: (key: any) => string;
  activeTab: string;
}

const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({ user, studies, setStudies, t, activeTab }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStudy, setNewStudy] = useState({
    title: '',
    description: '',
    type: StudyType.IN_PERSON,
    rewardPoints: 1,
    duration: 30,
    location: ''
  });

  const myStudies = studies.filter(s => s.researcherId === user.id);

  const handleCreateOrUpdateStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setStudies(studies.map(s => s.id === editingId ? {
        ...s,
        title: newStudy.title,
        description: newStudy.description,
        type: newStudy.type,
        rewardPoints: newStudy.rewardPoints,
        durationMinutes: newStudy.duration,
        location: newStudy.location
      } : s));
    } else {
      const createdStudy: Study = {
        id: `s${studies.length + 1}`,
        title: newStudy.title,
        description: newStudy.description,
        researcherId: user.id,
        researcherName: user.name,
        type: newStudy.type,
        status: StudyStatus.PENDING,
        rewardPoints: newStudy.rewardPoints,
        durationMinutes: newStudy.duration,
        location: newStudy.location,
        slots: []
      };
      setStudies([...studies, createdStudy]);
    }
    closeModal();
  };

  const openEdit = (study: Study) => {
    setEditingId(study.id);
    setNewStudy({
      title: study.title,
      description: study.description,
      type: study.type,
      rewardPoints: study.rewardPoints,
      duration: study.durationMinutes,
      location: study.location || ''
    });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingId(null);
    setNewStudy({ title: '', description: '', type: StudyType.IN_PERSON, rewardPoints: 1, duration: 30, location: '' });
  };

  const exportCsv = () => {
    if (myStudies.length === 0) return alert('내보낼 데이터가 없습니다.');
    const headers = ['ID', 'Title', 'Type', 'Status', 'Points', 'Duration'];
    const rows = myStudies.map(s => [s.id, s.title, s.type, s.status, s.rewardPoints, s.durationMinutes]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `research_data_${user.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: StudyStatus) => {
    switch(status) {
      case StudyStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700';
      case StudyStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case StudyStatus.COMPLETED: return 'bg-slate-100 text-slate-700';
      case StudyStatus.DRAFT: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getLocalizedStatus = (status: StudyStatus) => {
    switch(status) {
      case StudyStatus.ACTIVE: return t('active');
      case StudyStatus.PENDING: return t('pending');
      case StudyStatus.COMPLETED: return t('completed');
      case StudyStatus.DRAFT: return t('draft');
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('myStudies')}</h1>
          <p className="text-slate-500">경희대학교 연구 관리 시스템 - 연구자 대시보드</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-red-700/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>{t('newStudy')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">{activeTab === 'my-studies' ? t('myStudies') : '전체 연구 목록'}</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600">{t('viewDetails')}</th>
                  <th className="px-6 py-4 font-bold text-slate-600">{t('type')}</th>
                  <th className="px-6 py-4 font-bold text-slate-600">{t('capacity')}</th>
                  <th className="px-6 py-4 font-bold text-slate-600">{t('status')}</th>
                  <th className="px-6 py-4 font-bold text-slate-600">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myStudies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      등록된 연구가 없습니다. 새로운 연구를 시작해보세요!
                    </td>
                  </tr>
                ) : (
                  myStudies.map(study => (
                    <tr key={study.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{study.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{study.rewardPoints} {t('points')} • {study.durationMinutes}{t('minutes')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${study.type === StudyType.ONLINE ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50'}`}>
                          {study.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="bg-red-600 h-full" 
                              style={{ width: `${(study.slots.reduce((acc, s) => acc + s.bookedCount, 0) / study.slots.reduce((acc, s) => acc + s.capacity, 0) || 0) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 font-medium">
                            {study.slots.reduce((acc, s) => acc + s.bookedCount, 0)}/{study.slots.reduce((acc, s) => acc + s.capacity, 1) || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(study.status)}`}>
                          {getLocalizedStatus(study.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => openEdit(study)} className="text-red-700 hover:text-red-900 font-bold transition-colors">{t('edit')}</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">{t('quickActions')}</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 transition-all group">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 text-red-700 p-2 rounded-lg group-hover:bg-red-700 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700">{t('addTimeSlots')}</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700">{t('approveCredits')}</span>
              </div>
            </button>
            <button 
              onClick={exportCsv}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700">{t('exportCsv')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* New/Edit Study Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-slate-900">{editingId ? '연구 정보 수정' : t('newStudy')}</h2>
                   <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                      </svg>
                   </button>
                </div>

                <form onSubmit={handleCreateOrUpdateStudy} className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">연구 제목</label>
                      <input 
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-700 outline-none transition-all"
                        placeholder="예: 시각적 주의력이 판단에 미치는 영향"
                        value={newStudy.title}
                        onChange={e => setNewStudy({...newStudy, title: e.target.value})}
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">연구 설명</label>
                      <textarea 
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-700 outline-none transition-all h-24"
                        placeholder="연구의 목적과 참여 방법을 설명해주세요."
                        value={newStudy.description}
                        onChange={e => setNewStudy({...newStudy, description: e.target.value})}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">보상 포인트</label>
                        <input 
                          type="number"
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                          value={newStudy.rewardPoints}
                          onChange={e => setNewStudy({...newStudy, rewardPoints: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">진행 유형</label>
                        <select 
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                          value={newStudy.type}
                          onChange={e => setNewStudy({...newStudy, type: e.target.value as StudyType})}
                        >
                          <option value={StudyType.IN_PERSON}>대면 실험</option>
                          <option value={StudyType.ONLINE}>온라인 설문</option>
                        </select>
                      </div>
                   </div>

                   {newStudy.type === StudyType.IN_PERSON && (
                     <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">실험 장소</label>
                        <input 
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                          placeholder="예: 청운관 302호"
                          value={newStudy.location}
                          onChange={e => setNewStudy({...newStudy, location: e.target.value})}
                        />
                     </div>
                   )}

                   <div className="pt-6">
                      <button type="submit" className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-lg transition-all">
                        {editingId ? '저장하기' : '연구 승인 요청하기'}
                      </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;
