import { boolean, text, timestamp, varchar, pgTable, index } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const cursos = pgTable('cursos', {
  id: varchar('id').primaryKey(),
  titulo: varchar('titulo').notNull(),
  descripcion: text('descripcion').notNull(),
  contenido: text('contenido').notNull(),
  duracion: varchar('duracion').notNull(),
  instructor: varchar('instructor'),
  schedule: varchar('schedule'),
  location: varchar('location'),
  capacity: varchar('capacity'),
  image: text('image'),
  fecha: timestamp('fecha').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({ fechaIdx: index('cursos_fecha_idx').on(table.fecha) }))

export const publicaciones = pgTable('publicaciones', {
  id: varchar('id').primaryKey(),
  titulo: varchar('titulo').notNull(),
  descripcion: text('descripcion').notNull(),
  contenido: text('contenido').notNull(),
  category: varchar('category'),
  author: varchar('author'),
  image: text('image'),
  fecha: timestamp('fecha').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({ fechaIdx: index('publicaciones_fecha_idx').on(table.fecha) }))

export type CursoRow = typeof cursos.$inferSelect
export type PublicacionRow = typeof publicaciones.$inferSelect
