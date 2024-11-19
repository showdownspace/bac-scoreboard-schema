// Generated from schema.json by Copilot

export interface Challenge {
  id: number;
  name: string;
  maxScore: number;
}

export interface Team {
  id: number;
  name: string;
}

export type SubmissionStatus = "reviewing" | "accepted";

export interface Submission {
  challengeId: number;
  teamId: number;
  status: SubmissionStatus;
  penalty: number;
  submittedAt: string; // ISO 8601 date string
  score: number;
}

export interface Progress {
  challengeId: number;
  teamId: number;
  progress: number; // Percentage of challenge completion (0-100)
}

export interface ScoreboardSchema {
  challenges: Challenge[];
  teams: Team[];
  submissions: Submission[];
  progress: Progress[];
}

export type TeamScore = Record<
  number,
  {
    challenges: any;
    id: number;
    name: string;
    totalScore: number;
  }
>;

export type SortedTeam = Array<TeamScore[number]>;
