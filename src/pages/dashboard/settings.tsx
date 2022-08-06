import React, { useState } from 'react';
import {
  BellRinging,
  DatabaseImport,
  Fingerprint,
  Key,
  Receipt2,
  Settings,
  TwoFA,
} from 'tabler-icons-react';

const data = [
  { link: '', label: 'Notifications', icon: BellRinging },
  { link: '', label: 'Billing', icon: Receipt2 },
  { link: '', label: 'Security', icon: Fingerprint },
  { link: '', label: 'SSH Keys', icon: Key },
  { link: '', label: 'Databases', icon: DatabaseImport },
  { link: '', label: 'Authentication', icon: TwoFA },
  { link: '', label: 'Other Settings', icon: Settings },
];

function NavbarSimple() {
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      // className={cn(classes.link, {
      //   [classes.linkActive]: item.label === active,
      // })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div>
      <div>{links}</div>
    </div>
  );
}
const DashboardSettings = () => {
  return (
    <div>
      <NavbarSimple />
    </div>
  );
};

export default DashboardSettings;
