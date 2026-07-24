
REVOKE EXECUTE ON FUNCTION public.is_founder() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_founder() TO authenticated;
