import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { moradoresTable } from "./moradores";

export const areasTable = pgTable("areas_comuns", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  capacidade: integer("capacidade"),
  valor_hora: text("valor_hora"),
  foto_url: text("foto_url"),
  ativa: boolean("ativa").default(true),
  regras: text("regras"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const reservasTable = pgTable("reservas", {
  id: serial("id").primaryKey(),
  area_id: integer("area_id").notNull().references(() => areasTable.id),
  morador_id: integer("morador_id").notNull().references(() => moradoresTable.id),
  data_inicio: timestamp("data_inicio").notNull(),
  data_fim: timestamp("data_fim").notNull(),
  status: text("status").notNull().default("confirmada"),
  motivo: text("motivo"),
  num_pessoas: integer("num_pessoas"),
  valor_cobrado: text("valor_cobrado"),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertAreaSchema = createInsertSchema(areasTable).omit({ id: true, created_at: true });
export type InsertArea = z.infer<typeof insertAreaSchema>;
export type Area = typeof areasTable.$inferSelect;

export const insertReservaSchema = createInsertSchema(reservasTable).omit({ id: true, created_at: true });
export type InsertReserva = z.infer<typeof insertReservaSchema>;
export type Reserva = typeof reservasTable.$inferSelect;
