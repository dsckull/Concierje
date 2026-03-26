import { Router } from "express";
import { db } from "@workspace/db";
import { visitantesTable } from "@workspace/db";
import { eq, isNull, sql } from "drizzle-orm";

const router = Router();

router.get("/visitantes", async (req, res) => {
  try {
    const { tipo, dentro } = req.query;
    let query = db.select().from(visitantesTable).orderBy(sql`${visitantesTable.entrada} DESC`);
    const rows = await query;
    let result = rows;
    if (tipo) result = result.filter(r => r.tipo === tipo);
    if (dentro === "true") result = result.filter(r => !r.saida);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/visitantes", async (req, res) => {
  try {
    const data = req.body;
    const [row] = await db.insert(visitantesTable).values(data).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/visitantes/:id/saida", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db.update(visitantesTable).set({ saida: new Date() }).where(eq(visitantesTable.id, id)).returning();
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
