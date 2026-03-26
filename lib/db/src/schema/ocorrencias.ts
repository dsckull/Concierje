import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { moradoresTable } from "./moradores";

export const ocorrenciasTable = pgTable("ocorrencias", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  tipo: text("tipo").notNull().default("manutencao"),
  prioridade: text("prioridade").notNull().default("normal"),
  status: text("status").notNull().default("aberta"),
  morador_id: integer("morador_id").references(() => moradoresTable.id),
  area: text("area"),
  foto_url: text("foto_url"),
  prestador_responsavel: text("prestador_responsavel"),
  valor_servico: text("valor_servico"),
  data_agendamento: timestamp("data_agendamento"),
  data_conclusao: timestamp("data_conclusao"),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertOcorrenciaSchema = createInsertSchema(ocorrenciasTable).omit({ id: true, created_at: true });
export type InsertOcorrencia = z.infer<typeof insertOcorrenciaSchema>;
export type Ocorrencia = typeof ocorrenciasTable.$inferSelect;
