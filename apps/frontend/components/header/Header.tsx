'use client';

import Link from 'next/link';
import { Button } from '../';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  return (
    <header className="flex items-center justify-between bg-primary px-4 py-3 shadow-sm">
      <nav className="flex items-center gap-8">
        <Link
          href={`tasks?token=${token}`}
          className="text-lg font-medium text-primary-foreground hover:underline"
          prefetch={false}
        >
          Tasks
        </Link>
        <Link
          href={`info?token=${token}`}
          className="text-lg font-medium text-primary-foreground hover:underline"
          prefetch={false}
        >
          Info
        </Link>
      </nav>
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <MountainIcon className="h-6 w-6 text-primary-foreground" />
      </Link>
      <Button
        variant="destructive"
        className="rounded-lg text-primary-foreground"
        onClick={() => {
          document.cookie = `app_password=;`;
          router.push('/login?token=' + token);
        }}
      >
        <span className="text-sm font-medium text-primary-foreground">
          Logout
        </span>
      </Button>
    </header>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
