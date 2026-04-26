# Duplicate Connection Fix

## Problem
When two users matched and connected, duplicate chat conversations were being created. Users could see the same person multiple times in their chat list.

## Root Cause
The `acceptRequest` method in ConnectionService was creating a new connection every time without checking if a connection already existed between the two users.

## Solution

### 1. Backend Changes

#### ConnectionService.java
- Added check in `acceptRequest()` to prevent duplicate connections
- Added check in `sendRequest()` to prevent duplicate requests
- Now uses `findConnectionBetweenUsers()` to check for existing connections

#### ConnectionRequestRepository.java
- Added `findPendingRequestBetweenUsers()` method to check for existing pending requests

### 2. Database Cleanup

Run this SQL script to remove existing duplicates:
```bash
psql -U postgres -d skillmate_db -f f:\skill_share\remove_duplicate_connections.sql
```

### 3. How It Works Now

1. **Sending Connection Request:**
   - Checks if connection already exists → Error
   - Checks if pending request exists → Error
   - Only creates new request if neither exists

2. **Accepting Connection Request:**
   - Marks request as ACCEPTED
   - Checks if connection already exists → Returns existing
   - Only creates new connection if it doesn't exist

3. **Result:**
   - Each pair of users has exactly ONE connection
   - Each pair of users has at most ONE pending request
   - Chat list shows each person only once

## Testing

1. Restart your Spring Boot backend
2. Run the SQL cleanup script
3. Test by:
   - Sending a connection request
   - Accepting it
   - Checking chat - should see only one conversation
   - Try sending another request - should get error

## Files Modified
- backend/src/main/java/com/skillmate/service/ConnectionService.java
- backend/src/main/java/com/skillmate/repository/ConnectionRequestRepository.java
- remove_duplicate_connections.sql (new file)
