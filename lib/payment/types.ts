export interface CreateOrderParams {
  amount: number; // in INR (e.g. 50)
  currency?: string;
  receipt: string; // registration_id or participant_id
  notes?: Record<string, string>;
  customer?: {
    name: string;
    email?: string;
    phone: string;
  };
}

export interface PaymentOrderResult {
  order_id: string;
  amount: number;
  currency: string;
  gateway: string;
  key_id?: string;
  mock_mode?: boolean;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature?: string;
}

export interface WebhookResult {
  verified: boolean;
  event: string;
  orderId?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  status: "paid" | "failed" | "refunded" | "ignored";
  rawPayload?: any;
}

export interface PaymentProvider {
  name: string;
  createOrder(params: CreateOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
  handleWebhook(rawBody: string, signature: string): Promise<WebhookResult>;
}
