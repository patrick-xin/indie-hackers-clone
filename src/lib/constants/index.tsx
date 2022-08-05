import { FaUserCircle } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { IoBookmark, IoLogOut, IoNotifications } from 'react-icons/io5';

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
  { title: 'Sign out', icon: <IoLogOut className='w-6 h-6' />, href: '/' },
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
