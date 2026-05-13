import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@2.0.0'

interface LeadNotification {
  type: 'INSERT'
  table: string
  record: {
    id: string
    name: string
    phone: string
    email: string
    branch_pref: string
    course_interest: string
    message: string
    created_at: string
  }
}

interface SiteSetting {
  key: string
  value: string
}

serve(async (req) => {
  const payload: LeadNotification = await req.json()

  const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['admin_email', 'site_name_en'])

  const settingMap = (settings as SiteSetting[] || []).reduce((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {} as Record<string, string>)

  const adminEmail = settingMap['admin_email']
  const siteName = settingMap['site_name_en'] || 'Shahjalal Driving Training Center'

  if (!adminEmail) {
    return new Response('No admin email configured', { status: 200 })
  }

  const { error } = await resend.emails.send({
    from: `${siteName} <noreply@${Deno.env.get('DOMAIN') || 'shahjalaldrivingcenter.com'}>`,
    to: [adminEmail],
    subject: `New Lead: ${payload.record.name}`,
    html: `
      <h2>New Enrollment Inquiry</h2>
      <p><strong>Name:</strong> ${payload.record.name}</p>
      <p><strong>Phone:</strong> ${payload.record.phone}</p>
      <p><strong>Email:</strong> ${payload.record.email || 'N/A'}</p>
      <p><strong>Branch:</strong> ${payload.record.branch_pref || 'N/A'}</p>
      <p><strong>Course:</strong> ${payload.record.course_interest || 'N/A'}</p>
      <p><strong>Message:</strong> ${payload.record.message || 'N/A'}</p>
      <p><strong>Date:</strong> ${new Date(payload.record.created_at).toLocaleString()}</p>
      <hr />
      <p><a href="https://app.supabase.com">View in Admin Panel</a></p>
    `,
  })

  if (error) {
    console.error('Failed to send email:', error)
    return new Response('Failed to send notification', { status: 500 })
  }

  return new Response('Notification sent', { status: 200 })
})
