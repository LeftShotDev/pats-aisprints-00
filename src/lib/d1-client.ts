import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Param = string | number | boolean | null;
type D1Params = D1Param[];

/**
 * Normalizes anonymous `?` placeholders to positional `?1`, `?2`, ...
 * to avoid D1 binding errors in local development.
 */
function normalizeSql(sql: string, params: D1Params): { sql: string; params: D1Params } {
  let idx = 0;
  const normalizedSql = sql.replace(/\?(?!\d)/g, () => `?${++idx}`);
  return { sql: normalizedSql, params };
}

export async function getDatabase(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.quizmaker_app_database;
}

export async function executeQuery<T = Record<string, unknown>>(
  sql: string,
  params: D1Params = []
): Promise<T[]> {
  const db = await getDatabase();
  const { sql: normalizedSql, params: normalizedParams } = normalizeSql(sql, params);
  const result = await db.prepare(normalizedSql).bind(...normalizedParams).all<T>();
  return result.results;
}

/**
 * Returns the first row of a query result, or null if no rows found.
 * Prefer this over `.first()` to avoid D1 binding quirks in local dev.
 */
export async function executeQueryFirst<T = Record<string, unknown>>(
  sql: string,
  params: D1Params = []
): Promise<T | null> {
  const results = await executeQuery<T>(sql, params);
  return results[0] ?? null;
}

export async function executeMutation(
  sql: string,
  params: D1Params = []
): Promise<D1Result> {
  const db = await getDatabase();
  const { sql: normalizedSql, params: normalizedParams } = normalizeSql(sql, params);
  return db.prepare(normalizedSql).bind(...normalizedParams).run();
}

export async function executeBatch(
  statements: { sql: string; params?: D1Params }[]
): Promise<D1Result[]> {
  const db = await getDatabase();
  const stmts = statements.map(({ sql, params = [] }) => {
    const { sql: normalizedSql, params: normalizedParams } = normalizeSql(sql, params);
    return db.prepare(normalizedSql).bind(...normalizedParams);
  });
  return db.batch(stmts);
}

export function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
