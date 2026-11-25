-- =========================================================
-- 0. LIMPIAR TABLAS Y REINICIAR IDS A 1
-- =========================================================
DO $$
DECLARE
tablas TEXT;
BEGIN
SELECT string_agg(format('%I.%I', schemaname, tablename), ', ')
INTO tablas
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename <> 'spatial_ref_sys';

IF tablas IS NOT NULL THEN
        EXECUTE 'TRUNCATE TABLE ' || tablas || ' RESTART IDENTITY CASCADE;';
END IF;
END $$;

-- =========================================================
-- 1. MACRODISTRITOS DE LA PAZ (IDs 1 al 9)
-- =========================================================
INSERT INTO macrodistritos (nombre) VALUES
                                        ('Cotahuma'),      -- 1
                                        ('Max Paredes'),   -- 2
                                        ('Periférica'),    -- 3
                                        ('San Antonio'),   -- 4
                                        ('Sur'),           -- 5
                                        ('Mallasa'),       -- 6
                                        ('Centro'),        -- 7
                                        ('Hampaturi'),     -- 8
                                        ('Zongo');         -- 9

-- =========================================================
-- 2. USUARIOS (IDs 1 al 6)
-- =========================================================
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
                                                         ('Juan Ciudadano', 'ciudadano@sismopaz.bo', '123456', 'CIUDADANO'),      -- 1
                                                         ('Dra. Ana Sismóloga', 'sismologo@sismopaz.bo', '123456', 'SISMOLOGO'),  -- 2
                                                         ('Carlos Admin', 'admin@sismopaz.bo', '123456', 'ADMINISTRADOR'),        -- 3
                                                         ('María Quispe', 'maria@sismopaz.bo', '123456', 'CIUDADANO'),            -- 4
                                                         ('Luis Mamani', 'luis@sismopaz.bo', '123456', 'CIUDADANO'),              -- 5
                                                         ('Ing. Roberto Vega', 'roberto@sismopaz.bo', '123456', 'SISMOLOGO');     -- 6

-- =========================================================
-- 3. DIRECTORIO DE EMERGENCIAS (10)
-- =========================================================
INSERT INTO directorio_emergencia (entidad, servicio, telefono, habilitado) VALUES
                                                                                ('Bomberos Antofagasta', 'Rescate Urbano, Incendios y Estructuras Colapsadas', '119', true),
                                                                                ('Policía Boliviana (PAC)', 'Patrullaje y Auxilio Inmediato', '110', true),
                                                                                ('Red Municipal de Emergencias (GAMLP)', 'Atención de Riesgos, Sismos y Deslizamientos', '114', true),
                                                                                ('Cruz Roja Boliviana - La Paz', 'Primeros Auxilios y Traslado en Ambulancia', '165', true),
                                                                                ('SAR-FAB Illimani', 'Búsqueda y Rescate en Zonas de Difícil Acceso', '2242222', true),
                                                                                ('Hospital de Clínicas', 'Emergencias Médicas y Trauma (Miraflores)', '2229180', true),
                                                                                ('Hospital Municipal Los Pinos', 'Emergencias Médicas Zona Sur', '2792211', true),
                                                                                ('Defensa Civil (VIDECI)', 'Coordinación Nacional de Desastres', '800101104', true),
                                                                                ('DELAPAZ Emergencias', 'Corte de Energía y Cables Caídos', '800173333', true),
                                                                                ('EPSAS Emergencias', 'Ruptura de Tuberías y Fugas de Agua', '800108844', true);

