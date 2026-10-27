import type { IsoDate, TimeSpan } from './api';

export interface Session {
  id: number;
  startTime: IsoDate;
  endTime: IsoDate;
  duration: TimeSpan;
  subjectId: number;
}

export interface SessionInput {
  /** Em UTC (ISO terminando em "Z"). */
  startTime: IsoDate;
  endTime: IsoDate;
  subjectId: number;
}
