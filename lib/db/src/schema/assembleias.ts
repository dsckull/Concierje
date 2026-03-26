import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assembleiasTable = pgTable("assembleias", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull().default("ordinaria"),
  descricao: text("descricao"),
  data_realizacao: timestamp("data_realizacao").notNull(),
  local: text("local").notNull().default("online"),
  link_reuniao: text("link_reuniao"),
  status: text("status").notNull().default("agendada"),
  quorum_minimo: integer("quorum_minimo"),
  presentes: integer("presentes").default(0),
  ata_url: text("ata_url"),
  ata_texto: text("ata_texto"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const votacoesTable = pgTable("votacoes", {
  id: serial("id").primaryKey(),
  assembleia_id: integer("assembleia_id").notNull().references(() => assembleiasTable.id),
  questao: text("questao").notNull(),
  descricao: text("descricao"),
  opcoes: text("opcoes").notNull().default('["Sim","Não","Abstenção"]'),
  votos_sim: integer("votos_sim").default(0),
  votos_nao: integer("votos_nao").default(0),
  votos_abstencao: integer("votos_abstencao").default(0),
  status: text("status").notNull().default("aguardando"),
  resultado: text("resultado"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssembleiaSchema = createInsertSchema(assembleiasTable).omit({ id: true, created_at: true });
export type InsertAssembleia = z.infer<typeof insertAssembleiaSchema>;
export type Assembleia = typeof assembleiasTable.$inferSelect;

export const insertVotacaoSchema = createInsertSchema(votacoesTable).omit({ id: true, created_at: true });
export type InsertVotacao = z.infer<typeof insertVotacaoSchema>;
export type Votacao = typeof votacoesTable.$inferSelect;
