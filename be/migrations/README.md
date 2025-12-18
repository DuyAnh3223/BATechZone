# Database Migrations

This folder contains database migration scripts for the PC Hardware Store project.

## Migration Overview

### 001: JWT Refresh Tokens Migration

**Purpose**: Migrate from session-based authentication to JWT-based authentication with multi-session support.

**Files**:
- `001_add_jwt_refresh_tokens.sql` - Forward migration
- `001_rollback_jwt_refresh_tokens.sql` - Rollback script

## How to Run Migrations

### Option 1: Using MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Select database
USE batechzone;

# Run migration
SOURCE D:/dev/PCHardwareStore/be/migrations/001_add_jwt_refresh_tokens.sql;
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Open the SQL script file
4. Execute the script

### Option 3: Using phpMyAdmin

1. Open phpMyAdmin
2. Select `batechzone` database
3. Go to SQL tab
4. Copy and paste the migration script
5. Click "Go"

## Migration Details

### What Changes?

**New Columns Added**:
- `admin_refresh_token` VARCHAR(512) - JWT refresh token for admin sessions
- `user_refresh_token` VARCHAR(512) - JWT refresh token for user sessions

**Indexes Added**:
- `idx_admin_refresh_token` - For faster admin token lookups
- `idx_user_refresh_token` - For faster user token lookups

**Data Changes**:
- All existing session tokens are cleared
- Users will need to login again after migration

### Old Columns (Kept for Safety)

These columns are kept temporarily for rollback capability:
- `session_token` (deprecated)
- `admin_session_token` (deprecated)
- `user_session_token` (deprecated)

**When to remove**: After JWT implementation is stable (1-2 weeks), uncomment Step 4 in the migration script to drop these columns.

## Rollback

If you need to rollback to session-based authentication:

```bash
mysql -u root -p batechzone < migrations/001_rollback_jwt_refresh_tokens.sql
```

**Warning**: Rollback will:
1. Remove JWT refresh token columns
2. Clear all session tokens
3. Force all users to re-login

## Migration Checklist

- [ ] Backup database before migration
- [ ] Run migration script
- [ ] Verify new columns exist: `DESCRIBE users;`
- [ ] Test admin login with JWT
- [ ] Test user login with JWT
- [ ] Monitor for issues
- [ ] After 1-2 weeks of stable operation, drop old session columns

## Troubleshooting

### Error: Column already exists

If you see "Duplicate column name" error:
```sql
-- Check if columns already exist
DESCRIBE users;

-- If they exist, skip the ALTER TABLE step
```

### Error: Cannot drop index

If index doesn't exist during rollback:
```sql
-- Check existing indexes
SHOW INDEX FROM users;
```

## Schema Comparison

### Before Migration

```
user_id
username
email
password_hash
full_name
phone
role
is_active
created_at
updated_at
last_login
session_token              ← Session-based
admin_session_token        ← Session-based
user_session_token         ← Session-based
```

### After Migration

```
user_id
username
email
password_hash
full_name
phone
role
is_active
created_at
updated_at
last_login
session_token              ← Deprecated (keep for rollback)
admin_session_token        ← Deprecated (keep for rollback)
user_session_token         ← Deprecated (keep for rollback)
admin_refresh_token        ← NEW: JWT for admin
user_refresh_token         ← NEW: JWT for user
```

### Final State (After Cleanup)

```
user_id
username
email
password_hash
full_name
phone
role
is_active
created_at
updated_at
last_login
admin_refresh_token        ← JWT for admin
user_refresh_token         ← JWT for user
```

## Notes

- Refresh tokens are stored as VARCHAR(512) to accommodate JWT length
- Indexes are added on first 255 characters for performance
- Both admin and user can be logged in simultaneously on the same browser
- Refresh tokens are rotated on each refresh request for security
- Access tokens are NOT stored in database (stateless JWT)
