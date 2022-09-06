import { FaDraftingCompass, FaUserFriends } from 'react-icons/fa';

type GroupDetailInfoProps = {
  description: string;
  membersCount: number;
  createdBy: string;
};

export const GroupDetailInfo = ({
  description,
  membersCount,
  createdBy,
}: GroupDetailInfoProps) => {
  return (
    <div className='col-span-full col-start-6 hidden md:block'>
      <h3 className='mt-2 mb-6 text-xl font-semibold uppercase'>About</h3>
      <p className='rounded bg-[#182e43] p-4 text-lg'>{description}</p>
      <div className='mt-1 space-y-2 rounded bg-[#182e43] p-4'>
        <div className='flex items-center gap-2'>
          <div>
            <FaUserFriends />
          </div>
          <div>{membersCount} members</div>
        </div>
        <div className='flex items-center gap-2'>
          <div>
            <FaDraftingCompass />
          </div>
          <div>
            moderated by <span>{createdBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
