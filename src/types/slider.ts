export interface Slider {
  id: number;
  image: string;
  ordering: number;
  created_at?: string;
  updated_at?: string;
}

export interface SliderResponse {
  success: boolean;
  data: Slider[];
  message?: string;
}

export interface SingleSliderResponse {
  success: boolean;
  data: Slider;
  message?: string;
}
