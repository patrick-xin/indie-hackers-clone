import Link from 'next/link';

export const PostAuthor = ({
  author,
}: {
  author: { username: string | null };
}) => {
  return (
    <span>
      <Link href={`/@${author.username}`}>
        <a>{author.username}</a>
      </Link>
    </span>
  );
};
