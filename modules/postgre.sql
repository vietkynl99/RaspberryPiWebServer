-- userinfo
DO $$BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'userinfo'
    ) THEN
        CREATE TABLE IF NOT EXISTS public.userinfo
        (
            firstname character varying NOT NULL,
            lastname character varying NOT NULL,
            email character varying NOT NULL PRIMARY KEY,
            password character varying NOT NULL,
            phone character varying NOT NULL,
            birthday date NOT NULL,
            permission integer NOT NULL,
            token character varying,
            lastlogin timestamp with time zone
        );
        -- ALTER TABLE IF EXISTS public.userinfo OWNER to postgres;
        INSERT INTO public.userinfo VALUES ('Viet', 'Kynl', 'vietkynl@gmail.com', '123456', '0869333444', '1999-01-01', '1');
        INSERT INTO public.userinfo VALUES ('Admin', 'System', 'admin@gmail.com', '123456', '0869123123', '1999-01-01', '1');
    END IF;
END$$;


-- loginhistory
DO $$BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'loginhistory'
    ) THEN
        DROP SEQUENCE IF EXISTS login_history_id_seq;
        CREATE SEQUENCE IF NOT EXISTS login_history_id_seq;
        CREATE TABLE IF NOT EXISTS public.loginhistory
        (
            id integer DEFAULT nextval('login_history_id_seq') PRIMARY KEY,
            time timestamp with time zone,
            type integer NOT NULL,
            email character varying NOT NULL,
            ip character varying NOT NULL
        );
        -- ALTER TABLE IF EXISTS public.loginhistory OWNER to postgres;
    END IF;
END$$;


-- event
DO $$BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'event'
    ) THEN
        DROP SEQUENCE IF EXISTS event_id_seq;
        CREATE SEQUENCE IF NOT EXISTS event_id_seq;
        CREATE TABLE IF NOT EXISTS public.event
        (
            id integer DEFAULT nextval('event_id_seq') PRIMARY KEY,
            time timestamp with time zone,
            type integer NOT NULL,
            data character varying NOT NULL
        );
        -- ALTER TABLE IF EXISTS public.event OWNER to postgres;
    END IF;
END$$;


-- setting
DO $$BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'setting'
    ) THEN
        CREATE TABLE IF NOT EXISTS public.setting
        (
            autoconnect integer NOT NULL,
            serialport character varying
        );
        -- ALTER TABLE IF EXISTS public.setting OWNER to postgres;
        INSERT INTO public.setting (autoconnect) VALUES ('0');
    END IF;
END$$;
