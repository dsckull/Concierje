import { pgTable, serial, text, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { moradoresTable } from "./moradores";

export const financeiroTable = pgTable("financeiro", {
  id: serial("id").primaryKey(),
  tipo: text("tipo").notNull(),
  descricao: text("descricao").notNull(),
  valor: real("valor").notNull(),
  categoria: text("categoria").notNull().default("outros"),
  data_vencimento: timestamp("data_vencimento"),
  data_pagamento: timestamp("data_pagamento"),
  morador_id: integer("morador_id").references(() => moradoresTable.id),
  referencia_mes: text("referencia_mes"),
  status: text("status").notNull().default("pendente"),
  comprovante_url: text("comprovante_url"),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertFinanceiroSchema = createInsertSchema(financeiroTable).omit({ id: true, created_at: true });
export type InsertFinanceiro = z.infer<typeof insertFinanceiroSchema>;
export type Financeiro = typeof financeiroTable.$inferSelect;
