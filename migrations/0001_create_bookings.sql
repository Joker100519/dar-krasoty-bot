CREATE TABLE IF NOT EXISTS bookings (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    telegram_id INTEGER NOT NULL,

    service TEXT NOT NULL,

    city TEXT NOT NULL,

    booking_date TEXT NOT NULL,

    booking_time TEXT NOT NULL,

    client_name TEXT NOT NULL,

    phone TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'new',

    calendar_event_id TEXT,

    created_at TEXT NOT NULL,

    updated_at TEXT
);