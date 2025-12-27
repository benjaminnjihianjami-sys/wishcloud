ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION enforce_tenant() RETURNS void AS $$
BEGIN
  IF current_setting('app.tenant_id', true) IS NULL THEN
    RAISE EXCEPTION 'tenant not set';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE POLICY tenants_isolation ON tenants
  USING (id::text = current_setting('app.tenant_id'));

CREATE POLICY users_isolation ON users
  USING (tenant_id::text = current_setting('app.tenant_id'));

CREATE POLICY wishes_isolation ON wishes
  USING (tenant_id::text = current_setting('app.tenant_id'));

CREATE POLICY audit_logs_isolation ON audit_logs
  USING (tenant_id IS NULL OR tenant_id::text = current_setting('app.tenant_id'));

CREATE POLICY feature_flags_isolation ON feature_flags
  USING (tenant_id::text = current_setting('app.tenant_id'));
