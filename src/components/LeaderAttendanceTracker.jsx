import React from 'react';
import PatrolAttendance from './PatrolAttendance';

/**
 * LeaderAttendanceTracker
 * 
 * High-performance leader roll call & compliance engine wrapper.
 * Dedicated to Friday Scouting Programs & Mandatory Event compliance reporting.
 */
export default function LeaderAttendanceTracker(props) {
  return (
    <div className="w-full">
      <PatrolAttendance {...props} />
    </div>
  );
}
