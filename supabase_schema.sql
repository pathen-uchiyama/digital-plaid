-- Digital Plaid Database Schema

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  resort_id TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal TEXT DEFAULT 'The Relaxed Parent',
  stamina_score INTEGER DEFAULT 5, -- 1-10 walking capacity
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preferences table
CREATE TABLE IF NOT EXISTS preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  rank TEXT NOT NULL,
  allergies TEXT[],
  character_type_pref TEXT, -- 'Furry' or 'Face'
  snack_habit TEXT, -- e.g., 'Sweet', 'Salty', 'Healthy'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Sent', -- 'Sent', 'Completed', 'LeaderFilled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itinerary Steps table
CREATE TABLE IF NOT EXISTS itinerary_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  park_id TEXT NOT NULL,
  step_name TEXT NOT NULL,
  step_type TEXT NOT NULL,
  planned_start TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  is_pivot BOOLEAN DEFAULT FALSE,
  nudge_id TEXT, -- References a contextual nudge
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory Logs table
CREATE TABLE IF NOT EXISTS memory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  planned_v_actual JSONB,
  nudge_log JSONB, -- Captured contextual nudges
  sentiment_score INTEGER,
  memory_note TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
