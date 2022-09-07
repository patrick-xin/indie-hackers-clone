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
  { title: 'Profile', icon: <FaUserCircle className='h-6 w-6' />, href: '/' },
  {
    title: 'Notifications',
    icon: <IoNotifications className='h-6 w-6' />,
    href: '/',
  },
  { title: 'Bookmarks', icon: <IoBookmark className='h-6 w-6' />, href: '/' },
  { title: 'Settings', icon: <IoIosSettings className='h-6 w-6' />, href: '/' },
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
          <Dashboard className='block h-6 w-6 text-violet-400 group-hover:hidden group-hover:animate-fade-out' />
          <LayoutDashboard className='hidden h-6 w-6 text-violet-400 group-hover:block group-hover:animate-fade-in' />
        </>
      ),
      href: '/dashboard',
      path: 'dashboard',
    },
    {
      label: 'my post',
      icons: (
        <>
          <Book className='block h-6 w-6 text-yellow-400 group-hover:hidden group-hover:animate-fade-out' />
          <Book2 className='hidden h-6 w-6 text-yellow-400 group-hover:block group-hover:animate-fade-in' />
        </>
      ),
      href: '/dashboard/post',
      path: 'post',
    },
    {
      label: 'my likes',
      icons: (
        <>
          <Heart className='block h-6 w-6 text-red-400 group-hover:hidden group-hover:animate-fade-out' />
          <Heartbeat className='hidden h-6 w-6 text-red-400 group-hover:block group-hover:animate-fade-in' />
        </>
      ),
      href: '/dashboard/post/likes',
      path: 'likes',
    },
    {
      label: 'my comments',
      icons: (
        <>
          <Message className='block h-6 w-6 text-purple-400 group-hover:hidden group-hover:animate-fade-out' />
          <Message2 className='hidden h-6 w-6 text-purple-400 group-hover:block group-hover:animate-fade-in' />
        </>
      ),
      href: '/dashboard/post/comments',
      path: 'comments',
    },
    {
      label: 'notification',
      icons: (
        <>
          <Bell className='block text-green-400 group-hover:hidden group-hover:animate-fade-out' />
          <BellRinging className='hidden text-green-400 group-hover:block group-hover:animate-fade-in' />
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
          <Tool className='block text-pink-400 group-hover:hidden group-hover:animate-fade-out' />
          <Tools className='hidden text-pink-400 group-hover:block group-hover:animate-fade-in' />
        </>
      ),
      href: '/dashboard/settings',
      path: 'settings',
    },
    {
      label: 'logout',
      icons: (
        <>
          <Logout className='block text-cyan-400 group-hover:hidden group-hover:animate-fade-out' />
          <DoorExit className='hidden text-cyan-400 group-hover:block group-hover:animate-fade-in' />
        </>
      ),
    },
  ],
};

export const POST_PAGE_LIMIT = 100;
export const POST_FEED_COUNT = 10;
export const GROUP_MEMBER_COUNT = 2;
