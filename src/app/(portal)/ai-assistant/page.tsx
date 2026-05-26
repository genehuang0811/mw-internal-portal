import { ComingSoon } from "@/components/coming-soon";
import { findModuleByHref } from "@/lib/modules";

const AI_ASSISTANT = findModuleByHref("/ai-assistant")!;

export const metadata = {
  title: `${AI_ASSISTANT.title} · MW Internal Forms Portal`,
};

export default function AiAssistantPage() {
  return <ComingSoon module={AI_ASSISTANT} />;
}
