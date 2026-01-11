
export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  RESEARCHER = 'RESEARCHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
  metadata?: {
    major?: string;
    age?: number;
    gender?: string;
    points?: number;
    birthdate?: string;
    phone?: string;
    studentId?: string;
    employeeId?: string;
    position?: string;
  };
}

export enum StudyType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

export enum StudyStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface Study {
  id: string;
  title: string;
  description: string;
  researcherId: string;
  researcherName: string;
  type: StudyType;
  status: StudyStatus;
  rewardPoints: number;
  durationMinutes: number;
  prescreenCriteria?: string[];
  location?: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  studyId: string;
  startTime: string;
  capacity: number;
  bookedCount: number;
  participants: string[]; // User IDs
}

export interface Reservation {
  id: string;
  studyId: string;
  slotId: string;
  participantId: string;
  status: 'UPCOMING' | 'ATTENDED' | 'NO_SHOW' | 'CANCELLED';
  bookedAt: string;
}

export interface GlobalStats {
  totalStudies: number;
  totalParticipants: number;
  averageAttendanceRate: number;
  totalCreditsAwarded: number;
}
