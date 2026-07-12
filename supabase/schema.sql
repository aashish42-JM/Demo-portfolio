-- AashishOS Database Schema
-- Run this in your Supabase SQL Editor

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in-progress', 'planned')),
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'locked')),
  category TEXT,
  xp_reward INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Logbook entries
CREATE TABLE IF NOT EXISTS logbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  week TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE logbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can read missions" ON missions FOR SELECT USING (true);
CREATE POLICY "Public can read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public can read logbook" ON logbook_entries FOR SELECT USING (true);
CREATE POLICY "Public can insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin write policies (requires auth)
CREATE POLICY "Admin can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage missions" ON missions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage logbook" ON logbook_entries FOR ALL USING (auth.role() = 'authenticated');
