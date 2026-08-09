import UserPanel from '@/components/user/UserPanel';
import { isAuthConfigured, isEditor } from '@/lib/auth';

export const metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

async function User() {
  const signedIn = await isEditor();

  return (
    <div className="user">
      <main className="user-main">
        <h1 className="user-title">{signedIn ? 'Edit mode' : 'Sign in'}</h1>
        <UserPanel signedIn={signedIn} configured={isAuthConfigured()} />
      </main>
    </div>
  );
}

export default User;
