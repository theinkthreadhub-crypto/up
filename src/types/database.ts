export type UserRole = 'super_admin' | 'admin' | 'content_manager';

export type OrderStatus =
  | 'Pending Payment'
  | 'Paid'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  stock_quantity: number;
  additional_price?: number;
  image_url?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description?: string;
  category_id?: string;
  category_name?: string;
  product_type: string;
  price: number;
  sale_price?: number;
  cost_price?: number; // Admin only
  discount_percent?: number;
  sizes: string[];
  colors: string[];
  thumbnail: string;
  images: string[];
  is_published: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  fabric_gsm?: number;
  material_care?: string;
  seo_title?: string;
  seo_description?: string;
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface InventoryHistoryItem {
  id: string;
  product_id?: string;
  product_name: string;
  variant_id?: string;
  sku?: string;
  previous_quantity: number;
  new_quantity: number;
  quantity_changed: number;
  reason: string;
  order_id?: string;
  admin_user: string;
  created_at: string;
}

export interface CustomerAddress {
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Customer {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  accepts_marketing: boolean;
  addresses?: CustomerAddress[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  product_slug?: string;
  product_sku?: string;
  product_image?: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: CustomerAddress;
  billing_address?: CustomerAddress;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  tracking_number?: string;
  tracking_courier?: string;
  internal_notes?: string;
  customer_notes?: string;
  timeline: OrderTimelineEvent[];
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  error_code?: string;
  error_description?: string;
  raw_payload?: Record<string, unknown>;
  webhook_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  author: string;
  is_published: boolean;
  published_at: string;
  read_time: string;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'drop' | 'sale' | 'launch' | 'general';
  link_url?: string;
  is_active: boolean;
  priority: number;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface SiteSettings {
  id: string;
  brand_name: string;
  tagline: string;
  logo_url?: string;
  contact_email: string;
  support_phone: string;
  currency: string;
  currency_symbol: string;
  free_shipping_threshold: number;
  default_shipping_fee: number;
  tax_percent: number;
  instagram_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  store_address: string;
  city: string;
  state: string;
  pincode: string;
  announcement_bar_enabled: boolean;
  announcement_bar_text: string;
  qikink_api_key?: string;
  qikink_client_id?: string;
  qikink_auto_fulfillment?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_body: string;
  variables: string[];
  is_active: boolean;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  recipient_name?: string;
  template_id?: string;
  subject: string;
  status: 'sent' | 'failed' | 'queued';
  error_message?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  auth_user_id?: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}
