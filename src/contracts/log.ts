export interface Log {
  systemId: string;
  systemName: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "view";
  entity: string;
  personaId: string;
  userId: string;
  userName: string;
  message: string;
  date: Date
  ip?: string
  userAgent?: string
}