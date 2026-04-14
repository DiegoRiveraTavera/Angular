-- Script SQL para PostgreSQL: Maquetado de la base de datos para el ERP
-- Basado en los modelos: User, Group, Ticket

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE ,
    calle VARCHAR(255) ,
    colonia VARCHAR(255) ,
    no_exterior VARCHAR(50),
    telefono VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de permisos
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_key VARCHAR(100) UNIQUE , -- Ej: 'user:ver'
    module VARCHAR(100) , -- Ej: 'Usuarios', 'Grupos'
    description VARCHAR(255)
);

-- Crear tabla intermedia para permisos de usuarios (relación many-to-many)
CREATE TABLE IF NOT EXISTS user_permissions (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, permission_id)
);

-- Crear tabla de grupos
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) ,
    level VARCHAR(100) , -- Básico, Intermedio, Avanzado, etc.
    author VARCHAR(255) , -- Nombre del creador
    members_count INTEGER DEFAULT 0,
    tickets_count INTEGER DEFAULT 0,
    description TEXT
);

-- Crear tabla intermedia para membresía de grupos (many-to-many usuario <-> grupo)
CREATE TABLE IF NOT EXISTS user_groups (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- Crear tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'abierto',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_permissions_key ON permissions(permission_key);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission_id ON user_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_groups_level ON groups(level);
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_group_id ON tickets(group_id);

-- Insertar permisos disponibles
INSERT INTO permissions (permission_key, module, description) VALUES
-- Usuarios
('user:ver', 'Usuarios', 'Ver usuarios'),
('user:editar', 'Usuarios', 'Editar usuarios'),
('user:crear', 'Usuarios', 'Crear usuarios'),
('user:eliminar', 'Usuarios', 'Eliminar usuarios'),
-- Grupos
('grupos:ver', 'Grupos', 'Ver grupos'),
('grupos:agre', 'Grupos', 'Agregar grupos'),
('grupos:eliminar', 'Grupos', 'Eliminar grupos'),
('grupos:editar', 'Grupos', 'Editar grupos'),
-- Tickets
('tickets:ver', 'Tickets', 'Ver tickets'),
('tickets:agre', 'Tickets', 'Agregar tickets'),
('tickets:eliminar', 'Tickets', 'Eliminar tickets'),
('tickets:editar', 'Tickets', 'Editar tickets'),
('tickets:cambiar_estado', 'Tickets', 'Cambiar estado de tickets'),
-- Reportes
('reportes:ver', 'Reportes', 'Ver reportes'),
('reportes:descargar', 'Reportes', 'Descargar reportes'),
('reportes:crear', 'Reportes', 'Crear reportes')
ON CONFLICT (permission_key) DO NOTHING;

-- Insertar usuarios de ejemplo
INSERT INTO users (name, email, active) VALUES
('Admin User', 'admin@test.com', true),
('Juan Pérez', 'juan@test.com', true),
('Laura Gómez', 'laura@test.com', true),
('Carlos Rodríguez', 'carlos@test.com', true),
('Ana López', 'ana@test.com', false);

-- Asignar permisos a usuarios (usando la tabla intermedia)
-- Admin User: todos los permisos
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u, permissions p
WHERE u.email = 'admin@test.com';

-- Juan Pérez: permisos limitados
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u, permissions p
WHERE u.email = 'juan@test.com' AND p.permission_key IN ('user:ver', 'grupos:ver', 'tickets:ver', 'tickets:editar');

-- Laura Gómez: permisos de grupos y tickets
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u, permissions p
WHERE u.email = 'laura@test.com' AND p.permission_key IN ('user:ver', 'grupos:ver', 'grupos:editar', 'tickets:ver', 'tickets:agre', 'tickets:editar');

-- Carlos Rodríguez: solo ver usuarios y tickets
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u, permissions p
WHERE u.email = 'carlos@test.com' AND p.permission_key IN ('user:ver', 'tickets:ver');

-- Ana López: permisos de ver y reportes
INSERT INTO user_permissions (user_id, permission_id)
SELECT u.id, p.id
FROM users u, permissions p
WHERE u.email = 'ana@test.com' AND p.permission_key IN ('user:ver', 'grupos:ver', 'reportes:ver');

-- Grupos de ejemplo
INSERT INTO groups (name, level, author, members_count, tickets_count, description) VALUES
('Grupo Angular', 'Básico', 'Juan Pérez', 10, 3, 'Grupo de introducción a Angular'),
('Grupo PrimeNG', 'Intermedio', 'Laura Gómez', 8, 12, 'Componentes avanzados con PrimeNG'),
('Grupo TypeScript', 'Avanzado', 'Carlos Rodríguez', 5, 7, 'Conceptos avanzados de TypeScript'),
('Grupo Seguridad', 'Intermedio', 'Ana López', 15, 20, 'Seguridad en aplicaciones web');

-- Usuarios en grupos (many-to-many)
INSERT INTO user_groups (user_id, group_id) VALUES
((SELECT id FROM users WHERE email = 'admin@test.com'), (SELECT id FROM groups WHERE name='Grupo Angular')),
((SELECT id FROM users WHERE email = 'admin@test.com'), (SELECT id FROM groups WHERE name='Grupo PrimeNG')),
((SELECT id FROM users WHERE email = 'juan@test.com'), (SELECT id FROM groups WHERE name='Grupo Angular')),
((SELECT id FROM users WHERE email = 'laura@test.com'), (SELECT id FROM groups WHERE name='Grupo PrimeNG')),
((SELECT id FROM users WHERE email = 'carlos@test.com'), (SELECT id FROM groups WHERE name='Grupo TypeScript')),
((SELECT id FROM users WHERE email = 'ana@test.com'), (SELECT id FROM groups WHERE name='Grupo Seguridad'));

-- Tickets de ejemplo (usando IDs de usuarios existentes y grupo)
INSERT INTO tickets (title, description, status, created_by, assigned_to, group_id) VALUES
('Error en login', 'El usuario no puede iniciar sesión con credenciales válidas', 'en_progreso', (SELECT id FROM users WHERE email = 'juan@test.com'), (SELECT id FROM users WHERE email = 'laura@test.com'), (SELECT id FROM groups WHERE name='Grupo Angular')),
('Mejora en UI de grupos', 'Solicitud para mejorar la interfaz de gestión de grupos', 'abierto', (SELECT id FROM users WHERE email = 'laura@test.com'), NULL, (SELECT id FROM groups WHERE name='Grupo PrimeNG')),
('Bug en permisos', 'Los permisos no se aplican correctamente en algunos casos', 'cerrado', (SELECT id FROM users WHERE email = 'carlos@test.com'), (SELECT id FROM users WHERE email = 'admin@test.com'), (SELECT id FROM groups WHERE name='Grupo TypeScript')),
('Nueva funcionalidad de reportes', 'Implementar generación automática de reportes', 'abierto', (SELECT id FROM users WHERE email = 'ana@test.com'), (SELECT id FROM users WHERE email = 'juan@test.com'), (SELECT id FROM groups WHERE name='Grupo Seguridad')),
('Optimización de base de datos', 'Mejorar rendimiento de consultas en la base de datos', 'en_progreso', (SELECT id FROM users WHERE email = 'admin@test.com'), (SELECT id FROM users WHERE email = 'carlos@test.com'), (SELECT id FROM groups WHERE name='Grupo TypeScript'));

-- Actualizar contadores de tickets en grupos (simular datos)
UPDATE groups SET tickets_count = (
    SELECT COUNT(*) FROM tickets WHERE status != 'cerrado'
) WHERE name = 'Grupo Angular';

UPDATE groups SET tickets_count = (
    SELECT COUNT(*) FROM tickets WHERE status != 'cerrado'
) WHERE name = 'Grupo PrimeNG';

-- Trigger para actualizar updated_at en tickets
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();