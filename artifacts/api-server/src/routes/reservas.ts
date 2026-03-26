import { Router } from "express";
import { db } from "@workspace/db";
import { areasTable, reservasTable, moradoresTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/areas", async (req, res) => {
  try {
    const rows = await db.select().from(areasTable).orderBy(areasTable.nome);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/reservas", async (req, res) => {
  try {
    const { area_id, status } = req.query;
    const rows = await db.select({
      id: reservasTable.id,
      area_id: reservasTable.area_id,
      morador_id: reservasTable.morador_id,
      data_inicio: reservasTable.data_inicio,
      data_fim: reservasTable.data_fim,
      status: reservasTable.status,
      motivo: reservasTable.motivo,
      num_pessoas: reservasTable.num_pessoas,
      valor_cobrado: reservasTable.valor_cobrado,
      observacoes: reservasTable.observacoes,
      created_at: reservasTable.created_at,
      area_nome: areasTable.nome,
      morador_nome: moradoresTable.nome,
      morador_apartamento: moradoresTable.apartamento,
    }).from(reservasTable)
      .leftJoin(areasTable, eq(reservasTable.area_id, areasTable.id))
      .leftJoin(moradoresTable, eq(reservasTable.morador_id, moradoresTable.id))
      .orderBy(sql`${reservasTable.data_inicio} DESC`);
    let result = rows;
    if (area_id) result = result.filter(r => r.area_id === parseInt(area_id as string));
    if (status) result = result.filter(r => r.status === status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reservas", async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.data_inicio) data.data_inicio = new Date(data.data_inicio);
    if (data.data_fim) data.data_fim = new Date(data.data_fim);
    const [row] = await db.insert(reservasTable).values(data).returning();
    const [full] = await db.select({
      id: reservasTable.id,
      area_id: reservasTable.area_id,
      morador_id: reservasTable.morador_id,
      data_inicio: reservasTable.data_inicio,
      data_fim: reservasTable.data_fim,
      status: reservasTable.status,
      motivo: reservasTable.motivo,
      num_pessoas: reservasTable.num_pessoas,
      valor_cobrado: reservasTable.valor_cobrado,
      observacoes: reservasTable.observacoes,
      created_at: reservasTable.created_at,
      area_nome: areasTable.nome,
      morador_nome: moradoresTable.nome,
      morador_apartamento: moradoresTable.apartamento,
    }).from(reservasTable)
      .leftJoin(areasTable, eq(reservasTable.area_id, areasTable.id))
      .leftJoin(moradoresTable, eq(reservasTable.morador_id, moradoresTable.id))
      .where(eq(reservasTable.id, row.id));
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/reservas/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.update(reservasTable).set({ ...req.body, updated_at: new Date() }).where(eq(reservasTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
