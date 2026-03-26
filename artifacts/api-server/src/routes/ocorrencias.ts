import { Router } from "express";
import { db } from "@workspace/db";
import { ocorrenciasTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/ocorrencias", async (req, res) => {
  try {
    const { tipo, status, prioridade } = req.query;
    let rows = await db.select().from(ocorrenciasTable).orderBy(sql`${ocorrenciasTable.created_at} DESC`);
    if (tipo) rows = rows.filter(r => r.tipo === tipo);
    if (status) rows = rows.filter(r => r.status === status);
    if (prioridade) rows = rows.filter(r => r.prioridade === prioridade);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ocorrencias", async (req, res) => {
  try {
    const [row] = await db.insert(ocorrenciasTable).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/ocorrencias/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.update(ocorrenciasTable).set({ ...req.body, updated_at: new Date() }).where(eq(ocorrenciasTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
