import { db } from "./src";
import { moradoresTable, encomendasTable, visitantesTable, ocorrenciasTable, financeiroTable, assembleiasTable, areasTable, reservasTable, documentosTable, notificacoesJuridicasTable, alertasDefcomTable } from "./src/schema";

async function seed() {
  console.log("🌱 Iniciando seed de dados...");

  // Limpar tabelas (opcional)
  // await db.delete(moradoresTable);

  // Moradores
  const morador1 = await db.insert(moradoresTable).values({ nome: "Ana Paula Ferreira", apartamento: "101", bloco: "A", telefone: "11999998888", email: "ana@email.com", status: "ativo", data_entrada: new Date("2023-01-15") }).returning();
  const morador2 = await db.insert(moradoresTable).values({ nome: "Carlos Mendes", apartamento: "202", bloco: "A", telefone: "11999997777", email: "carlos@email.com", status: "ativo", data_entrada: new Date("2023-03-20") }).returning();
  const morador3 = await db.insert(moradoresTable).values({ nome: "Mariana Costa", apartamento: "303", bloco: "B", telefone: "11999996666", email: "mariana@email.com", status: "inadimplente", data_entrada: new Date("2022-06-10") }).returning();
  const morador4 = await db.insert(moradoresTable).values({ nome: "João Oliveira", apartamento: "405", bloco: "B", telefone: "11999995555", email: "joao@email.com", status: "ativo", data_entrada: new Date("2024-01-05") }).returning();

  // Encomendas
  await db.insert(encomendasTable).values([
    { codigo_rastreio: "BR123456789", morador_id: morador1[0]!.id, status_valido: "pendente", data_recebimento: new Date(), plataforma: "Correios" },
    { codigo_rastreio: "BR987654321", morador_id: morador2[0]!.id, status_valido: "notificado", data_recebimento: new Date(Date.now() - 86400000), plataforma: "Shopee" },
    { codigo_rastreio: "BR456789123", morador_id: morador3[0]!.id, status_valido: "retirado", data_recebimento: new Date(Date.now() - 172800000), plataforma: "Mercado Livre" },
    { codigo_rastreio: "BR789123456", morador_id: morador4[0]!.id, status_valido: "pendente", data_recebimento: new Date(Date.now() - 259200000), plataforma: "Correios" },
  ]);

  // Visitantes
  await db.insert(visitantesTable).values([
    { nome: "Pedro Silva", destino_apartamento: "101", destino_bloco: "A", tipo: "visitante", motivo: "visita", entrada: new Date(Date.now() - 3600000), autorizado_por: "Ana Paula" },
    { nome: "Marcos Delivery", destino_apartamento: "202", destino_bloco: "A", tipo: "entregador", motivo: "entrega", entrada: new Date(Date.now() - 7200000), saida: new Date(Date.now() - 6300000) },
    { nome: "Técnico Elétrica+", destino_apartamento: "303", destino_bloco: "B", tipo: "tecnico", motivo: "manutenção", entrada: new Date(Date.now() - 10800000), saida: new Date(Date.now() - 9000000) },
  ]);

  // Ocorrências
  await db.insert(ocorrenciasTable).values([
    { titulo: "Vazamento no apartamento 101", descricao: "Vazamento detectado na cozinha. Água caindo para o apto 001 abaixo.", tipo: "manutencao", prioridade: "urgente", status: "aberta", morador_id: morador1[0]!.id, area: "Cozinha" },
    { titulo: "Luz intermitente no corredor", descricao: "Luz do corredor piscando constantemente.", tipo: "manutencao", prioridade: "normal", status: "em_andamento", area: "Corredor Bloco A" },
    { titulo: "Barulho excessivo no apto 202", descricao: "Música alta durante madrugada. Reclamação de vizinhos.", tipo: "reclamacao", prioridade: "alta", status: "aberta", morador_id: morador2[0]!.id },
  ]);

  // Financeiro
  await db.insert(financeiroTable).values([
    { tipo: "receita", descricao: "Cota condominial - Março 2026", valor: 500.00, categoria: "cotas", status: "pago", data_vencimento: new Date("2026-03-10"), morador_id: morador1[0]!.id, referencia_mes: "2026-03" },
    { tipo: "receita", descricao: "Cota condominial - Março 2026", valor: 500.00, categoria: "cotas", status: "pago", data_vencimento: new Date("2026-03-10"), morador_id: morador2[0]!.id, referencia_mes: "2026-03" },
    { tipo: "receita", descricao: "Cota condominial - Março 2026", valor: 500.00, categoria: "cotas", status: "vencido", data_vencimento: new Date("2026-03-10"), morador_id: morador3[0]!.id, referencia_mes: "2026-03" },
    { tipo: "despesa", descricao: "Limpeza da fachada", valor: 2500.00, categoria: "manutencao", status: "pago", data_vencimento: new Date("2026-03-20") },
    { tipo: "despesa", descricao: "Conta de energia", valor: 1800.00, categoria: "utilidades", status: "pendente", data_vencimento: new Date("2026-04-05") },
    { tipo: "cobranca", descricao: "Multa por atraso na cota - Apto 303", valor: 150.00, categoria: "multas", status: "pendente", morador_id: morador3[0]!.id },
  ]);

  // Áreas Comuns
  const area1 = await db.insert(areasTable).values({ nome: "Piscina", descricao: "Piscina aquecida com 25m de comprimento", capacidade: 50, valor_hora: "150" }).returning();
  const area2 = await db.insert(areasTable).values({ nome: "Salão de Festas", descricao: "Salão com capacidade para 100 pessoas", capacidade: 100, valor_hora: "300" }).returning();
  const area3 = await db.insert(areasTable).values({ nome: "Quadra de Tênis", descricao: "Quadra coberta com piso de borracha", capacidade: 4, valor_hora: "80" }).returning();

  // Reservas
  await db.insert(reservasTable).values([
    { area_id: area1[0]!.id, morador_id: morador1[0]!.id, data_inicio: new Date("2026-04-10T14:00"), data_fim: new Date("2026-04-10T16:00"), status: "confirmada", motivo: "Nado livre" },
    { area_id: area2[0]!.id, morador_id: morador2[0]!.id, data_inicio: new Date("2026-04-15T19:00"), data_fim: new Date("2026-04-16T02:00"), status: "confirmada", motivo: "Aniversário" },
    { area_id: area3[0]!.id, morador_id: morador4[0]!.id, data_inicio: new Date("2026-04-12T09:00"), data_fim: new Date("2026-04-12T11:00"), status: "pendente", motivo: "Treino de tênis" },
  ]);

  // Assembleias
  const asm1 = await db.insert(assembleiasTable).values({ titulo: "Assembleia Ordinária - Aprovação de Reformas", tipo: "ordinaria", descricao: "Votação para reforma da fachada e cobertura da piscina", data_realizacao: new Date("2026-04-20T19:00"), local: "online", link_reuniao: "https://meet.google.com/xyz", status: "agendada", quorum_minimo: 20 }).returning();

  // Documentos Jurídicos
  await db.insert(documentosTable).values([
    { titulo: "Regimento Interno", tipo: "regulamento", versao: "3.1", vigente: "sim" },
    { titulo: "Convenção do Condomínio", tipo: "convencao", versao: "2.0", vigente: "sim" },
    { titulo: "Política de Ruído", tipo: "regulamento", versao: "1.5", vigente: "sim" },
  ]);

  // Notificações Jurídicas
  await db.insert(notificacoesJuridicasTable).values([
    { morador_id: morador3[0]!.id, tipo: "multa", titulo: "Multa por atraso em cotas", descricao: "Conforme Art. 5º do Regimento, multa por atraso em pagamento de cota condominial", valor_multa: 150.00, status: "enviada", data_prazo: new Date("2026-04-10"), artigo_regimento: "Art. 5º" },
    { morador_id: morador2[0]!.id, tipo: "notificacao", titulo: "Notificação por ruído excessivo", descricao: "Conforme relato de vizinhos, música alta após 22h em violação à Política de Ruído", status: "contestada", artigo_regimento: "Art. 12º" },
  ]);

  // Alertas DefCom
  await db.insert(alertasDefcomTable).values([
    { nivel_risco: "critico", tipo_ameaca: "Tentativa de invasão", descricao: "Movimento suspeito detectado pela câmera de segurança no portão principal", data_alerta: new Date(Date.now() - 300000), arquivado: false, autoridades_acionadas: true },
    { nivel_risco: "alto", tipo_ameaca: "Veículo não registrado", descricao: "Veículo estranho estacionado na garagem por mais de 2 horas", data_alerta: new Date(Date.now() - 3600000), arquivado: false, autoridades_acionadas: false },
    { nivel_risco: "medio", tipo_ameaca: "Comportamento suspeito", descricao: "Pessoa desconhecida vista no saguão principal", data_alerta: new Date(Date.now() - 7200000), arquivado: true, autoridades_acionadas: false },
    { nivel_risco: "baixo", tipo_ameaca: "Aviso de manutenção", descricao: "Manutenção programada do sistema de vigilância para hoje à noite", data_alerta: new Date(Date.now() - 86400000), arquivado: false, autoridades_acionadas: false },
  ]);

  console.log("✅ Seed concluído com sucesso!");
}

seed().catch(err => {
  console.error("❌ Erro ao fazer seed:", err);
  process.exit(1);
});
