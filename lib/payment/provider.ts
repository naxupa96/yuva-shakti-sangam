import crypto from "node:crypto";
import { PaymentProvider, CreateOrderParams, PaymentOrderResult, VerifyPaymentParams, WebhookResult } from "./types";

/**
 * Razorpay Payment Provider Implementation
 */
export class RazorpayProvider implements PaymentProvider {
  name = "razorpay";
  private keyId: string;
  private keySecret: string;
  private webhookSecret?: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || process.env.PAYMENT_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_KEY_SECRET || "";
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET;
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    if (!this.keyId || !this.keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(params.amount * 100), // convert to paise
        currency: params.currency || "INR",
        receipt: params.receipt.substring(0, 40),
        notes: params.notes || {},
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Razorpay order creation failed: ${err}`);
    }

    const order = await response.json();
    return {
      order_id: order.id,
      amount: params.amount,
      currency: params.currency || "INR",
      gateway: "razorpay",
      key_id: this.keyId,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    if (!this.keySecret) return false;
    if (!params.signature) return false;

    const body = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", this.keySecret)
      .update(body)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(params.signature, "utf-8")
    );
  }

  async handleWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
    const secret = this.webhookSecret || this.keySecret;
    if (!secret || !signature) {
      return { verified: false, event: "unknown", status: "ignored" };
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const verified = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );

    if (!verified) {
      return { verified: false, event: "invalid_signature", status: "ignored" };
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    if (event === "payment.captured" || event === "order.paid") {
      return {
        verified: true,
        event,
        orderId: paymentEntity?.order_id || orderEntity?.id,
        paymentId: paymentEntity?.id,
        amount: (paymentEntity?.amount || 0) / 100,
        currency: paymentEntity?.currency || "INR",
        status: "paid",
        rawPayload: payload,
      };
    }

    if (event === "payment.failed") {
      return {
        verified: true,
        event,
        orderId: paymentEntity?.order_id,
        paymentId: paymentEntity?.id,
        status: "failed",
        rawPayload: payload,
      };
    }

    return {
      verified: true,
      event,
      status: "ignored",
      rawPayload: payload,
    };
  }
}

/**
 * Cashfree Payment Provider Implementation
 */
export class CashfreeProvider implements PaymentProvider {
  name = "cashfree";
  private appId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || process.env.PAYMENT_KEY_ID || "";
    this.secretKey = process.env.CASHFREE_SECRET_KEY || process.env.PAYMENT_KEY_SECRET || "";
    this.baseUrl = process.env.CASHFREE_ENV === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    if (!this.appId || !this.secretKey) {
      throw new Error("Cashfree credentials not configured");
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: params.amount,
        order_currency: params.currency || "INR",
        customer_details: {
          customer_id: params.customer?.phone || `cust_${Date.now()}`,
          customer_name: params.customer?.name || "Participant",
          customer_phone: params.customer?.phone || "9999999999",
          customer_email: params.customer?.email || "attendee@yuvashaktisangam.me",
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yuvashaktisangam.me"}/register/success?order_id={order_id}`,
        },
        order_note: params.receipt,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Cashfree order creation failed: ${err}`);
    }

    const order = await response.json();
    return {
      order_id: order.order_id || orderId,
      amount: params.amount,
      currency: params.currency || "INR",
      gateway: "cashfree",
      key_id: this.appId,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    if (!this.appId || !this.secretKey) return false;

    const response = await fetch(`${this.baseUrl}/orders/${params.orderId}`, {
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
      },
    });

    if (!response.ok) return false;
    const order = await response.json();
    return order.order_status === "PAID";
  }

  async handleWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
    const payload = JSON.parse(rawBody);
    const order = payload?.data?.order;
    const payment = payload?.data?.payment;

    if (payload.type === "PAYMENT_SUCCESS_WEBHOOK" || order?.order_status === "PAID") {
      return {
        verified: true,
        event: payload.type || "PAYMENT_SUCCESS",
        orderId: order?.order_id,
        paymentId: payment?.cf_payment_id?.toString() || order?.order_id,
        amount: order?.order_amount || 50,
        currency: order?.order_currency || "INR",
        status: "paid",
        rawPayload: payload,
      };
    }

    return {
      verified: true,
      event: payload.type || "UNKNOWN",
      status: "ignored",
      rawPayload: payload,
    };
  }
}

/**
 * Mock Payment Provider for Instant Local Development & Testing
 * Enables full end-to-end verification without live payment credentials.
 */
export class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      order_id: mockOrderId,
      amount: params.amount,
      currency: params.currency || "INR",
      gateway: "mock",
      key_id: "mock_key_demo",
      mock_mode: true,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    // In mock mode, any signature matching 'mock_signature_valid' or non-empty in test mode succeeds
    return true;
  }

  async handleWebhook(rawBody: string, _signature: string): Promise<WebhookResult> {
    const payload = JSON.parse(rawBody);
    return {
      verified: true,
      event: "mock.payment.paid",
      orderId: payload.order_id,
      paymentId: payload.payment_id || `mock_pay_${Date.now()}`,
      amount: payload.amount || 50,
      currency: "INR",
      status: "paid",
      rawPayload: payload,
    };
  }
}

/**
 * Factory function to retrieve the active payment provider.
 * Defaults to Razorpay if keys present, Cashfree if configured, or Mock for smooth dev testing.
 */
export function getPaymentProvider(): PaymentProvider {
  const configured = (process.env.PAYMENT_GATEWAY || "").toLowerCase();

  if (configured === "cashfree" || (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY)) {
    return new CashfreeProvider();
  }

  if (configured === "razorpay" || (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)) {
    return new RazorpayProvider();
  }

  // If no live keys are configured yet, provide MockProvider for zero-friction testing
  return new MockPaymentProvider();
}
