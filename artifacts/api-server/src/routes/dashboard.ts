import { Router } from "express";
import { db } from "@workspace/db";
import { encomendasTable, visitantesTable, ocorrenciasTable, financeiroTable, assembleiasTable, alertasDefcomTable, moradoresTable } from "@workspace/db";
import { eq, and, isNull, sql, gt, lt } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [
      encomendas_pendentes,
      visitantes_dentro,
      ocorrencias_abertas,
      inadimplentes,
      proxima_assembleia,
      financeiro_rows,
      alertas_criticos,
      total_moradores,
      reservas_hoje
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(encomendasTable).where(eq(encomendasTable.status_valido, "pendente")),
      db.select({ count: sql<number>`count(*)::int` }).from(visitantesTable).where(isNull(visitantesTable.saida)),
      db.select({ count: sql<number>`count(*)::int` }).from(ocorrenciasTable).where(eq(ocorrenciasTable.status, "aberta")),
      db.select({ count: sql<number>`count(*)::int` }).from(moradoresTable).where(eq(moradoresTable.status, "inadimplente")),
      db.select().from(assembleiasTable).where(eq(assembleiasTable.status, "agendada")).orderBy(assembleiasTable.data_realizacao).limit(1),
      db.select({ tipo: financeiroTable.tipo, valor: financeiroTable.valor }).from(financeiroTable).where(eq(financeiroTable.status, "pago")),
      db.select({ count: sql<number>`count(*)::int` }).from(alertasDefcomTable).where(and(eq(alertasDefcomTable.arquivado, false), sql`nivel_risco IN ('critico','alto')`)),
      db.select({ count: sql<number>`count(*)::int` }).from(moradoresTable).where(eq(moradoresTable.status, "ativo")),
      db.select({ count: sql<number>`count(*)::int` }).from(sql`reservas`.as("r")),
    ]);

    const receitas = financeiro_rows.filter(r => r.tipo === "receita").reduce((sum, r) => sum + (r.valor || 0), 0);
    const despesas = financeiro_rows.filter(r => r.tipo === "despesa").reduce((sum, r) => sum + (r.valor || 0), 0);

    res.json({
      encomendas_pendentes: encomendas_pendentes[0]?.count || 0,
      visitantes_dentro: visitantes_dentro[0]?.count || 0,
      ocorrencias_abertas: ocorrencias_abertas[0]?.count || 0,
      inadimplentes: inadimplentes[0]?.count || 0,
      proxima_assembleia: proxima_assembleia[0]?.data_realizacao?.toISOString() || null,
      saldo_caixa: receitas - despesas,
      alertas_criticos: alertas_criticos[0]?.count || 0,
      total_moradores: total_moradores[0]?.count || 0,
      reservas_hoje: 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
