
import { Study, StudyType, StudyStatus, User, UserRole } from './types';

export const MOCK_USER_PARTICIPANT: User = {
  id: 'p1',
  name: '김경희',
  email: 'khu_student@khu.ac.kr',
  role: UserRole.PARTICIPANT,
  metadata: {
    major: '심리학과 (Department of Psychology)',
    age: 21,
    gender: 'Female',
    points: 12.0
  }
};

export const MOCK_USER_RESEARCHER: User = {
  id: 'r1',
  name: '이희도 교수',
  email: 'hd.lee@khu.ac.kr',
  role: UserRole.RESEARCHER
};

export const MOCK_USER_ADMIN: User = {
  id: 'a1',
  name: 'KHU 관리자',
  email: 'admin@khu.ac.kr',
  role: UserRole.ADMIN
};

export const MOCK_STUDIES: Study[] = [
  {
    id: 's1',
    title: '의사결정 시각 단서 연구 (Decision-Making Visual Cues)',
    description: '시각적 자극이 경제적 선택에 미치는 영향을 탐구합니다. 약 30분간 컴퓨터 과제를 수행합니다.',
    researcherId: 'r1',
    researcherName: '이희도 교수',
    type: StudyType.IN_PERSON,
    status: StudyStatus.ACTIVE,
    rewardPoints: 2,
    durationMinutes: 30,
    location: '경희대학교 오비스홀(Orbis Hall) 402호',
    prescreenCriteria: ['시력: 정상 또는 교정 시력'],
    slots: [
      { id: 't1', studyId: 's1', startTime: '2024-06-15T10:00:00', capacity: 10, bookedCount: 4, participants: ['p1'] },
      { id: 't2', studyId: 's1', startTime: '2024-06-15T11:00:00', capacity: 10, bookedCount: 2, participants: [] }
    ]
  },
  {
    id: 's2',
    title: '디지털 학습 경험 설문 (Digital Learning Experience)',
    description: '최근 2년간의 비대면 수업 경험에 대한 온라인 설문조사입니다.',
    researcherId: 'r2',
    researcherName: '박연구 박사',
    type: StudyType.ONLINE,
    status: StudyStatus.ACTIVE,
    rewardPoints: 1,
    durationMinutes: 15,
    prescreenCriteria: ['최근 학기 온라인 강의 2개 이상 수강자'],
    slots: [
      { id: 't3', studyId: 's2', startTime: '2024-06-10T00:00:00', capacity: 500, bookedCount: 120, participants: [] }
    ]
  },
  {
    id: 's3',
    title: '수면 부족과 인지 반응 속도 (Sleep & Reflexes)',
    description: '수면 시간이 운동 협응 능력에 미치는 영향을 측정합니다. 대면 참여가 필요합니다.',
    researcherId: 'r1',
    researcherName: '이희도 교수',
    type: StudyType.IN_PERSON,
    status: StudyStatus.PENDING,
    rewardPoints: 5,
    durationMinutes: 90,
    location: '청운관(Cheongun-gwan) 지하 1층 실험실',
    slots: []
  }
];
