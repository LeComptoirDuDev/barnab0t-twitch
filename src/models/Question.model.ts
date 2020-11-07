export interface Question {
  id: number;
  author?: string;
  date?: Date;
  content?: string;
  active?: boolean;
}

export const QuestionNull: Question = {id: -1};