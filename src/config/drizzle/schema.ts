import { 
  int, 
  mysqlTable, 
  serial, 
  varchar, 
  mysqlEnum, 
  text, 
  datetime 
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientsTable = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),

  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  cpf: varchar("cpf", { length: 11 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  role: mysqlEnum("role", ["super_admin", "admin", "member"]).notNull(),

  clientId: int("client_id")
    .notNull()
    .references(() => clientsTable.id, { onDelete: "cascade" }),

  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const apisTable = mysqlTable("apis", {
  id: int("id").primaryKey().autoincrement(),

  clientId: int("client_id")
    .notNull()
    .references(() => clientsTable.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 255 }).notNull(),

  token: varchar("token", { length: 255 }).notNull().unique(),

  status: mysqlEnum("status", ["active", "revoked"])
    .default("active")
    .notNull(),

  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sessionsTable = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement(),

  token: varchar("token", { length: 255 }).notNull().unique(),

  status: mysqlEnum("status", ["active", "revoked"])
    .default("active")
    .notNull(),

  expiresAt: datetime("expires_at"),

  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),

  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
