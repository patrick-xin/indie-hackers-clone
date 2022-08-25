import Link from 'next/link';

export const PostAuthor = ({
  author,
}: {
  author: { username: string | null };
}) => {
  return (
    <span>
      <Link href={`/@${author.username}`}>
        <a className='decoration-brand-blue decoration-[2px] underline-offset-[6px] hover:text-brand-blue hover:underline'>
          {author.username}
        </a>
      </Link>
    </span>
  );
};
