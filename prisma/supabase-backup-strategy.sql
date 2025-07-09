-- Database Backup Strategy for Blog Application
-- Supabase Point-in-Time Recovery (PITR) Implementation
-- Run these commands in your Supabase SQL Editor or via CLI

-- =============================================================================
-- 1. BACKUP MONITORING TABLE
-- =============================================================================

-- Create table to track backup operations and health
CREATE TABLE IF NOT EXISTS public.backup_log (
  id SERIAL PRIMARY KEY,
  backup_type VARCHAR(50) NOT NULL, -- 'manual', 'scheduled', 'pre-deployment'
  status VARCHAR(20) NOT NULL DEFAULT 'started', -- 'started', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_by VARCHAR(100)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_backup_log_status ON public.backup_log(status);
CREATE INDEX IF NOT EXISTS idx_backup_log_started_at ON public.backup_log(started_at);
CREATE INDEX IF NOT EXISTS idx_backup_log_type ON public.backup_log(backup_type);

-- =============================================================================
-- 2. BACKUP HEALTH CHECK FUNCTIONS
-- =============================================================================

-- Function to check database health before backup
CREATE OR REPLACE FUNCTION public.check_database_health()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
  post_count INTEGER;
  comment_count INTEGER;
  like_count INTEGER;
  subscriber_count INTEGER;
  analytics_count INTEGER;
  storage_size_mb NUMERIC;
BEGIN
  -- Get table counts
  SELECT COUNT(*) INTO post_count FROM public.posts;
  SELECT COUNT(*) INTO comment_count FROM public.comments;
  SELECT COUNT(*) INTO like_count FROM public.likes;
  SELECT COUNT(*) INTO subscriber_count FROM public.subscribers;
  SELECT COUNT(*) INTO analytics_count FROM public.analytics;
  
  -- Calculate approximate storage size
  SELECT 
    ROUND(
      (pg_total_relation_size('public.posts') +
       pg_total_relation_size('public.comments') +
       pg_total_relation_size('public.likes') +
       pg_total_relation_size('public.subscribers') +
       pg_total_relation_size('public.analytics')) / 1024.0 / 1024.0, 2
    ) INTO storage_size_mb;
  
  -- Build result JSON
  result := jsonb_build_object(
    'timestamp', NOW(),
    'tables', jsonb_build_object(
      'posts', post_count,
      'comments', comment_count,
      'likes', like_count,
      'subscribers', subscriber_count,
      'analytics', analytics_count
    ),
    'storage_mb', storage_size_mb,
    'status', 'healthy'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'timestamp', NOW(),
      'status', 'error',
      'error', SQLERRM
    );
END;
$$;

-- Function to log backup operations
CREATE OR REPLACE FUNCTION public.log_backup_operation(
  backup_type VARCHAR(50),
  operation_status VARCHAR(20),
  error_msg TEXT DEFAULT NULL,
  metadata_json JSONB DEFAULT NULL,
  created_by_user VARCHAR(100) DEFAULT 'system'
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  log_id INTEGER;
BEGIN
  INSERT INTO public.backup_log (
    backup_type,
    status,
    error_message,
    metadata,
    created_by,
    completed_at
  ) VALUES (
    backup_type,
    operation_status,
    error_msg,
    metadata_json,
    created_by_user,
    CASE WHEN operation_status IN ('completed', 'failed') THEN NOW() ELSE NULL END
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- =============================================================================
-- 3. PRE-BACKUP VALIDATION
-- =============================================================================

-- Function to validate data integrity before backup
CREATE OR REPLACE FUNCTION public.validate_data_integrity()
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
  orphaned_comments INTEGER;
  orphaned_likes INTEGER;
  invalid_posts INTEGER;
  integrity_issues JSONB;
BEGIN
  -- Check for orphaned comments (comments without posts)
  SELECT COUNT(*) INTO orphaned_comments
  FROM public.comments c
  LEFT JOIN public.posts p ON c.post_id = p.id
  WHERE p.id IS NULL;
  
  -- Check for orphaned likes (likes without posts)
  SELECT COUNT(*) INTO orphaned_likes
  FROM public.likes l
  LEFT JOIN public.posts p ON l.post_id = p.id
  WHERE p.id IS NULL;
  
  -- Check for invalid posts (posts without required fields)
  SELECT COUNT(*) INTO invalid_posts
  FROM public.posts
  WHERE title IS NULL OR title = '' OR content IS NULL OR content = '';
  
  -- Build integrity report
  integrity_issues := jsonb_build_object(
    'orphaned_comments', orphaned_comments,
    'orphaned_likes', orphaned_likes,
    'invalid_posts', invalid_posts
  );
  
  result := jsonb_build_object(
    'timestamp', NOW(),
    'integrity_check', integrity_issues,
    'status', CASE 
      WHEN orphaned_comments + orphaned_likes + invalid_posts = 0 THEN 'clean'
      ELSE 'issues_found'
    END
  );
  
  RETURN result;
END;
$$;

-- =============================================================================
-- 4. BACKUP RETENTION POLICIES
-- =============================================================================

-- Function to clean up old backup logs (keep last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_backup_logs()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.backup_log
  WHERE started_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO public.backup_log (backup_type, status, metadata, created_by)
  VALUES (
    'cleanup',
    'completed',
    jsonb_build_object('deleted_records', deleted_count),
    'system'
  );
  
  RETURN deleted_count;
END;
$$;

-- =============================================================================
-- 5. DISASTER RECOVERY PROCEDURES
-- =============================================================================

-- Function to prepare for disaster recovery
CREATE OR REPLACE FUNCTION public.create_recovery_checkpoint(
  checkpoint_name VARCHAR(100),
  description TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  health_check JSONB;
  integrity_check JSONB;
  checkpoint_info JSONB;
BEGIN
  -- Run health check
  health_check := public.check_database_health();
  
  -- Run integrity check
  integrity_check := public.validate_data_integrity();
  
  -- Create checkpoint metadata
  checkpoint_info := jsonb_build_object(
    'checkpoint_name', checkpoint_name,
    'description', description,
    'timestamp', NOW(),
    'health_check', health_check,
    'integrity_check', integrity_check
  );
  
  -- Log the checkpoint
  PERFORM public.log_backup_operation(
    'recovery_checkpoint',
    'completed',
    NULL,
    checkpoint_info,
    'admin'
  );
  
  RETURN checkpoint_info;
END;
$$;

-- =============================================================================
-- 6. SCHEDULED BACKUP MONITORING
-- =============================================================================

-- View for backup monitoring dashboard
CREATE OR REPLACE VIEW public.backup_monitoring AS
SELECT 
  bl.id,
  bl.backup_type,
  bl.status,
  bl.started_at,
  bl.completed_at,
  bl.error_message,
  bl.metadata,
  bl.created_by,
  CASE 
    WHEN bl.completed_at IS NOT NULL THEN 
      EXTRACT(EPOCH FROM (bl.completed_at - bl.started_at))
    ELSE 
      EXTRACT(EPOCH FROM (NOW() - bl.started_at))
  END AS duration_seconds,
  CASE 
    WHEN bl.status = 'started' AND bl.started_at < NOW() - INTERVAL '1 hour' THEN 'stale'
    WHEN bl.status = 'failed' THEN 'failed'
    WHEN bl.status = 'completed' THEN 'success'
    ELSE 'running'
  END AS health_status
FROM public.backup_log bl
ORDER BY bl.started_at DESC;

-- Function to get backup statistics
CREATE OR REPLACE FUNCTION public.get_backup_statistics(days_back INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  stats JSONB;
  total_backups INTEGER;
  successful_backups INTEGER;
  failed_backups INTEGER;
  avg_duration_seconds NUMERIC;
  last_successful_backup TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get backup counts
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'failed'),
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) FILTER (WHERE status = 'completed')
  INTO total_backups, successful_backups, failed_backups, avg_duration_seconds
  FROM public.backup_log
  WHERE started_at >= NOW() - INTERVAL '1 day' * days_back;
  
  -- Get last successful backup
  SELECT MAX(completed_at) INTO last_successful_backup
  FROM public.backup_log
  WHERE status = 'completed';
  
  stats := jsonb_build_object(
    'period_days', days_back,
    'total_backups', total_backups,
    'successful_backups', successful_backups,
    'failed_backups', failed_backups,
    'success_rate', CASE 
      WHEN total_backups > 0 THEN ROUND((successful_backups::NUMERIC / total_backups::NUMERIC) * 100, 2)
      ELSE 0
    END,
    'avg_duration_seconds', COALESCE(avg_duration_seconds, 0),
    'last_successful_backup', last_successful_backup,
    'days_since_last_backup', CASE 
      WHEN last_successful_backup IS NOT NULL THEN 
        EXTRACT(DAYS FROM (NOW() - last_successful_backup))
      ELSE NULL
    END
  );
  
  RETURN stats;
END;
$$;

-- =============================================================================
-- 7. AUTOMATION TRIGGERS
-- =============================================================================

-- Function to automatically create backup before major operations
CREATE OR REPLACE FUNCTION public.trigger_pre_operation_backup()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log pre-operation backup
  PERFORM public.log_backup_operation(
    'pre_operation',
    'started',
    NULL,
    jsonb_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'timestamp', NOW()
    ),
    'system'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for important schema changes (optional)
-- Note: This is just an example - customize based on your needs
CREATE OR REPLACE TRIGGER backup_before_post_delete
  BEFORE DELETE ON public.posts
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_pre_operation_backup();

-- =============================================================================
-- 8. BACKUP VERIFICATION QUERIES
-- =============================================================================

-- Query to check backup health
CREATE OR REPLACE FUNCTION public.verify_backup_health()
RETURNS TABLE (
  check_name TEXT,
  status TEXT,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check recent backup frequency
  RETURN QUERY
  SELECT 
    'backup_frequency'::TEXT,
    CASE 
      WHEN COUNT(*) FILTER (WHERE started_at >= NOW() - INTERVAL '24 hours') > 0 THEN 'OK'
      ELSE 'WARNING'
    END,
    jsonb_build_object(
      'backups_last_24h', COUNT(*) FILTER (WHERE started_at >= NOW() - INTERVAL '24 hours'),
      'last_backup', MAX(started_at)
    ),
    NOW()
  FROM public.backup_log;
  
  -- Check backup success rate
  RETURN QUERY
  SELECT 
    'backup_success_rate'::TEXT,
    CASE 
      WHEN COUNT(*) = 0 THEN 'NO_DATA'
      WHEN (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) >= 0.95 THEN 'OK'
      WHEN (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) >= 0.85 THEN 'WARNING'
      ELSE 'CRITICAL'
    END,
    jsonb_build_object(
      'success_rate', ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2),
      'total_backups', COUNT(*),
      'successful_backups', COUNT(*) FILTER (WHERE status = 'completed')
    ),
    NOW()
  FROM public.backup_log
  WHERE started_at >= NOW() - INTERVAL '7 days';
  
  -- Check for long-running backups
  RETURN QUERY
  SELECT 
    'long_running_backups'::TEXT,
    CASE 
      WHEN COUNT(*) = 0 THEN 'OK'
      ELSE 'WARNING'
    END,
    jsonb_build_object(
      'long_running_count', COUNT(*),
      'details', array_agg(jsonb_build_object('id', id, 'type', backup_type, 'started', started_at))
    ),
    NOW()
  FROM public.backup_log
  WHERE status = 'started' AND started_at < NOW() - INTERVAL '2 hours';
END;
$$;

-- =============================================================================
-- 9. GRANT PERMISSIONS
-- =============================================================================

-- Grant permissions for backup operations
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backup_log TO authenticated;
GRANT USAGE ON SEQUENCE public.backup_log_id_seq TO authenticated;
GRANT SELECT ON public.backup_monitoring TO authenticated;

-- Grant execute permissions on backup functions
GRANT EXECUTE ON FUNCTION public.check_database_health() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_backup_operation(VARCHAR, VARCHAR, TEXT, JSONB, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_data_integrity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_backup_statistics(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_backup_health() TO authenticated;

-- Restrict sensitive operations to service role
GRANT EXECUTE ON FUNCTION public.cleanup_old_backup_logs() TO service_role;
GRANT EXECUTE ON FUNCTION public.create_recovery_checkpoint(VARCHAR, TEXT) TO service_role;

-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================

-- Initial health check
SELECT public.check_database_health() as initial_health_check;

-- Create initial recovery checkpoint
SELECT public.create_recovery_checkpoint(
  'initial_setup',
  'Initial backup strategy implementation checkpoint'
) as initial_checkpoint;

-- Display backup monitoring view
SELECT * FROM public.backup_monitoring LIMIT 10;

-- Instructions for setting up automated backups:
/*
1. SUPABASE DASHBOARD SETUP:
   - Go to Settings > Database > Backups
   - Enable Point-in-Time Recovery (PITR)
   - Set backup retention period (recommended: 7-30 days)
   - Configure backup schedule (recommended: every 6-12 hours)

2. ENVIRONMENT VARIABLES:
   Add to your .env.local:
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   BACKUP_NOTIFICATION_WEBHOOK=your_webhook_url (optional)

3. MONITORING SETUP:
   - Set up alerts for backup failures
   - Monitor backup success rate weekly
   - Review backup logs monthly

4. DISASTER RECOVERY TESTING:
   - Test recovery procedures quarterly
   - Verify backup integrity monthly
   - Document recovery procedures
*/ 