-- =========================================================
-- 4. PUNTOS DE EVACUACIÓN EN LA PAZ (12 - PostGIS)
-- =========================================================
INSERT INTO puntos_evacuacion (nombre, descripcion, direccion, activo, ubicacion, id_macrodistrito) VALUES
                                                                                                        ('Plaza Murillo', 'Espacio abierto central con acceso rápido a vías de evacuación del casco viejo.', 'Calle Comercio y Ayacucho, Zona Central', true, ST_SetSRID(ST_MakePoint(-68.1335, -16.4957), 4326), 7),
                                                                                                        ('Parque Urbano Central (PUC)', 'Área extensa libre de edificios altos, apta para concentración masiva y carpas.', 'Av. del Ejército, Zona Central', true, ST_SetSRID(ST_MakePoint(-68.1286, -16.5015), 4326), 7),
                                                                                                        ('Plaza del Estudiante', 'Punto de reunión estratégico para universitarios y transeúntes del Prado.', 'Av. 16 de Julio y Villazón', true, ST_SetSRID(ST_MakePoint(-68.1306, -16.5048), 4326), 7),
                                                                                                        ('Plaza Abaroa', 'Zona segura con arboleda baja y acceso a ambulancias en Sopocachi.', 'Av. 20 de Octubre y Pedro Salazar', true, ST_SetSRID(ST_MakePoint(-68.1268, -16.5105), 4326), 1),
                                                                                                        ('Plaza España', 'Punto de encuentro vecinal en Sopocachi Alto.', 'Calle Víctor Sanjinés y Méndez Arcos', true, ST_SetSRID(ST_MakePoint(-68.1292, -16.5133), 4326), 1),
                                                                                                        ('Plaza Humboldt', 'Área abierta de evacuación y punto de triaje en Calacoto.', 'Calle 8 de Calacoto, Zona Sur', true, ST_SetSRID(ST_MakePoint(-68.0864, -16.5398), 4326), 5),
                                                                                                        ('Parque de las Cholas', 'Superficie plana y abierta alejada de taludes en La Florida.', 'Av. Costanera y Calle 7, La Florida', true, ST_SetSRID(ST_MakePoint(-68.0938, -16.5446), 4326), 5),
                                                                                                        ('Estadio Hernando Siles (Explanada)', 'Explanada exterior amplia para evacuación del sector Miraflores.', 'Plaza Tejada Sorzano, Miraflores', true, ST_SetSRID(ST_MakePoint(-68.1227, -16.4995), 4326), 7),
                                                                                                        ('Plaza Villarroel', 'Punto principal de concentración y rescate para Villa Fátima y Miraflores Norte.', 'Av. Busch y Av. Tejada Sorzano', true, ST_SetSRID(ST_MakePoint(-68.1185, -16.4867), 4326), 3),
                                                                                                        ('Plaza San Pedro', 'Espacio abierto histórico para evacuación de vecinos de San Pedro.', 'Calle Colombia y Almirante Grau', true, ST_SetSRID(ST_MakePoint(-68.1355, -16.5043), 4326), 1),
                                                                                                        ('Parque Laikacota', 'Zona elevada con espacios abiertos y helipuerto de emergencia.', 'Av. del Ejército, Miraflores', true, ST_SetSRID(ST_MakePoint(-68.1261, -16.5023), 4326), 7),
                                                                                                        ('Plaza Garita de Lima', 'Punto de reunión y control de tráfico de emergencia en Max Paredes.', 'Av. Baptista y Tumusla', true, ST_SetSRID(ST_MakePoint(-68.1444, -16.4938), 4326), 2);

