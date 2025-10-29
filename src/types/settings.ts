export interface HomeSettings {
  id?: number;
  address?: string;
  email?: string;
  phone?: string;
  logo?: string;
  title?: string;
  description?: string;
  welcome_logo?: string;
  title_welcome?: string;
  description_welcome?: string;
  why_choose_logo?: string;
  why_choose_title?: string;
  why_choose_title1?: string;
  why_choose_description1?: string;
  why_choose_title2?: string;
  why_choose_description2?: string;
  why_choose_title3?: string;
  why_choose_description3?: string;
  why_choose_title4?: string;
  why_choose_description4?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface HomeSettingsResponse extends ApiResponse<HomeSettings[]> {}

export interface SingleHomeSettingResponse extends ApiResponse<HomeSettings> {}
