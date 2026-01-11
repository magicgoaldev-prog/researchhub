
import React from 'react';
import { Language } from '../translations';

interface SupportViewProps {
  t: (key: any) => string;
  lang: Language;
}

const SupportView: React.FC<SupportViewProps> = ({ t, lang }) => {
  const faqs = [
    {
      q: { ko: '어떻게 연구에 참여하나요?', en: 'How do I participate?', zh: '如何参与研究？' },
      a: { ko: '참여 가능 연구 목록에서 원하는 연구를 선택하고 시간대를 예약하면 됩니다.', en: 'Select a study from the available list and book a time slot.', zh: '从可用列表中选择一项研究并预约时间段。' }
    },
    {
      q: { ko: '포인트는 언제 지급되나요?', en: 'When are points awarded?', zh: '积分什么时候发放？' },
      a: { ko: '연구자가 참여를 확인한 후 24시간 이내에 지급됩니다.', en: 'Within 24 hours after the researcher confirms your attendance.', zh: '在研究员确认您的出席后 24 小时内。' }
    },
    {
      q: { ko: '예약을 취소하고 싶어요.', en: 'I want to cancel a booking.', zh: '我想取消预约。' },
      a: { ko: '대시보드 "예정된 예약"에서 취소 버튼을 누르시면 됩니다. 실험 24시간 전까지만 가능합니다.', en: 'Click the cancel button in your dashboard. Valid up to 24h before.', zh: '在您的仪表板中点击取消按钮。最晚在 24 小时前有效。' }
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('support')}</h1>
        <p className="text-slate-500">도움이 필요하신가요? 자주 묻는 질문을 확인하거나 문의해주세요.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50">
          <h2 className="font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>
        </div>
        <div className="divide-y">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6">
              <h3 className="font-bold text-slate-900 mb-2">Q: {faq.q[lang] || faq.q.ko}</h3>
              <p className="text-slate-600 text-sm">A: {faq.a[lang] || faq.a.ko}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-red-900 mb-1">직접 문의하기</h3>
          <p className="text-red-700 text-sm">시스템 오류나 긴급 문의는 관리팀으로 연락주세요.</p>
        </div>
        <div className="flex gap-3">
          <a href="mailto:support@khu.ac.kr" className="bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-800 transition-colors">
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportView;
