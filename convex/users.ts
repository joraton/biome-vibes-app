import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation pour créer manuellement un utilisateur (pour les tests)
export const createTestUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return existingUser;
    }

    const newUser = await ctx.db.insert("users", {
      userId: args.userId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
    
    console.log("Created new user:", newUser);
    return newUser;
  },
});

// Mutation pour créer ou mettre à jour un utilisateur
export const ensureUser = mutation({
  args: {
    userId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existingUser;
    }

    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});

// Query pour récupérer un utilisateur par son ID Clerk
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
  },
});



// Mutation pour ajouter une visite à l'historique
export const addToHistory = mutation({
  args: {
    biomeId: v.string(),
    subBiomeId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("userHistory", {
      userId: identity.subject,
      biomeId: args.biomeId,
      subBiomeId: args.subBiomeId,
      visitedAt: Date.now(),
    });
  },
});

// Query pour récupérer l'historique d'un utilisateur
export const getUserHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("userHistory")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Query pour récupérer les évaluations d'un utilisateur
export const getUserEvaluations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("userBiomeEvaluations")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

// Query pour lister tous les utilisateurs (pour les tests)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Query pour récupérer un utilisateur par son ID Clerk
export const getUserByClerkId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Mutation pour ajouter une évaluation complète
export const addEvaluation = mutation({
  args: {
    biomeId: v.string(),
    subBiomeId: v.string(),
    answers: v.array(v.number()),
    scoreTest20: v.number(),
    noteSubjective20: v.optional(v.number()),
    commentaireSubjectif: v.optional(v.string()),
    includeSubjective: v.boolean(),
    finalDisplayed: v.number(),
  },
  handler: async (ctx, args) => {
    console.log('🔥 addEvaluation appelée avec:', args);
    
    const identity = await ctx.auth.getUserIdentity();
    console.log('👤 Identity récupérée:', identity ? 'Oui' : 'Non');
    
    if (!identity) {
      console.error('❌ Utilisateur non authentifié');
      throw new Error("Utilisateur non authentifié");
    }

    console.log('💾 Insertion dans la base de données...');
     const result = await ctx.db.insert("userBiomeEvaluations", {
        userId: identity.subject,
        biomeId: args.biomeId,
        subBiomeId: args.subBiomeId,
        answers: args.answers,
        scoreTest20: args.scoreTest20,
        noteSubjective20: args.noteSubjective20,
        commentaireSubjectif: args.commentaireSubjectif,
        includeSubjective: args.includeSubjective,
        finalDisplayed: args.finalDisplayed,
        timestamp: Date.now(),
      });
     
     console.log('✅ Évaluation sauvegardée avec ID:', result);
     return result;
   },
 });