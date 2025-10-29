export interface Shipping {
  id?: number;
  title: string;
  description?: string;
  label_partner?: string;
  text?: string;
  map_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingResponse {
  success: boolean;
  data: Shipping[];
  message?: string;
}

export interface SingleShippingResponse {
  success: boolean;
  data: Shipping;
  message?: string;
}
