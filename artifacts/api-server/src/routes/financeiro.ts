import { Router } from "express";
import { db } from "@workspace/db";
import { financeiroTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/financeiro/resumo", async (req, res) => {
  try {
    const rows = await db.select().from(financeiroTable);
    const receitas = rows.filter(r => r.tipo === "receita" && r.status === "pago").reduce((s, r) => s + (r.valor || 0), 0);
    const despesas = rows.filter(r => r.tipo === "despesa" && r.status === "pago").reduce((s, r) => s + (r.valor || 0), 0);
    const inadimplentes = rows.filter(r => r.tipo === "cobranca" && r.status === "vencido").length;
    const a_vencer = rows.filter(r => r.status === "pendente").length;
    res.json({ saldo: receitas - despesas, total_receitas: receitas, total_despesas: despesas, inadimplentes, a_vencer });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/financeiro", async (req, res) => {
  try {
    const { tipo, status, categoria, mes } = req.query;
    let rows = await db.select().from(financeiroTable).orderBy(sql`${financeiroTable.created_at} DESC`);
    if (tipo) rows = rows.filter(r => r.tipo === tipo);
    if (status) rows = rows.filter(r => r.status === status);
    if (categoria) rows = rows.filter(r => r.categoria === categoria);
    if (mes) rows = rows.filter(r => r.referencia_mes === mes);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/financeiro", async (req, res) => {
  try {
    const [row] = await db.insert(financeiroTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/financeiro/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.update(financeiroTable).set({ ...req.body, updated_at: new Date() }).where(eq(financeiroTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
