export interface Faq {
  id?: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export interface FaqResponse {
  success: boolean;
  data: Faq[];
  message?: string;
}

export interface SingleFaqResponse {
  success: boolean;
  data: Faq;
  message?: string;
}
