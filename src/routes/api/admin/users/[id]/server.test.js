import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PUT, DELETE } from './+server.js';
import * as dbModule from '../../../../../lib/db.js'; // Import the entire module

// Mock the dbModule
vi.mock('../../../../../lib/db.js', () => ({
  getDbClient: vi.fn(), // Mock the getDbClient function
}));

describe('/api/admin/users/:id', () => {
  let mockClient;

  beforeEach(() => {
    // Reset mock client and its methods
    mockClient = {
      query: vi.fn(),
      end: vi.fn(),
    };

    // Mock the getDbClient function to return the mock client
    dbModule.getDbClient.mockReturnValue(mockClient);

    // Ensure all mocks are cleared before each test
    vi.clearAllMocks();
  });

  it('updates a user (PUT)', async () => {
    const mockUser = {
      nombre: 'Jane',
      apellido: 'Doe',
      numero_telefono: '0987654321',
      rol_id: 2,
      debe_cambiar_pin: false,
    };

    const mockRequest = { json: () => Promise.resolve(mockUser) };
    const params = { id: 1 };

    // Mock the query method to resolve successfully
    mockClient.query.mockResolvedValueOnce();

    const response = await PUT({ request: mockRequest, params });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('User updated successfully!');
    expect(mockClient.query).toHaveBeenCalledWith(
      `
      UPDATE usuarios 
      SET nombre = $1,
          apellido = $2,
          numero_telefono = $3,
          rol_id = $4,
          debe_cambiar_pin = $5,
          fecha_actualizacion = NOW()
      WHERE id = $6
      `,
      [
        'Jane',
        'Doe',
        '0987654321',
        2,
        false,
        1, // ID from params
      ]
    );
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.end).toHaveBeenCalledTimes(1); // Ensure the connection is closed
  });

  it('deletes a user (DELETE)', async () => {
    const params = { id: 1 };

    // Mock the query method to resolve successfully
    mockClient.query.mockResolvedValueOnce();

    const response = await DELETE({ params });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe('User deleted successfully!');
    expect(mockClient.query).toHaveBeenCalledWith(
      `
      DELETE FROM usuarios WHERE id = $1
      `,
      [1] // ID from params
    );
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.end).toHaveBeenCalledTimes(1); // Ensure the connection is closed
  });
});
