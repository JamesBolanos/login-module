import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDbClient } from '../../../lib/db.js';
import { GET } from './+server.js';

vi.mock('@vercel/postgres', () => ({
  sql: vi.fn(),
}));

describe('/api/admin/roles', () => {
  beforeEach(() => {
    sql.mockClear();
  });

  it('fetches all roles (GET)', async () => {
    sql.mockResolvedValueOnce({
      rows: [
        { id: 1, nombre_rol: 'admin', descripcion: 'Administrator' },
        { id: 2, nombre_rol: 'user', descripcion: 'Regular user' },
      ],
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ nombre_rol: 'admin' });
    expect(sql).toHaveBeenCalledTimes(1);
  });
});
