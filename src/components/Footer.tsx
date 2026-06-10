import { Mail, Instagram, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/solze-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-card/40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <img src={logoAsset.url} alt="Solze" className="h-9 w-auto object-contain" />
          <p className="mt-5 text-sm text-muted-foreground max-w-sm leading-relaxed">
            Bolsas táticas e profissionais de alta performance. Projetadas no Brasil,
            testadas em campo, garantidas para a vida toda.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent">
            <ShieldCheck className="h-3.5 w-3.5" /> Garantia vitalícia em toda linha
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wider">
            Coleções
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="hover:text-accent cursor-pointer transition-colors">Operator</li>
            <li className="hover:text-accent cursor-pointer transition-colors">EDC</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Range</li>
            <li className="hover:text-accent cursor-pointer transition-colors">MOLLE</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wider">
            Suporte
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="hover:text-accent cursor-pointer transition-colors">Garantia</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Trocas</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Rastrear pedido</li>
            <li className="hover:text-accent cursor-pointer transition-colors">FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold mb-4 uppercase tracking-wider">
            Solze
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="hover:text-accent cursor-pointer transition-colors">Sobre</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Field Tests</li>
            <li className="hover:text-accent cursor-pointer transition-colors">B2B / Pro</li>
            <li className="hover:text-accent cursor-pointer transition-colors">Imprensa</li>
          </ul>
          <div className="flex gap-3 mt-5 text-muted-foreground">
            <Instagram className="h-4 w-4 hover:text-accent cursor-pointer transition-colors" />
            <Mail className="h-4 w-4 hover:text-accent cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} SOLZE Tactical. Engineered in Brazil.
      </div>
    </footer>
  );
}
