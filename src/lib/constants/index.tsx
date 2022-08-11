import { FaUserCircle } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { IoBookmark, IoNotifications } from 'react-icons/io5';
import {
  Bell,
  BellRinging,
  Book,
  Book2,
  Dashboard,
  DoorExit,
  Heart,
  Heartbeat,
  LayoutDashboard,
  Logout,
  Message,
  Message2,
  Tool,
  Tools,
} from 'tabler-icons-react';

export const POST_ORDER = [
  { value: 'creation', label: 'Recently Created', key: 'creation-desc' },
  {
    value: 'title',
    label: 'Title',
    key: 'title',
  },
  {
    value: 'published',
    label: 'Recently Published',
    key: 'published-desc',
  },
  {
    value: 'comments',
    label: 'Most Comments',
    key: 'comments-desc',
  },
];

export type PostOrder = typeof POST_ORDER;

export const MENU_LINKS = [
  { title: 'Profile', icon: <FaUserCircle className='w-6 h-6' />, href: '/' },
  {
    title: 'Notifications',
    icon: <IoNotifications className='w-6 h-6' />,
    href: '/',
  },
  { title: 'Bookmarks', icon: <IoBookmark className='w-6 h-6' />, href: '/' },
  { title: 'Settings', icon: <IoIosSettings className='w-6 h-6' />, href: '/' },
];
export type MenuLink = typeof MENU_LINKS[0];

export const TABLINKS = [
  {
    href: '/',
    label: 'Popular',
  },
  {
    href: '/newest',
    label: 'Newest',
  },
  {
    href: '/following',
    label: 'Following',
  },
  {
    href: '/groups',
    label: 'Groups',
  },
];

export type TabLink = typeof TABLINKS[0];

export const DASHBOARD_NAV_LINKS = {
  top: [
    {
      label: 'dashboard',
      icons: (
        <>
          <Dashboard className='w-6 h-6 text-violet-400 block group-hover:hidden group-hover:animate-fade-out' />
          <LayoutDashboard className='w-6 h-6 hidden group-hover:block group-hover:animate-fade-in text-violet-400' />
        </>
      ),
      href: '/dashboard',
      path: 'dashboard',
    },
    {
      label: 'my post',
      icons: (
        <>
          <Book className='w-6 h-6 text-yellow-400 block group-hover:hidden group-hover:animate-fade-out' />
          <Book2 className='w-6 h-6 hidden group-hover:block group-hover:animate-fade-in text-yellow-400' />
        </>
      ),
      href: '/dashboard/post',
      path: 'post',
    },
    {
      label: 'my likes',
      icons: (
        <>
          <Heart className='w-6 h-6 text-red-400 block group-hover:hidden group-hover:animate-fade-out' />
          <Heartbeat className='w-6 h-6 hidden group-hover:block group-hover:animate-fade-in text-red-400' />
        </>
      ),
      href: '/dashboard/post/likes',
      path: 'likes',
    },
    {
      label: 'my comments',
      icons: (
        <>
          <Message className='w-6 h-6 text-purple-400 block group-hover:hidden group-hover:animate-fade-out' />
          <Message2 className='w-6 h-6 hidden group-hover:block group-hover:animate-fade-in text-purple-400' />
        </>
      ),
      href: '/dashboard/post/comments',
      path: 'comments',
    },
    {
      label: 'notification',
      icons: (
        <>
          <Bell className='text-green-400 block group-hover:hidden group-hover:animate-fade-out' />
          <BellRinging className='hidden group-hover:block group-hover:animate-fade-in text-green-400' />
        </>
      ),
      href: '/dashboard/post/notifications',
      path: 'notifications',
    },
  ],
  bottom: [
    {
      label: 'settings',
      icons: (
        <>
          <Tool className='text-pink-400 block group-hover:hidden group-hover:animate-fade-out' />
          <Tools className='hidden group-hover:block group-hover:animate-fade-in text-pink-400' />
        </>
      ),
      href: '/dashboard/settings',
      path: 'settings',
    },
    {
      label: 'logout',
      icons: (
        <>
          <Logout className='text-cyan-400 block group-hover:hidden group-hover:animate-fade-out' />
          <DoorExit className='hidden group-hover:block group-hover:animate-fade-in text-cyan-400' />
        </>
      ),
    },
  ],
};
