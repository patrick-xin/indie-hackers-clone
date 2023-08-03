import { GroupListItem } from './GroupListItem';
import { GROUPS } from '../constants/data';

export const GroupList = () => {
  return (
    <div className='space-y-3'>
      {GROUPS.map((group) => (
        <GroupListItem {...group} key={group.id} />
      ))}
    </div>
  );
};
