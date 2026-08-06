-- Pin the trigger function's search_path to prevent search_path injection
-- (clears the Supabase security advisor "function_search_path_mutable" warning).
alter function public.touch_updated_at() set search_path = '';
