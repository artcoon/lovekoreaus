import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const bucket = (formData.get('bucket') as string) || 'images'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validate file type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF allowed' }, { status: 400 })
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${user.id}/${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl, path: data.path })
}
