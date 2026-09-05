// src/components/UserProfile.jsx
import React from 'react';
import ScoutProfile from './ScoutProfile';

/**
 * UserProfile component wrapper ensuring standard user profile access
 * with integrated Account Permissions & Official BSA Leadership Role Guide.
 */
export default function UserProfile({ currentUser, ...props }) {
  return <ScoutProfile currentUser={currentUser} {...props} />;
}
