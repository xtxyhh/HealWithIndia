-- Add updated_at column to patient_auth_mapping table
-- Version: 011
-- Description: Add updated_at timestamp column with automatic update trigger

ALTER TABLE public.patient_auth_mapping
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to automatically update updated_at on row changes
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_patient_auth_mapping_updated_at ON public.patient_auth_mapping;

CREATE TRIGGER update_patient_auth_mapping_updated_at
  BEFORE UPDATE ON public.patient_auth_mapping
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
