export type SupportAuthor = "customer" | "agent";

export type SupportTopic = "order" | "product" | "pickup" | "payung" | "general";

export interface SupportMessage {
  id: string;
  author: SupportAuthor;
  text: string;
  createdAt: string;
}

export interface SupportState {
  topic: SupportTopic | null;
  messages: SupportMessage[];
  updatedAt: string;
}
