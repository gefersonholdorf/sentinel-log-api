# SentinelLog — Plataforma Centralizada de Logs de Ações do Usuário

## 📌 Visão Geral

**SentinelLog** é uma **plataforma centralizada de observabilidade**, projetada para **coletar, processar, persistir e consultar logs de ações do usuário** em múltiplas APIs de diferentes personas (clientes, produtos ou organizações).  

O sistema atua como um **hub assíncrono e escalável**, permitindo que aplicações integradas enviem eventos de forma confiável sem impactar a performance, garantindo histórico completo, segurança e auditabilidade.

**Arquitetura:**
- **Gateway HTTP** para ingestão de logs de forma leve e segura  
- **Broker RabbitMQ** para filas duráveis e tolerantes a falhas  
- **Worker** de persistência contínua  
- **Banco de dados NoSQL** para consultas rápidas e eficientes  
- **Painel administrativo por persona**, com dashboards, filtros e auditoria  

---

## 📌 Problema a Ser Resolvido

Ambientes com múltiplas APIs ou microserviços enfrentam desafios significativos:

- Falta de centralização de logs de ações do usuário;  
- Lentidão no registro de eventos quando feito de forma síncrona;  
- Ausência de histórico consolidado para auditoria e análise;  
- Risco de perda de dados em caso de falhas nos sistemas;  
- Dificuldade para correlacionar logs por persona ou usuário;  
- Segurança e isolamento insuficientes entre clientes;  
- Impacto negativo no diagnóstico de problemas e eficiência operacional.  

**Consequência:** dificuldade em rastrear ações, realizar auditorias e manter sistemas confiáveis.

---

## 📌 Solução Proposta

O **SentinelLog** implementa um **pipeline assíncrono e resiliente** para logs de ações do usuário:

1. APIs enviam logs ao **Gateway HTTP** (`POST /logs`) com **token exclusivo da persona**;  
2. O Gateway valida a **persona** e a **API emissora**;  
3. O log é enviado para o **RabbitMQ** com **persistência garantida**;  
4. O **Worker** consome a fila e grava os dados de forma segura no banco NoSQL;  
5. A **interface administrativa** permite consultas detalhadas, filtros avançados, dashboards e exportação de logs.

**Benefícios:**  

- Registro **assíncrono**, sem impactar as APIs clientes;  
- **Tolerância a falhas** via filas persistentes;  
- **Segregação completa** entre personas;  
- **Alta performance**, suportando milhares de eventos por segundo;  
- **Segurança e integridade**, garantindo que logs não sejam alterados após persistência.

---

## 📌 Requisitos Funcionais (RF)

| Código | Descrição | Prioridade |
|--------|-----------|------------|
| RF01 | Receber logs de ações do usuário via API HTTP (`POST /logs`) | Alta |
| RF02 | Validar token da persona antes de aceitar o log | Alta |
| RF03 | Enviar logs para filas persistentes no RabbitMQ | Alta |
| RF04 | Persistir logs no banco NoSQL de forma confiável | Alta |
| RF05 | Permitir consulta de logs por filtros avançados (persona, usuário, ação, data, status) | Alta |
| RF06 | Oferecer dashboards com métricas e gráficos de ações do usuário | Média |
| RF07 | Permitir exportação de logs para sistemas externos | Média |
| RF08 | Registrar informações de auditoria (IP, timestamp, origem da API, contexto da ação) | Alta |
| RF09 | Suportar múltiplos workers e gateways para escalabilidade horizontal | Alta |
| RF10 | Garantir segregação de dados por persona | Alta |

---

## 📌 Requisitos Não Funcionais (RNF)

| Código | Descrição | Observações |
|--------|-----------|-------------|
| RNF01 | **Escalabilidade**: Suporte a múltiplos gateways e workers | Crescimento horizontal |
| RNF02 | **Desempenho**: Resposta HTTP < 50ms | Independente do processamento posterior |
| RNF03 | **Tolerância a Falhas**: Filas duráveis, mensagens persistentes, ACK manual | Minimizar risco de perda de dados |
| RNF04 | **Segurança**: Tokens fortes (JWT ou chave privada), TLS obrigatório | Isolamento total entre personas |
| RNF05 | **Integridade**: Logs imutáveis após persistência | Auditoria confiável |
| RNF06 | **Alta Disponibilidade**: Workers distribuídos e redundantes | Evitar downtime |
| RNF07 | **Armazenamento Não Relacional**: Banco NoSQL (MongoDB, DocumentDB, etc.) | Consultas rápidas e escaláveis |
| RNF08 | **Auditabilidade**: Registro completo de origem, IP, timestamp e contexto | Conformidade regulatória |

---

## 📌 Funcionalidades Principais

1. **Ingestão Assíncrona de Logs**  
   Recebimento rápido de logs de ações do usuário via Gateway HTTP, sem impacto na aplicação cliente.

2. **Persistência Confiável**  
   Worker dedicado garante gravação segura e integridade dos eventos.

3. **Segregação Multi-Persona**  
   Histórico de logs isolado por persona, com tokens exclusivos e controle de acesso.

4. **Consultas Avançadas e Dashboard**  
   Filtros por persona, usuário, ação, data e contexto; gráficos de métricas e tabelas interativas com paginação.

5. **Auditoria Completa**  
   Registro de IP, timestamp, origem da API e detalhes da ação do usuário.

6. **Exportação de Logs**  
   Possibilidade de exportar logs para integração com outros sistemas ou análise offline.

7. **Alta Performance e Escalabilidade**  
   Suporta milhares de eventos por segundo com processamento assíncrono e workers distribuídos.