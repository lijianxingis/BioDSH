import React from 'react'

/** Skeleton rows hold their shape while content loads, so the layout does not jump. */
export function SkeletonRows({ rows = 3 }) {
  return <div className="rw-skeletons" aria-hidden="true">
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="rw-skeleton" style={{ width: (70 + ((index * 13) % 30)) + '%' }}/>
    ))}
  </div>
}

export default SkeletonRows
