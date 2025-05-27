import { Server, Cpu, MemoryStick, HardDrive, Network, Laptop } from "lucide-svelte"; // Add any other icons you use

export interface MachineSpec {
  name: string;
  value: string;
  icon?: any; // Lucide-svelte component
}

export interface Machine {
  id: string; // Ensure this is unique and URL-friendly (e.g., no spaces, special characters)
  name: string;
  role: string;
  status?: "Online" | "Offline" | "Maintenance";
  os: { name: string; icon?: any };
  specs: MachineSpec[];
  moreSpecs?: MachineSpec[]; // For additional, more detailed specs on the detail page
  software?: { name: string; version?: string; notes?: string }[]; // For software details
  notes?: string;
  description?: string; // Longer description for the detail page
  imageUrl?: string;
  gallery?: string[]; // Array of image URLs for a gallery on the detail page
  purchaseDate?: string;
  decommissionDate?: string;
}

// Your existing infrastructure data, now enhanced with more fields for detail pages
export const infrastructure: Machine[] = [
  {
    id: "proxmox-node1", // This ID will be used in the URL
    name: "Hyperviseur Principal (PVE-01)",
    role: "Hébergement de VMs & CTs",
    status: "Online",
    os: { name: "Proxmox VE 8.x", icon: Server },
    specs: [ // Specs for the card view
      { name: "CPU", value: "Intel Xeon E5-2690 v3 (2 Cores)", icon: Cpu },
      { name: "RAM", value: "16 GB DDR4 ECC", icon: MemoryStick },
      { name: "Stockage VMs", value: "1 TB SATA SSD", icon: HardDrive },
    ],
    moreSpecs: [ // Specs for the detail view
      { name: "CPU Model", value: "Intel Xeon E5-2690 v3 @ 2.60GHz", icon: Cpu },
      { name: "CPU Cores/Threads", value: "2 Cores / 4 Threads (allocated to this VM/CT if it's a VM itself, or total physical if bare metal)", icon: Cpu },
      { name: "Motherboard", value: "Supermicro X10SRL-F", icon: Cpu }, // Placeholder icon
      { name: "RAM Type", value: "16 GB DDR4 ECC @ 2133MHz", icon: MemoryStick },
      { name: "Stockage OS", value: "256 GB NVMe SSD", icon: HardDrive },
      { name: "Stockage VMs/Data", value: "1 TB SATA SSD (Samsung 870 QVO)", icon: HardDrive },
      { name: "NIC 1", value: "Onboard Intel I350 Dual Port 1GbE", icon: Network },
      { name: "NIC 2", value: "Intel X540-T2 Dual Port 10GbE", icon: Network },
    ],
    software: [
        { name: "Docker Engine", version: "25.0.3", notes: "For containerized applications." },
        { name: "QEMU/KVM", notes: "Core virtualization technology."}
    ],
    description: "Ce serveur est le cœur de mon infrastructure de virtualisation, hébergeant plusieurs machines virtuelles et conteneurs critiques pour mes projets personnels et services. Il est conçu pour une haute disponibilité et des performances robustes.",
    notes: "Maintenance régulière effectuée tous les premiers dimanches du mois.",
    imageUrl: "https://images.unsplash.com/photo-1611071549845-c5BCD7865332?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gallery: [
        "https://images.unsplash.com/photo-1611071549845-c5BCD7865332?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580582932707-520760047163?q=80&w=1200&auto=format&fit=crop",
    ],
    purchaseDate: "2022-03-15",
  },
  {
    id: "nas-truenas",
    name: "Serveur NAS (TRUENAS-01)",
    role: "Stockage réseau & Backups",
    status: "Online",
    os: { name: "TrueNAS SCALE", icon: HardDrive },
    specs: [
      { name: "CPU", value: "Intel Core i3-8100", icon: Cpu },
      { name: "RAM", value: "8 GB DDR4", icon: MemoryStick },
      { name: "Capacité Totale", value: "12 TB (RAID-Z1)", icon: HardDrive },
    ],
    moreSpecs: [
        { name: "CPU Model", value: "Intel Core i3-8100 @ 3.60GHz", icon: Cpu },
        { name: "Carte mère", value: "ASRock H370M-ITX/ac", icon: Cpu},
        { name: "RAM Type", value: "8 GB DDR4 Non-ECC", icon: MemoryStick },
        { name: "Disques de données", value: "4 x 4 TB WD Red Plus (RAID-Z1)", icon: HardDrive },
        { name: "Disque Système", value: "128GB SATA SSD", icon: HardDrive },
    ],
    software: [
        { name: "ZFS Filesystem", notes: "Pour l'intégrité des données et les snapshots." },
        { name: "Syncthing", notes: "Synchronisation de fichiers distribuée." },
        { name: "Samba/NFS", notes: "Partages réseau."}
    ],
    description: "Ce serveur NAS basé sur TrueNAS SCALE est essentiel pour la centralisation de toutes mes données importantes, photos, vidéos et sauvegardes de machines. Il utilise ZFS pour une robustesse maximale.",
    notes: "Surveillance active des disques SMART.",
    imageUrl: "https://images.unsplash.com/photo-1580827152745-51305767c10e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    purchaseDate: "2021-07-20",
  },
  {
    id: "dev-station",
    name: "Station de Développement",
    role: "Poste de travail principal",
    status: "Online",
    os: { name: "Arch Linux (btw)", icon: Laptop },
    specs: [
      { name: "CPU", value: "AMD Ryzen 7 5800X", icon: Cpu },
      { name: "RAM", value: "32 GB DDR4", icon: MemoryStick },
      { name: "GPU", value: "NVIDIA RTX 3070", icon: Cpu },
    ],
    moreSpecs: [
        { name: "CPU Model", value: "AMD Ryzen 7 5800X (8 Cores / 16 Threads)", icon: Cpu },
        { name: "Carte mère", value: "MSI B550 TOMAHAWK", icon: Cpu},
        { name: "RAM Type", value: "32 GB Corsair Vengeance LPX DDR4 3600MHz", icon: MemoryStick },
        { name: "GPU Model", value: "NVIDIA GeForce RTX 3070 Founders Edition", icon: Cpu },
        { name: "Stockage Principal", value: "1 TB NVMe SSD (Samsung 970 Evo Plus)", icon: HardDrive },
        { name: "Stockage Secondaire", value: "2 TB SATA SSD (Crucial MX500)", icon: HardDrive },
        { name: "Moniteurs", value: "2 x Dell S2721DGF (27\" 1440p 165Hz)", icon: Laptop}
    ],
    software: [
        { name: "VS Code", notes: "Éditeur de code principal." },
        { name: "Docker Desktop", notes: "Pour le développement conteneurisé." },
        { name: "GitKraken", notes: "Client Git GUI." },
        { name: "OBS Studio", notes: "Pour enregistrement et streaming."}
    ],
    description: "Ma station de travail principale où la magie opère ! Utilisée pour le développement logiciel, le montage vidéo, le gaming occasionnel et la gestion de toute mon infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    purchaseDate: "2020-11-01",
  },
];