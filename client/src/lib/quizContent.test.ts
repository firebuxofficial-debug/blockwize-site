import { describe, expect, it } from "vitest";
import {
  getCommunityTaskMessageForLocale,
  quizContent,
} from "./quizContent";

describe("Portuguese quiz content", () => {
  it("provides five Brazilian Portuguese quiz questions", () => {
    expect(quizContent.pt.questions).toHaveLength(5);
    expect(quizContent.pt.questions[0]?.question).toContain("Em que ano");
    expect(quizContent.pt.questions[4]?.options[2]).toContain("manter a senha privada");
  });

  it("uses Portuguese community follow-up messages", () => {
    expect(getCommunityTaskMessageForLocale("pt", "discord", "ready")).toContain("pronta para análise");
    expect(getCommunityTaskMessageForLocale("pt", "roblox", "retry")).toContain("Não conseguimos verificar");
  });
});
