import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SETUP_SECRET = 'DROP2024-SETUP-KEY-X9Z';

export async function POST(request: NextRequest) {
  const { secret, password } = await request.json();

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const email = 'cyril.iriebi@gmail.com';
  const passwordHash = await bcrypt.hash(password, 12);

  const { data: existing } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', email)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, role: 'ADMIN', is_premium: true, updated_at: new Date().toISOString() })
      .eq('email', email);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, action: 'updated', email });
  }

  const { error } = await supabase
    .from('users')
    .insert({
      first_name: 'Cyril', last_name: 'Iriebi', name: 'Cyril Iriebi',
      email, password_hash: passwordHash, role: 'ADMIN', is_premium: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, action: 'created', email });
}
