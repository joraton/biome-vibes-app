import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // ID Clerk
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Table pour stocker les évaluations des biomes par utilisateur
  userBiomeEvaluations: defineTable({
    userId: v.string(),
    biomeId: v.string(),
    subBiomeId: v.string(),
    answers: v.array(v.number()),
    scoreTest20: v.number(),
    noteSubjective20: v.optional(v.number()),
    commentaireSubjectif: v.optional(v.string()),
    includeSubjective: v.boolean(),
    finalDisplayed: v.number(),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_biome", ["biomeId"])
    .index("by_user_biome", ["userId", "biomeId"]),

  // Table pour l'historique des visites
  userHistory: defineTable({
    userId: v.string(),
    biomeId: v.string(),
    subBiomeId: v.optional(v.string()),
    visitedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_visited_at", ["visitedAt"]),
});