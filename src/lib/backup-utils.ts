import { supabase } from './supabase';

// Types for backup operations
export interface BackupLog {
  id: number;
  backup_type: string;
  status: 'started' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_by: string;
}

export interface BackupHealth {
  check_name: string;
  status: 'OK' | 'WARNING' | 'CRITICAL' | 'NO_DATA';
  details: Record<string, unknown>;
  timestamp: string;
}

export interface BackupStats {
  period_days: number;
  total_backups: number;
  successful_backups: number;
  failed_backups: number;
  success_rate: number;
  avg_duration_seconds: number;
  last_successful_backup: string | null;
  days_since_last_backup: number | null;
}

export interface DatabaseHealth {
  timestamp: string;
  tables: {
    posts: number;
    comments: number;
    likes: number;
    subscribers: number;
    analytics: number;
  };
  storage_mb: number;
  status: 'healthy' | 'error';
  error?: string;
}

export interface IntegrityCheck {
  timestamp: string;
  integrity_check: {
    orphaned_comments: number;
    orphaned_likes: number;
    invalid_posts: number;
  };
  status: 'clean' | 'issues_found';
}

// Backup operations
export const backupOperations = {
  // Log a backup operation
  async logOperation(
    backupType: string,
    status: 'started' | 'completed' | 'failed',
    errorMessage?: string,
    metadata?: Record<string, unknown>,
    createdBy: string = 'system'
  ): Promise<number | null> {
    try {
      const { data, error } = await supabase.rpc('log_backup_operation', {
        backup_type: backupType,
        operation_status: status,
        error_msg: errorMessage || null,
        metadata_json: metadata || null,
        created_by_user: createdBy,
      });

      if (error) {
        console.error('Error logging backup operation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error logging backup operation:', error);
      return null;
    }
  },

  // Check database health
  async checkDatabaseHealth(): Promise<DatabaseHealth | null> {
    try {
      const { data, error } = await supabase.rpc('check_database_health');

      if (error) {
        console.error('Error checking database health:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error checking database health:', error);
      return null;
    }
  },

  // Validate data integrity
  async validateDataIntegrity(): Promise<IntegrityCheck | null> {
    try {
      const { data, error } = await supabase.rpc('validate_data_integrity');

      if (error) {
        console.error('Error validating data integrity:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error validating data integrity:', error);
      return null;
    }
  },

  // Get backup statistics
  async getBackupStatistics(
    daysBack: number = 30
  ): Promise<BackupStats | null> {
    try {
      const { data, error } = await supabase.rpc('get_backup_statistics', {
        days_back: daysBack,
      });

      if (error) {
        console.error('Error getting backup statistics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting backup statistics:', error);
      return null;
    }
  },

  // Verify backup health
  async verifyBackupHealth(): Promise<BackupHealth[] | null> {
    try {
      const { data, error } = await supabase.rpc('verify_backup_health');

      if (error) {
        console.error('Error verifying backup health:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error verifying backup health:', error);
      return null;
    }
  },

  // Create recovery checkpoint (admin only)
  async createRecoveryCheckpoint(
    checkpointName: string,
    description?: string
  ): Promise<Record<string, unknown> | null> {
    try {
      const { data, error } = await supabase.rpc('create_recovery_checkpoint', {
        checkpoint_name: checkpointName,
        description: description || null,
      });

      if (error) {
        console.error('Error creating recovery checkpoint:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating recovery checkpoint:', error);
      return null;
    }
  },
};

// Backup monitoring
export const backupMonitoring = {
  // Get recent backup logs
  async getRecentBackups(limit: number = 10): Promise<BackupLog[] | null> {
    try {
      const { data, error } = await supabase
        .from('backup_monitoring')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error getting recent backups:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting recent backups:', error);
      return null;
    }
  },

  // Get backup logs by type
  async getBackupsByType(
    backupType: string,
    limit: number = 50
  ): Promise<BackupLog[] | null> {
    try {
      const { data, error } = await supabase
        .from('backup_log')
        .select('*')
        .eq('backup_type', backupType)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting backups by type:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting backups by type:', error);
      return null;
    }
  },

  // Get failed backups
  async getFailedBackups(limit: number = 20): Promise<BackupLog[] | null> {
    try {
      const { data, error } = await supabase
        .from('backup_log')
        .select('*')
        .eq('status', 'failed')
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting failed backups:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting failed backups:', error);
      return null;
    }
  },

  // Get backup summary
  async getBackupSummary(): Promise<{
    health: BackupHealth[] | null;
    stats: BackupStats | null;
    recentBackups: BackupLog[] | null;
  }> {
    const [health, stats, recentBackups] = await Promise.all([
      backupOperations.verifyBackupHealth(),
      backupOperations.getBackupStatistics(7), // Last 7 days
      this.getRecentBackups(5),
    ]);

    return {
      health,
      stats,
      recentBackups,
    };
  },
};

// Backup automation helpers
export const backupAutomation = {
  // Create pre-deployment backup
  async createPreDeploymentBackup(
    deploymentId: string,
    metadata?: Record<string, unknown>
  ): Promise<boolean> {
    const logId = await backupOperations.logOperation(
      'pre_deployment',
      'started',
      undefined,
      {
        deployment_id: deploymentId,
        ...metadata,
      },
      'system'
    );

    if (!logId) return false;

    // In a real implementation, you would trigger the actual backup here
    // For now, we'll just log the completion
    try {
      // Simulate backup process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await backupOperations.logOperation(
        'pre_deployment',
        'completed',
        undefined,
        {
          deployment_id: deploymentId,
          log_id: logId,
          ...metadata,
        },
        'system'
      );

      return true;
    } catch (error) {
      await backupOperations.logOperation(
        'pre_deployment',
        'failed',
        error instanceof Error ? error.message : 'Unknown error',
        {
          deployment_id: deploymentId,
          log_id: logId,
          ...metadata,
        },
        'system'
      );

      return false;
    }
  },

  // Create scheduled backup
  async createScheduledBackup(): Promise<boolean> {
    const logId = await backupOperations.logOperation(
      'scheduled',
      'started',
      undefined,
      {
        scheduled_at: new Date().toISOString(),
      },
      'system'
    );

    if (!logId) return false;

    try {
      // Check database health before backup
      const health = await backupOperations.checkDatabaseHealth();
      if (!health || health.status === 'error') {
        throw new Error('Database health check failed');
      }

      // Validate data integrity
      const integrity = await backupOperations.validateDataIntegrity();
      if (!integrity || integrity.status === 'issues_found') {
        console.warn(
          'Data integrity issues found, backup proceeding with warning'
        );
      }

      // In a real implementation, you would trigger the actual backup here
      // For now, we'll just log the completion
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await backupOperations.logOperation(
        'scheduled',
        'completed',
        undefined,
        {
          log_id: logId,
          health_check: health,
          integrity_check: integrity,
        },
        'system'
      );

      return true;
    } catch (error) {
      await backupOperations.logOperation(
        'scheduled',
        'failed',
        error instanceof Error ? error.message : 'Unknown error',
        {
          log_id: logId,
        },
        'system'
      );

      return false;
    }
  },

  // Create manual backup
  async createManualBackup(
    userId: string,
    description?: string
  ): Promise<boolean> {
    const logId = await backupOperations.logOperation(
      'manual',
      'started',
      undefined,
      {
        description: description || 'Manual backup initiated',
        user_id: userId,
      },
      userId
    );

    if (!logId) return false;

    try {
      // Check database health
      const health = await backupOperations.checkDatabaseHealth();
      if (!health || health.status === 'error') {
        throw new Error('Database health check failed');
      }

      // In a real implementation, you would trigger the actual backup here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await backupOperations.logOperation(
        'manual',
        'completed',
        undefined,
        {
          log_id: logId,
          description: description || 'Manual backup initiated',
          user_id: userId,
          health_check: health,
        },
        userId
      );

      return true;
    } catch (error) {
      await backupOperations.logOperation(
        'manual',
        'failed',
        error instanceof Error ? error.message : 'Unknown error',
        {
          log_id: logId,
          description: description || 'Manual backup initiated',
          user_id: userId,
        },
        userId
      );

      return false;
    }
  },
};

// Utility functions
export const backupUtils = {
  // Format backup duration
  formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  },

  // Get backup status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
      case 'success':
      case 'OK':
        return 'green';
      case 'failed':
      case 'CRITICAL':
        return 'red';
      case 'started':
      case 'running':
      case 'WARNING':
        return 'yellow';
      default:
        return 'gray';
    }
  },

  // Get backup type description
  getBackupTypeDescription(type: string): string {
    switch (type) {
      case 'manual':
        return 'Manual Backup';
      case 'scheduled':
        return 'Scheduled Backup';
      case 'pre_deployment':
        return 'Pre-Deployment Backup';
      case 'recovery_checkpoint':
        return 'Recovery Checkpoint';
      case 'cleanup':
        return 'Cleanup Operation';
      default:
        return 'Unknown';
    }
  },

  // Check if backup is overdue
  isBackupOverdue(lastBackup: string | null, hours: number = 24): boolean {
    if (!lastBackup) return true;

    const lastBackupTime = new Date(lastBackup).getTime();
    const now = new Date().getTime();
    const overdueTime = hours * 60 * 60 * 1000; // Convert hours to milliseconds

    return now - lastBackupTime > overdueTime;
  },

  // Validate backup configuration
  validateBackupConfig(): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check if required environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      issues.push('NEXT_PUBLIC_SUPABASE_URL is not set');
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      issues.push(
        'SUPABASE_SERVICE_ROLE_KEY is not set (required for admin operations)'
      );
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  },
};

// Export all backup functionality
export default {
  operations: backupOperations,
  monitoring: backupMonitoring,
  automation: backupAutomation,
  utils: backupUtils,
};
