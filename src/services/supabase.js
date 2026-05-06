
import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL = 'https://aumididwgewtkyxeigyd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bWlkaWR3Z2V3dGt5eGVpZ3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNzMyMzEsImV4cCI6MjA5MzY0OTIzMX0.23gEpXoIgP13mCP_H7JRl15GrpXCv8a9uSWcjgymAnk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)