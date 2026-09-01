import { AdminBrand } from "@/components/admin/admin-brand"
import { AdminLoginForm } from "@/components/admin/admin-login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-8 sm:px-6">
      <section aria-labelledby="admin-login-title" className="w-full max-w-md">
        <div className="mb-5 flex justify-center">
          <AdminBrand />
        </div>
        <Card className="shadow-card">
          <CardHeader className="gap-2 border-b border-border p-5 sm:p-6">
            <CardTitle className="font-heading text-2xl font-semibold text-balance">
              <h1 id="admin-login-title">Panel de administración</h1>
            </CardTitle>
            <CardDescription className="text-pretty">Ingresá con tus datos para gestionar la operación del club.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <AdminLoginForm />
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">Acceso reservado al equipo del club.</p>
      </section>
    </div>
  )
}
