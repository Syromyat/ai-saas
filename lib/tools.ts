export type ToolId =
  | "resume"
  | "instagram"
  | "congrats"
  | "business"
  | "legal"
  | "tutor";

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
}

export const tools: Tool[] = [
  { id: "resume",    name: "ИИ Резюме",       description: "Составит CV за минуту",         icon: "📄" },
  { id: "instagram", name: "ИИ Контент",       description: "Посты, сторис, рилс",           icon: "📱" },
  { id: "congrats",  name: "ИИ Поздравления",  description: "Тексты на любой повод",         icon: "🎉" },
  { id: "business",  name: "ИИ Бизнес идеи",  description: "Ниши и бизнес-планы",           icon: "💡" },
  { id: "legal",     name: "ИИ Юрист",         description: "Ответы на правовые вопросы",    icon: "⚖️" },
  { id: "tutor",     name: "ИИ Репетитор",     description: "Объяснит любую тему",           icon: "🎓" },
];
