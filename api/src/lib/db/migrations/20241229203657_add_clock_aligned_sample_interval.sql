ALTER TABLE setting
ADD COLUMN clock_aligned_data_interval INTEGER NOT NULL DEFAULT 60;
UPDATE setting
SET clock_aligned_data_interval = 60;