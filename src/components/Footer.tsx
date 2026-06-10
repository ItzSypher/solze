import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
              S
            </span>
            <span className="text-lg font-semibold">
              SOLZE <span className="text-accent-foreground/80">Construção</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Materiais de construção, ferramentas e acabamento com preço justo e
            entrega rápida na sua obra.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> 0800 000 0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> contato@solze.com.br
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Entrega em todo Brasil
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Categorias</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Ferramentas</li>
            <li>Elétrica</li>
            <li>Hidráulica</li>
            <li>Tintas</li>
            <li>Construção</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Atendimento</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Central de ajuda</li>
            <li>Trocas e devoluções</li>
            <li>Rastrear pedido</li>
            <li>Fale conosco</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Institucional</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Sobre a SOLZE</li>
            <li>Trabalhe conosco</li>
            <li>Política de privacidade</li>
            <li>Termos de uso</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SOLZE Construção. Todos os direitos reservados.
      </div>
    </footer>
  );
}