-- =========================================================
-- 5. ALERTAS SÍSMICAS (6: 2 ACTIVAS + 4 CERRADAS)
-- =========================================================
INSERT INTO alertas (titulo, mensaje_oficial, gravedad, estado, es_toda_la_ciudad, fecha_emision, id_sismologo) VALUES
                                                                                                                    (
                                                                                                                        'Sismo Moderado Mw 4.8 - Sector Centro y Cotahuma',
                                                                                                                        'Se registró un sismo de magnitud 4.8 a 18 km de profundidad. Evacúe edificios antiguos con calma hacia Plaza Murillo, PUC o Plaza Abaroa. No use ascensores.',
                                                                                                                        'MODERADA',
                                                                                                                        'ACTIVA',
                                                                                                                        false,
                                                                                                                        NOW() - INTERVAL '15 minutes',
                                                                                                                        2
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        'Réplica Leve Mw 3.4 - Monitoreo Preventivo',
                                                                                                                        'Actividad sísmica menor detectada en el valle de La Paz. No se reportan daños estructurales. Mantenga despejadas las salidas de emergencia.',
                                                                                                                        'BASICA',
                                                                                                                        'ACTIVA',
                                                                                                                        true,
                                                                                                                        NOW() - INTERVAL '5 minutes',
                                                                                                                        2
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        'Alerta Severa Mw 5.9 - Evacuación General (Simulacro Oficial)',
                                                                                                                        'Simulacro municipal de evacuación sísmica concluido con éxito. Todos los puntos seguros fueron habilitados sin incidentes.',
                                                                                                                        'SEVERA',
                                                                                                                        'CERRADA',
                                                                                                                        true,
                                                                                                                        NOW() - INTERVAL '2 days',
                                                                                                                        2
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        'Sismo Mw 4.2 - Zona Sur y Mallasa',
                                                                                                                        'Movimiento telúrico percibido en Calacoto, Obrajes y Mallasa. Brigadas del GAMLP inspeccionaron taludes sin novedad.',
                                                                                                                        'MODERADA',
                                                                                                                        'CERRADA',
                                                                                                                        false,
                                                                                                                        NOW() - INTERVAL '5 days',
                                                                                                                        6
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        'Temblor Leve Mw 3.1 - Macrodistrito Periférica',
                                                                                                                        'Evento superficial percibido brevemente en Villa Fátima y Chuquiaguillo. Sin afectación a servicios básicos.',
                                                                                                                        'BASICA',
                                                                                                                        'CERRADA',
                                                                                                                        false,
                                                                                                                        NOW() - INTERVAL '9 days',
                                                                                                                        2
                                                                                                                    ),
                                                                                                                    (
                                                                                                                        'Enjambre Sísmico Menor - Cordillera Real',
                                                                                                                        'Tres sismos menores a Mw 3.5 registrados en el sector norte. Se cerró la alerta tras 6 horas de estabilidad.',
                                                                                                                        'BASICA',
                                                                                                                        'CERRADA',
                                                                                                                        false,
                                                                                                                        NOW() - INTERVAL '14 days',
                                                                                                                        6
                                                                                                                    );

-- =========================================================
-- 6. ALERTA <-> MACRODISTRITO (Zonas afectadas)
-- =========================================================
INSERT INTO alerta_macrodistrito (id_alerta, id_macrodistrito) VALUES
                                                                   (1, 7),
                                                                   (1, 1),
                                                                   (4, 5),
                                                                   (4, 6),
                                                                   (5, 3),
                                                                   (6, 8),
                                                                   (6, 9);

-- =========================================================
-- 7. REGISTROS DE ZONAS DE CIUDADANOS
-- =========================================================
INSERT INTO registros (id_usuario, id_macrodistrito) VALUES
                                                         (1, 7),
                                                         (1, 1),
                                                         (1, 5),
                                                         (4, 5),
                                                         (4, 6),
                                                         (5, 2),
                                                         (5, 7);

-- =========================================================
-- 8. NOTIFICACIONES PARA EL CIUDADANO (ID 1)
-- =========================================================
INSERT INTO notificaciones (mensaje, leida, fecha_hora, id_usuario, id_alerta) VALUES
                                                                                   (
                                                                                       'ALERTA MODERADA en Centro y Cotahuma: Sismo Moderado Mw 4.8. Diríjase al punto de evacuación más cercano.',
                                                                                       false,
                                                                                       NOW() - INTERVAL '15 minutes',
                                                                                       1,
                                                                                       1
                                                                                   ),
                                                                                   (
                                                                                       'ALERTA BÁSICA en toda la ciudad: Réplica Leve Mw 3.4 detectada. Mantenga la calma y revise su mochila de emergencia.',
                                                                                       false,
                                                                                       NOW() - INTERVAL '5 minutes',
                                                                                       1,
                                                                                       2
                                                                                   ),
                                                                                   (
                                                                                       'ALERTA SEVERA (Simulacro): Evacuación general finalizada. Gracias por participar en SismoPaz.',
                                                                                       true,
                                                                                       NOW() - INTERVAL '2 days',
                                                                                       1,
                                                                                       3
                                                                                   ),
                                                                                   (
                                                                                       'ALERTA MODERADA en Zona Sur: Sismo Mw 4.2 percibido en Calacoto y Mallasa. Alerta cerrada sin daños.',
                                                                                       true,
                                                                                       NOW() - INTERVAL '5 days',
                                                                                       1,
                                                                                       4
                                                                                   );