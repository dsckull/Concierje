import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const visitantesTable = pgTable("visitantes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  documento: text("documento"),
  telefone: text("telefone"),
  foto_url: text("foto_url"),
  destino_apartamento: text("destino_apartamento").notNull(),
  destino_bloco: text("destino_bloco").notNull(),
  destino_morador: text("destino_morador"),
  motivo: text("motivo").notNull().default("visita"),
  tipo: text("tipo").notNull().default("visitante"),
  veiculo_placa: text("veiculo_placa"),
  qr_code: text("qr_code"),
  entrada: timestamp("entrada").defaultNow().notNull(),
  saida: timestamp("saida"),
  autorizado_por: text("autorizado_por"),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertVisitanteSchema = createInsertSchema(visitantesTable).omit({ id: true, created_at: true });
export type InsertVisitante = z.infer<typeof insertVisitanteSchema>;
export type Visitante = typeof visitantesTable.$inferSelect;
