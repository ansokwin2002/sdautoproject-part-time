export interface Policy {
  id?: number;
  title: string;
  privacy?: string;
  warranty?: string;
  shipping?: string;
  order_cancellation?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PolicyResponse {
  success: boolean;
  data: Policy[];
  message?: string;
}

export interface SinglePolicyResponse {
  success: boolean;
  data: Policy;
  message?: string;
}
