import type { SupportMessage, SupportState, SupportTopic } from "@/lib/support/contracts";

export const SUPPORT_STORAGE_KEY = "tcc-demo-support-v1";
export const SUPPORT_EVENT = "tcc:support-state";

const topicOpeners: Record<SupportTopic, string> = {
  order: "Need help with an order? Share the order reference and the email or phone used at checkout.",
  product: "Tell us which product you are looking at and what you want to confirm — fit, size, colour or stock.",
  pickup: "Pickup is available in the demo flow at the TCC Flagship Store / Main HQ in SS15, Subang Jaya. What would you like to check?",
  payung: "For Payung, we can help with points, tiers, rewards or account access.",
  general: "Tell us what you need help with and we’ll point you in the right direction."
};

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createMessage(author: SupportMessage["author"], text: string): SupportMessage {
  return { id: id(author), author, text, createdAt: new Date().toISOString() };
}

export function createInitialSupportState(): SupportState {
  const now = new Date().toISOString();
  return {
    topic: null,
    updatedAt: now,
    messages: [
      {
        id: "agent-welcome",
        author: "agent",
        text: "Hi — this is the TCC demo support desk. Choose a topic below or send a message.",
        createdAt: now
      }
    ]
  };
}

export function topicPrompt(topic: SupportTopic) {
  return topicOpeners[topic];
}

export function demoAgentReply(message: string, topic: SupportTopic | null): string {
  const value = message.toLowerCase();

  if (value.includes("order") || value.includes("track") || value.includes("reference") || topic === "order") {
    return "You can use Tracking with your order reference plus the email or phone used at checkout. If the order is saved in this browser, its latest demo status will appear there.";
  }
  if (value.includes("pickup") || value.includes("collect") || topic === "pickup") {
    return "The demo supports store pickup at TCC Flagship Store / Main HQ, SS15, Subang Jaya. Choose Pickup during checkout and the order will follow the Ready for pickup → Collected flow.";
  }
  if (value.includes("point") || value.includes("payung") || value.includes("reward") || topic === "payung") {
    return "Payung demo members earn 3 points per RM1 spent. Sign in through Account to view tier progress, activity and eligible reward redemptions.";
  }
  if (value.includes("size") || value.includes("fit") || value.includes("colour") || value.includes("color") || value.includes("stock") || topic === "product") {
    return "Open the product page to check live demo stock by colour and size. Selecting a colour updates the matching product media when mapped imagery is available.";
  }
  if (value.includes("return") || value.includes("refund")) {
    return "Returns and refunds are still demo-stage policy placeholders until the client confirms the production rules. The final policy will be connected before launch.";
  }
  return "Thanks — this demo keeps the conversation in your browser. A production support provider will replace this simulated reply flow after client approval.";
}
