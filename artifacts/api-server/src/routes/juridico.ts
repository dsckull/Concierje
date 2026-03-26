import { Router } from "express";
import { db } from "@workspace/db";
import { documentosTable, notificacoesJuridicasTable, moradoresTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/juridico/documentos", async (req, res) => {
  try {
    const rows = await db.select().from(documentosTable).orderBy(sql`${documentosTable.created_at} DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/juridico/documentos", async (req, res) => {
  try {
    const [row] = await db.insert(documentosTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/juridico/notificacoes", async (req, res) => {
  try {
    const { status, tipo } = req.query;
    const rows = await db.select({
      id: notificacoesJuridicasTable.id,
      morador_id: notificacoesJuridicasTable.morador_id,
      tipo: notificacoesJuridicasTable.tipo,
      titulo: notificacoesJuridicasTable.titulo,
      descricao: notificacoesJuridicasTable.descricao,
      valor_multa: notificacoesJuridicasTable.valor_multa,
      status: notificacoesJuridicasTable.status,
      data_prazo: notificacoesJuridicasTable.data_prazo,
      data_resolucao: notificacoesJuridicasTable.data_resolucao,
      artigo_regimento: notificacoesJuridicasTable.artigo_regimento,
      comprovante_url: notificacoesJuridicasTable.comprovante_url,
      created_at: notificacoesJuridicasTable.created_at,
      morador_nome: moradoresTable.nome,
      morador_apartamento: moradoresTable.apartamento,
    }).from(notificacoesJuridicasTable)
      .leftJoin(moradoresTable, eq(notificacoesJuridicasTable.morador_id, moradoresTable.id))
      .orderBy(sql`${notificacoesJuridicasTable.created_at} DESC`);
    let result = rows;
    if (status) result = result.filter(r => r.status === status);
    if (tipo) result = result.filter(r => r.tipo === tipo);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/juridico/notificacoes", async (req, res) => {
  try {
    const [row] = await db.insert(notificacoesJuridicasTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/juridico/notificacoes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.update(notificacoesJuridicasTable).set({ ...req.body, updated_at: new Date() }).where(eq(notificacoesJuridicasTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
