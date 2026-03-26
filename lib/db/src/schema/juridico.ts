import { pgTable, serial, text, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { moradoresTable } from "./moradores";

export const documentosTable = pgTable("documentos_juridicos", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull().default("regulamento"),
  descricao: text("descricao"),
  arquivo_url: text("arquivo_url"),
  versao: text("versao"),
  vigente: text("vigente").notNull().default("sim"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const notificacoesJuridicasTable = pgTable("notificacoes_juridicas", {
  id: serial("id").primaryKey(),
  morador_id: integer("morador_id").references(() => moradoresTable.id),
  tipo: text("tipo").notNull().default("multa"),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  valor_multa: real("valor_multa"),
  status: text("status").notNull().default("enviada"),
  data_prazo: timestamp("data_prazo"),
  data_resolucao: timestamp("data_resolucao"),
  artigo_regimento: text("artigo_regimento"),
  comprovante_url: text("comprovante_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertDocumentoSchema = createInsertSchema(documentosTable).omit({ id: true, created_at: true });
export type InsertDocumento = z.infer<typeof insertDocumentoSchema>;
export type Documento = typeof documentosTable.$inferSelect;

export const insertNotificacaoJuridicaSchema = createInsertSchema(notificacoesJuridicasTable).omit({ id: true, created_at: true });
export type InsertNotificacaoJuridica = z.infer<typeof insertNotificacaoJuridicaSchema>;
export type NotificacaoJuridica = typeof notificacoesJuridicasTable.$inferSelect;
