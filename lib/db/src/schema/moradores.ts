import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const moradoresTable = pgTable("moradores", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  apartamento: text("apartamento").notNull(),
  bloco: text("bloco").notNull(),
  telefone: text("telefone").notNull().unique(),
  email: text("email"),
  cpf: text("cpf"),
  veiculo_placa: text("veiculo_placa"),
  foto_url: text("foto_url"),
  status: text("status").notNull().default("ativo"),
  data_entrada: timestamp("data_entrada"),
  observacoes: text("observacoes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertMoradorSchema = createInsertSchema(moradoresTable).omit({ id: true, created_at: true });
export type InsertMorador = z.infer<typeof insertMoradorSchema>;
export type Morador = typeof moradoresTable.$inferSelect;
