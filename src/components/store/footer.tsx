import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800 text-slate-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/anis-phone-logo.png"
                alt="ANIS PHONE Logo"
                width={18}
                height={18}
                className="object-contain"
              />
              <h3 className="text-2xl font-bold tracking-tight text-white">anis.phone</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Votre boutique de confiance en Algérie pour tous vos besoins en smartphones, tablettes et informatique. Livraison garantie dans les 58 wilayas.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Catégories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Smartphones</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Occasions</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tablettes</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Laptops</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Liens Utiles</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Mon Compte</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Suivre ma commande</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Conditions Générales</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Politique de retour</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">Tél:</span> 
                0550 12 34 56<br/>0770 12 34 56
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">Email:</span> 
                contact@anis.phone
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-white mr-2">Adresse:</span> 
                Bab Ezzouar, Alger, Algérie
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} anis.phone. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
