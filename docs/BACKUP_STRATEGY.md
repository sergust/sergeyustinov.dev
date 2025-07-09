# Database Backup Strategy

## Overview

This document outlines the comprehensive backup strategy implemented for the Glass Blog application using Supabase's Point-in-Time Recovery (PITR) system. The strategy includes automated backups, monitoring, data integrity checks, and disaster recovery procedures.

## Features

### ✅ **Automated Backup Types**

- **Scheduled Backups**: Regular automated backups (configurable intervals)
- **Pre-Deployment Backups**: Automatic backups before deployments
- **Manual Backups**: Admin-initiated backups with custom descriptions
- **Recovery Checkpoints**: Named restore points for critical operations

### ✅ **Monitoring & Health Checks**

- **Database Health Monitoring**: Real-time status of tables and storage
- **Data Integrity Validation**: Detection of orphaned records and invalid data
- **Backup Success Tracking**: Success rates and failure analysis
- **Performance Metrics**: Backup duration and efficiency monitoring

### ✅ **Security & Compliance**

- **Row Level Security**: Proper access controls for backup operations
- **Audit Trail**: Complete logging of all backup operations
- **Retention Policies**: Automatic cleanup of old backup logs
- **Access Control**: Role-based permissions for backup management

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Backup Strategy                          │
├─────────────────────────────────────────────────────────────────┤
│  Application Layer (TypeScript)                                │
│  ├── backup-utils.ts (Client functions)                        │
│  ├── permissions.ts (Access control)                           │
│  └── Admin Dashboard (Monitoring UI)                           │
├─────────────────────────────────────────────────────────────────┤
│  Database Layer (PostgreSQL)                                   │
│  ├── backup_log table (Operation tracking)                     │
│  ├── backup_monitoring view (Dashboard data)                   │
│  ├── Health check functions                                    │
│  ├── Integrity validation functions                            │
│  └── Recovery checkpoint functions                             │
├─────────────────────────────────────────────────────────────────┤
│  Supabase Infrastructure                                       │
│  ├── Point-in-Time Recovery (PITR)                            │
│  ├── Automated snapshots                                       │
│  ├── Storage backup policies                                   │
│  └── Monitoring & alerting                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Database Setup

Run the SQL scripts in the following order:

```bash
# 1. Set up storage and RLS policies
psql -f prisma/supabase-storage-setup.sql

# 2. Configure RLS policies
psql -f prisma/supabase-rls-policies.sql

# 3. Install backup strategy
psql -f prisma/supabase-backup-strategy.sql
```

### 2. Environment Variables

Add the following to your `.env.local`:

```env
# Required for basic operations
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Backup notifications
BACKUP_NOTIFICATION_WEBHOOK=your-webhook-url
```

### 3. Supabase Dashboard Configuration

1. Navigate to your Supabase project dashboard
2. Go to **Settings > Database > Backups**
3. Enable **Point-in-Time Recovery (PITR)**
4. Configure backup settings:
   - **Retention Period**: 7-30 days (recommended: 14 days)
   - **Backup Schedule**: Every 6-12 hours
   - **Storage Location**: Your preferred region

### 4. Admin User Setup

Update the admin user IDs in the config table:

```sql
-- Replace with your actual Clerk user IDs
UPDATE public.config
SET value = 'user_2abc123,user_2def456'
WHERE key = 'admin_user_ids';
```

## Usage Examples

### Basic Operations

```typescript
import backupUtils from '@/lib/backup-utils';

// Check database health
const health = await backupUtils.operations.checkDatabaseHealth();
console.log('Database health:', health);

// Create manual backup
const success = await backupUtils.automation.createManualBackup(
  'user_123',
  'Pre-maintenance backup'
);

// Get backup statistics
const stats = await backupUtils.operations.getBackupStatistics(7);
console.log('Last 7 days stats:', stats);
```

### Monitoring Dashboard

```typescript
// Get backup summary for dashboard
const summary = await backupUtils.monitoring.getBackupSummary();

// Check backup health
const healthChecks = await backupUtils.operations.verifyBackupHealth();

// Get recent failed backups
const failedBackups = await backupUtils.monitoring.getFailedBackups(10);
```

### Automated Workflows

```typescript
// Pre-deployment backup
const deploymentId = 'deploy-2024-01-15';
const success = await backupUtils.automation.createPreDeploymentBackup(
  deploymentId,
  { version: '1.2.3', environment: 'production' }
);

// Recovery checkpoint
const checkpoint = await backupUtils.operations.createRecoveryCheckpoint(
  'feature-release-v1.3',
  'Before launching new comment system'
);
```

## Available Functions

### Backup Operations

| Function                               | Description                       | Admin Only |
| -------------------------------------- | --------------------------------- | ---------- |
| `checkDatabaseHealth()`                | Get database health status        | No         |
| `validateDataIntegrity()`              | Check for data consistency issues | No         |
| `getBackupStatistics(days)`            | Get backup success metrics        | No         |
| `verifyBackupHealth()`                 | Run comprehensive health checks   | No         |
| `createRecoveryCheckpoint(name, desc)` | Create named recovery point       | Yes        |
| `logOperation(type, status, ...)`      | Log backup operation              | No         |

### Monitoring Functions

| Function                        | Description                       | Admin Only |
| ------------------------------- | --------------------------------- | ---------- |
| `getRecentBackups(limit)`       | Get recent backup operations      | No         |
| `getBackupsByType(type, limit)` | Filter backups by type            | No         |
| `getFailedBackups(limit)`       | Get failed backup operations      | No         |
| `getBackupSummary()`            | Get comprehensive backup overview | No         |

