# SentinelLog — Plataforma Centralizada de Logs

## 📌 Descrição do Sistema

**SentinelLog** é uma plataforma centralizada para **coleta, processamento, persistência e consulta de logs** provenientes de múltiplas APIs pertencentes a diferentes *personas* (clientes, produtos ou organizações).

O sistema funciona como um **hub de observabilidade leve, escalável e independente**, permitindo que qualquer aplicação integrada envie eventos de forma assíncrona e confiável, sem impacto na performance.

A arquitetura é composta por:

- **Gateway HTTP** para ingestão de logs  
- **Broker RabbitMQ** para filas duráveis  
- **Worker** de persistência contínua  
- **Banco NoSQL** para consultas rápidas  
- **Painel administrativo por persona**, com filtros, gráficos e auditoria  

---

## 📌 Problema Principal

Ambientes com diversas APIs, microserviços ou sistemas independentes sofrem com:

- dificuldade para centralizar logs;  
- lentidão ao registrar eventos de forma síncrona;  
- ausência de histórico consolidado;  
- falta de segurança no armazenamento de eventos sensíveis;  
- dificuldade de correlacionar logs por cliente/persona;  
- risco de perda de dados em quedas de serviço;  
- falta de auditoria e rastreabilidade.

Esses problemas resultam em **diagnósticos lentos, indisponibilidade e baixa eficiência operacional**.

---

## 📌 Solução Proposta

O **SentinelLog** cria um pipeline assíncrono, resiliente e escalável para tratamento de logs:

1. APIs enviam logs ao **Gateway** (`POST /logs`) usando **token exclusivo da persona**.  
2. O Gateway valida a persona e a API emissora.  
3. O log é enviado ao **RabbitMQ** com **persistência garantida**.  
4. O **Worker** consome e grava os dados no banco NoSQL.  
5. A **interface administrativa** permite consultas, filtros, gráficos e exportação.

Essa arquitetura garante:

- **zero impacto** nas APIs clientes  
- **tolerância a falhas** por meio de filas persistentes  
- **alto throughput**, suportando milhares de eventos/segundo  
- **isolamento e segurança** entre personas  

---

## 📌 Requisitos Não Funcionais (RNF)

### **RNF01 — Escalabilidade**
A ingestão de logs deve suportar crescimento horizontal, com múltiplos gateways e múltiplos workers.  
**Status:** []  
**Observações:** []

### **RNF02 — Desempenho**
A resposta da rota HTTP deve ocorrer em até **< 50ms**, independentemente do processamento posterior.  
**Status:** []  
**Observações:** []

### **RNF03 — Tolerância a Falhas**
As mensagens devem sobreviver a quedas utilizando:  
- filas duráveis  
- mensagens persistentes  
- ACK manual  
**Status:** []  
**Observações:** []

### **RNF04 — Segurança**
- Tokens fortes (JWT ou chave privada).  
- TLS obrigatório na ingestão.  
- Isolamento total entre personas.  
**Status:** []  
**Observações:** []

### **RNF05 — Integridade**
Nenhum log pode ser alterado após persistência.  
**Status:** []  
**Observações:** []

### **RNF06 — Alta Disponibilidade**
O sistema deve permitir execução distribuída de múltiplos workers simultâneos.  
**Status:** []  
**Observações:** []

### **RNF07 — Armazenamento Não Relacional**
O banco utilizado deve ser **NoSQL** (MongoDB, DocumentDB, etc.).  
**Status:** []  
**Observações:** []

---

## 📌 Funcionalidades Principais

### **1. Ingestão Assíncrona de Logs**
Gateway leve que recebe logs e envia imediatamente para uma fila persistente.

### **2. Persistência Confiável**
Worker dedicado grava de forma segura e garante integridade do evento.

### **3. Segregação Multi-Persona**
Cada persona possui suas APIs, tokens e históricos completamente isolados.

### **4. Dashboard e Consultas Avançadas**
- busca por filtros complexos  
- visualização em tabela  
- gráficos rápidos  
- ordenação e paginação avançada  

### **5. Auditoria e Segurança**
Registros contendo origem, IP, timestamps, nível e contexto do evento.

### **6. Exportação de Resultados**
Logs podem ser exportados para integrações externas.

### **7. Alta Performance**
Capaz de registrar milhares de eventos por segundo sem prejudicar sistemas externos.

---

