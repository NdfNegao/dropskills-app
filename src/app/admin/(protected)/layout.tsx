import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAuthUserById } from '@/lib/supabase-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  // Récupérer l'utilisateur depuis Supabase Auth
  const authUser = await getAuthUserById(session.user.id);
  if (!authUser) {
    redirect('/admin/login?error=user_not_found');
  }

  // Vérifier si l'utilisateur est admin
  const profile = await prisma.profile.findFirst({
    where: { 
      id: session.user.id,
      role: 'ADMIN'
    }
  });

  if (!profile || !['ADMIN', 'SUPER_ADMIN'].includes(profile.role)) {
    redirect('/admin/login?error=unauthorized');
  }

  // Créer un objet user complet pour les composants
  const user = {
    id: profile.id,
    role: profile.role,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: authUser.email
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar user={user} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 