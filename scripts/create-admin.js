const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.error('Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Client Supabase avec service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  try {
    console.log('🚀 Création d\'un compte administrateur Dropskills...')

    // Données admin par défaut
    const adminData = {
      email: 'admin@dropskills.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Dropskills',
      role: 'SUPER_ADMIN'
    }

    // Vérifier si l'admin existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', adminData.email)
      .single()

    if (existingUser) {
      console.log('⚠️  Un administrateur avec cet email existe déjà')
      console.log(`📧 Email: ${existingUser.email}`)
      console.log(`🆔 ID: ${existingUser.id}`)
      return
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 12)

    // Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true
    })

    if (authError) {
      throw new Error(`Erreur création auth: ${authError.message}`)
    }

    console.log('✅ Utilisateur créé dans Supabase Auth')

    // Créer l'entrée dans la table users
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: adminData.email,
        password: hashedPassword,
        first_name: adminData.firstName,
        last_name: adminData.lastName
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Erreur création user: ${userError.message}`)
    }

    console.log('✅ Utilisateur créé dans la table users')

    // Créer le profil admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authUser.user.id,
        role: adminData.role,
        first_name: adminData.firstName,
        last_name: adminData.lastName
      })
      .select()
      .single()

    if (profileError) {
      throw new Error(`Erreur création profile: ${profileError.message}`)
    }

    console.log('✅ Profil administrateur créé')

    // Log de création
    const { error: logError } = await supabase
      .from('admin_logs')
      .insert({
        admin_id: authUser.user.id,
        action: 'ADMIN_CREATED',
        resource_type: 'USER',
        resource_id: authUser.user.id
      })

    if (logError) {
      console.warn('⚠️  Erreur création log:', logError.message)
    }

    console.log('\n🎉 Compte administrateur créé avec succès !')
    console.log('📧 Email:', adminData.email)
    console.log('🔑 Mot de passe:', adminData.password)
    console.log('👤 Rôle:', adminData.role)
    console.log('🆔 ID:', authUser.user.id)
    console.log('\n⚠️  Changez le mot de passe après la première connexion !')

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message)
    process.exit(1)
  }
}

// Fonction pour créer un admin personnalisé
async function createCustomAdmin() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

  try {
    console.log('🔧 Création d\'un administrateur personnalisé...\n')

    const email = await question('📧 Email: ')
    const password = await question('🔑 Mot de passe: ')
    const firstName = await question('👤 Prénom: ')
    const lastName = await question('👤 Nom: ')
    const role = await question('🎭 Rôle (ADMIN/SUPER_ADMIN): ') || 'ADMIN'

    rl.close()

    if (!email || !password) {
      throw new Error('Email et mot de passe requis')
    }

    // Vérifier si l'admin existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà')
      return
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      throw new Error(`Erreur création auth: ${authError.message}`)
    }

    // Créer l'entrée dans la table users
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Erreur création user: ${userError.message}`)
    }

    // Créer le profil admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authUser.user.id,
        role: role.toUpperCase(),
        first_name: firstName,
        last_name: lastName
      })
      .select()
      .single()

    if (profileError) {
      throw new Error(`Erreur création profile: ${profileError.message}`)
    }

    console.log('\n🎉 Administrateur personnalisé créé avec succès !')
    console.log('📧 Email:', email)
    console.log('👤 Rôle:', role.toUpperCase())
    console.log('🆔 ID:', authUser.user.id)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2)

if (args.includes('--custom')) {
  createCustomAdmin()
} else {
  createAdmin()
} 