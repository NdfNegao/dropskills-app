import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Autorisation fictive pour l'admin
        if (credentials?.email === 'admin@dropskills.com' && credentials?.password === 'admin123') {
          return { id: '1', email: 'admin@dropskills.com', name: 'Admin', role: 'admin' };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar Admin */}
      <div className="fixed left-0 top-0 w-64 h-full bg-[#111111] border-r border-gray-800">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white mb-8">DropSkills Admin</h1>
          <nav className="space-y-2">
            <a href="/admin" className="flex items-center text-gray-300 hover:text-white p-2 rounded hover:bg-[#1a1a1a]">
              Dashboard
            </a>
            <a href="/admin/produits" className="flex items-center text-gray-300 hover:text-white p-2 rounded hover:bg-[#1a1a1a]">
              Produits
            </a>
            <a href="/admin/utilisateurs" className="flex items-center text-gray-300 hover:text-white p-2 rounded hover:bg-[#1a1a1a]">
              Utilisateurs
            </a>
            <a href="/admin/outils" className="flex items-center text-gray-300 hover:text-white p-2 rounded hover:bg-[#1a1a1a]">
              Outils
            </a>
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 