### Automation Functions

| Function                              | Description                  | Admin Only |
| ------------------------------------- | ---------------------------- | ---------- |
| `createManualBackup(userId, desc)`    | Create manual backup         | Yes        |
| `createScheduledBackup()`             | Create scheduled backup      | System     |
| `createPreDeploymentBackup(id, meta)` | Create pre-deployment backup | System     |

## Backup Types

### 1. Scheduled Backups

- **Frequency**: Every 6-12 hours (configurable)
- **Trigger**: Automated via cron job or Supabase scheduler
- **Retention**: 30 days
- **Health Checks**: Full validation before backup

### 2. Manual Backups

- **Trigger**: Admin user action
- **Use Case**: Before maintenance, testing, or critical changes
- **Retention**: 90 days
- **Validation**: Database health check

### 3. Pre-Deployment Backups

- **Trigger**: CI/CD pipeline
- **Use Case**: Before code deployments
- **Retention**: 14 days
- **Metadata**: Deployment ID, version, environment

### 4. Recovery Checkpoints

- **Trigger**: Admin action
- **Use Case**: Before major operations or releases
- **Retention**: 180 days
- **Validation**: Full health and integrity checks

## Monitoring & Alerting

### Health Check Indicators

| Check                | Status              | Description             |
| -------------------- | ------------------- | ----------------------- |
| **Backup Frequency** | OK/WARNING          | Backups within 24 hours |
| **Success Rate**     | OK/WARNING/CRITICAL | 95%+ success rate       |
| **Long Running**     | OK/WARNING          | No backups over 2 hours |
| **Data Integrity**   | CLEAN/ISSUES        | No orphaned records     |

### Alert Thresholds

```typescript
// Configure alerts based on these thresholds
const ALERT_THRESHOLDS = {
  BACKUP_OVERDUE_HOURS: 24,
  SUCCESS_RATE_WARNING: 85,
  SUCCESS_RATE_CRITICAL: 75,
  LONG_RUNNING_HOURS: 2,
  MAX_FAILED_CONSECUTIVE: 3,
};
```

## Disaster Recovery

### Recovery Procedures

1. **Identify Recovery Point**

   ```sql
   -- Find available recovery points
   SELECT * FROM public.backup_monitoring
   WHERE status = 'completed'
   ORDER BY completed_at DESC;
   ```

2. **Restore from PITR**
   - Access Supabase Dashboard
   - Navigate to Database > Backups
   - Select recovery point
   - Initiate restore process

3. **Verify Data Integrity**
   ```typescript
   // After restore, verify data integrity
   const integrity = await backupUtils.operations.validateDataIntegrity();
   const health = await backupUtils.operations.checkDatabaseHealth();
   ```

### Recovery Testing

Perform recovery tests quarterly:

```typescript
// Create test recovery checkpoint
const testCheckpoint = await backupUtils.operations.createRecoveryCheckpoint(
  'disaster-recovery-test',
  'Quarterly DR test - ' + new Date().toISOString()
);

// Document recovery procedures
// Test restore process in staging environment
// Validate data integrity after restore
// Update recovery documentation
```

## Maintenance Schedule

### Daily

- Monitor backup success rates
- Check for failed backups
- Review system health

### Weekly

- Review backup statistics
- Clean up old logs
- Check storage usage

### Monthly

- Full integrity validation
- Update backup policies
- Review retention settings

### Quarterly

- Disaster recovery testing
- Performance optimization
- Security audit

## Troubleshooting

### Common Issues

#### Backup Failures

```typescript
// Check recent failed backups
const failedBackups = await backupUtils.monitoring.getFailedBackups(10);

// Common causes:
// 1. Storage space issues
// 2. Network connectivity
// 3. Permission problems
// 4. Database locks
```

#### Long Running Backups

```typescript
// Check for stuck backups
const healthChecks = await backupUtils.operations.verifyBackupHealth();
const longRunning = healthChecks.find(
  (c) => c.check_name === 'long_running_backups'
);

// Actions:
// 1. Check database activity
// 2. Review backup size
// 3. Consider manual intervention
```

#### Data Integrity Issues

```typescript
// Check for data problems
const integrity = await backupUtils.operations.validateDataIntegrity();

// Common fixes:
// 1. Clean up orphaned records
// 2. Update foreign key constraints
// 3. Run data validation scripts
```

## Security Considerations

### Access Control

- Backup operations require proper authentication
- Admin functions restricted to authorized users
- Service role key secured in environment variables

### Data Protection

- Backups encrypted at rest
- Transmission encrypted via TLS
- Access logs maintained for auditing

### Compliance

- Backup retention policies documented
- Data residency requirements met
- Audit trail maintained for all operations

## Performance Optimization

### Backup Efficiency

- Incremental backups when possible
- Compression enabled for storage
- Parallel processing for large datasets

### Storage Management

- Automatic cleanup of old backups
- Compression of archived data
- Monitoring of storage usage

### Network Optimization

- Regional backup storage
- Bandwidth throttling during peak hours
- Connection pooling for efficiency

## Support & Documentation

### Additional Resources

- [Supabase PITR Documentation](https://supabase.com/docs/guides/database/backup/point-in-time-recovery)
- [PostgreSQL Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)
- [Disaster Recovery Planning](https://www.postgresql.org/docs/current/backup-dump.html)

### Getting Help

- Check backup logs for error details
- Review system health metrics
- Contact support with backup IDs for specific issues

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Author**: Glass Blog Team
