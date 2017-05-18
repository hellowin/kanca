// @flow
import React from 'react';

export const AlertLevels = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  DANGER: 'DANGER',
}

export type AlertLevel = $Keys<typeof AlertLevels>

export default (props: { children?: any, level?: AlertLevel }) => {
  const { children, level } = { level: AlertLevels.INFO.toLowerCase(), ...props };
  return (
    <div className={`alert alert-${level.toLowerCase()}`} role="alert">
      {children}
    </div>
  );
}