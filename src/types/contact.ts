export interface Contact {
  id?: number;
  address?: string | null;
  phone?: string | null;
  whatsApp?: string | null;
  email?: string | null;
  business_hour?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactResponse {
  success: boolean;
  data: Contact[];
  message?: string;
}
