
import React, { useState, useEffect } from 'react';
import { User, Study, StudyType, Reservation } from '../types';
import { getStudyRecommendations } from '../services/geminiService';
import { Language } from '../translations';

interface ParticipantDashboardProps {
  user: User;
  studies: Study[];
  t: (key: any) => string;
  lang: Language;
  activeTab: string;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ user, studies, t, lang, activeTab, reservations, setReservations }) => {
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [showBookingView, setShowBookingView] = useState(false);

  useEffect(() => {
    const fetchAIContent = async () => {
      setIsLoadingRecs(true);
      const recs = await getStudyRecommendations(user, studies, lang);
      setRecommendedIds(recs);
      setIsLoadingRecs(false);
    };

    if (process.env.API_KEY) {
      fetchAIContent();
    }
  }, [user, studies, lang]);

  const handleBookSlot = (studyId: string, slotId: string) => {
    const newReservation: Reservation = {
      id: `r-${Date.now()}`,
      studyId,
      slotId,
      participantId: user.id,
      status: 'UPCOMING',
      bookedAt: new Date().toISOString()
    };
    setReservations([...reservations, newReservation]);
    setShowBookingView(false);
    setSelectedStudy(null);
    alert('예약이 완료되었습니다!');
  };

  const activeStudies = studies.filter(s => s.status === 'ACTIVE');
  const filteredStudies = activeTab === 'available' ? activeStudies : activeStudies;
  const userReservations = reservations.filter(r => r.participantId === user.id);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="bg-red-50 text-red-700 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-500 text-sm">{t('upcomingBookings')}</p>
            <p className="text-2xl font-bold text-slate-800">{userReservations.filter(r => r.status === 'UPCOMING').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-500 text-sm">{t('completedStudies')}</p>
            <p className="text-2xl font-bold text-slate-800">8</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-500 text-sm">{t('rewardPoints')}</p>
            <p className="text-2xl font-bold text-slate-800">{user.metadata?.points || 0}</p>
          </div>
        </div>
      </div>

      {/* Available Studies List */}
      <section className="animate-in fade-in duration-700">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t('availableStudies')}</h2>
            <p className="text-slate-500">경희대학교 내에서 현재 참여 가능한 연구 목록입니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map(study => (
            <div key={study.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
              <div className="h-32 bg-slate-200 relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${study.id}/400/200`} alt="Study" className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${study.type === StudyType.ONLINE ? 'bg-blue-500 shadow-sm' : 'bg-orange-500 shadow-sm'}`}>
                    {study.type}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight min-h-[3rem]">{study.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{study.description}</p>
                
                <div className="space-y-2 mb-6 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{study.researcherName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{study.durationMinutes} {t('minutes')}</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-1 text-red-700 font-bold">
                    <span className="text-xl">{study.rewardPoints}</span>
                    <span className="text-xs uppercase tracking-tight">{t('points')}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedStudy(study);
                      setShowBookingView(false);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {t('viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study Details Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {!showBookingView ? (
              <>
                <div className="h-48 bg-slate-100 relative">
                   <img src={`https://picsum.photos/seed/${selectedStudy.id}/800/400`} className="w-full h-full object-cover" alt="Detail" />
                   <button onClick={() => setSelectedStudy(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                      </svg>
                   </button>
                </div>
                <div className="p-8 space-y-6">
                   <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{selectedStudy.type}</span>
                        <span className="text-slate-400 text-xs">{selectedStudy.researcherName} 연구진</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedStudy.title}</h2>
                   </div>

                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-slate-500 mb-1">참여 보상</p>
                        <p className="font-bold text-red-700 text-lg">{selectedStudy.rewardPoints} {t('points')}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-slate-500 mb-1">소요 시간</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedStudy.durationMinutes} {t('minutes')}</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">연구 설명</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{selectedStudy.description}</p>
                   </div>

                   {selectedStudy.location && (
                      <div className="flex items-start space-x-3 text-sm text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                           <p className="font-bold text-slate-800">참여 장소</p>
                           <p>{selectedStudy.location}</p>
                        </div>
                      </div>
                   )}

                   <div className="pt-6 border-t flex gap-4">
                      <button onClick={() => setSelectedStudy(null)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        닫기
                      </button>
                      <button 
                        onClick={() => setShowBookingView(true)}
                        className="flex-[2] px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-700/20 transition-all"
                      >
                        시간대 예약하기
                      </button>
                   </div>
                </div>
              </>
            ) : (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setShowBookingView(false)} className="text-red-700 font-bold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    돌아가기
                  </button>
                  <h2 className="text-xl font-bold">시간대 선택</h2>
                  <div className="w-10"></div>
                </div>

                <div className="space-y-3">
                  {selectedStudy.slots.length > 0 ? (
                    selectedStudy.slots.map(slot => {
                      const isFull = slot.bookedCount >= slot.capacity;
                      const isBooked = reservations.some(r => r.slotId === slot.id && r.participantId === user.id);
                      
                      return (
                        <div key={slot.id} className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${isBooked ? 'border-red-200 bg-red-50' : 'border-slate-100 hover:border-red-100'}`}>
                          <div>
                            <p className="font-bold text-slate-800">
                              {new Date(slot.startTime).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { month: 'long', day: 'numeric', weekday: 'short' })}
                              {' '}{new Date(slot.startTime).toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-xs text-slate-500">모집 현황: {slot.bookedCount} / {slot.capacity}</p>
                          </div>
                          
                          <button 
                            disabled={isFull || isBooked}
                            onClick={() => handleBookSlot(selectedStudy.id, slot.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isBooked ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-red-700 text-white hover:bg-red-800'}`}
                          >
                            {isBooked ? '예약 완료' : isFull ? '정원 초과' : '예약'}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      현재 예약 가능한 시간대가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantDashboard;
