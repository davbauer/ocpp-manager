CREATE TABLE charge_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'Available',
    last_heartbeat TIMESTAMP
);

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    charge_point_id INTEGER NOT NULL,
    meter_start INTEGER NOT NULL,
    meter_stop INTEGER,
    start_time TIMESTAMP NOT NULL,
    stop_time TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'In Progress',
    FOREIGN KEY (charge_point_id) REFERENCES charge_points (id)
);

CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    charge_point_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    data JSON,
    FOREIGN KEY (charge_point_id) REFERENCES charge_points (id)
);
