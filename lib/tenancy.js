/**
 * Tenant scoping.
 *
 * Every stored object carries the tenant that owns it, and every read is filtered by the
 * caller's tenant. The check is in one function on purpose: scattered tenant checks are
 * how a multi-tenant system leaks one record.
 */
import { createHash } from 'node:crypto'

export function tenantRunsDirectory(workspace, tenant) {
  if (typeof tenant !== 'string' || !/^[A-Za-z0-9:_-]{1,64}$/.test(tenant)) {
    const error = new Error('invalid tenant id')
    error.code = 'INVALID_TENANT'
    throw error
  }
  return '.dsh/research-workbench/tenants/' + tenant + '/runs'
}

/** Stamp a record with its owner. Refuses to write one that has no tenant. */
export function stampTenant(record, tenant) {
  if (typeof tenant !== 'string' || !tenant) {
    const error = new Error('a record cannot be stored without a tenant')
    error.code = 'NO_TENANT'
    throw error
  }
  return Object.freeze({ ...record, tenant })
}

/**
 * Filter records down to the caller's tenant.
 *
 * A record with no tenant is excluded rather than included: an unscoped record could
 * belong to anyone, and guessing is worse than hiding it.
 */
export function visibleTo(records, tenant) {
  if (!Array.isArray(records)) return []
  return records.filter(record => record?.tenant === tenant)
}

/** Refuse access to one record. */
export function assertOwned(record, tenant) {
  if (!record) {
    const error = new Error('no such record')
    error.code = 'NOT_FOUND'
    throw error
  }
  if (record.tenant !== tenant) {
    // Deliberately the same answer as "not found": telling a caller that a record exists
    // but belongs to someone else is an enumeration oracle.
    const error = new Error('no such record')
    error.code = 'NOT_FOUND'
    throw error
  }
  return record
}

/** A stable directory name for a tenant, safe as a path segment. */
export function tenantFolder(tenant) {
  return createHash('sha256').update(String(tenant)).digest('hex').slice(0, 16)
}
