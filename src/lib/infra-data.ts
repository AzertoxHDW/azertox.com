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
  releaseDate?: string;
  decommissionDate?: string;
}

// Your existing infrastructure data, now enhanced with more fields for detail pages
export const infrastructure: Machine[] = [
  {
    id: "pve-01", // This ID will be used in the URL
    name: "Sierra (PVE-01)",
    role: "Serveur de jeu principal",
    status: "Online",
    os: { name: "Proxmox VE 8.x", icon: Server },
    specs: [ // Specs for the card view
      { name: "CPU", value: "2x Intel Xeon E5-2667 v2", icon: Cpu },
      { name: "RAM", value: "32 GB DDR3 ECC", icon: MemoryStick },
      { name: "Stockage VMs", value: "1 TB SATA SSD", icon: HardDrive },
    ],
    moreSpecs: [ // Specs for the detail view
      { name: "CPU Model", value: "2x Intel Xeon E5-2667 v2 @ 3.30GHz", icon: Cpu },
      { name: "CPU Cores/Threads", value: "16 Cores / 32 Threads", icon: Cpu },
      { name: "Motherboard", value: "Huananzhi X79-8D", icon: Cpu }, // Placeholder icon
      { name: "RAM Type", value: "32 GB DDR3 ECC @ 1600MHz", icon: MemoryStick },
      { name: "Stockage VMs/Data", value: "1 TB SATA SSD (Crucial MX500)", icon: HardDrive },
      { name: "Disque Backup", value: "1 TB HDD (WD Blue)", icon: HardDrive },
      { name: "NIC 1", value: "Onboard Dual Port 1GbE", icon: Network },
    ],
    software: [
        { name: "Proxmox Virtual Environment", version: "8", notes: "" },
    ],
    description: "Machine concue sur-mesure pour l'hébergement de serveurs de jeu. Pensée avec des composants low-cost et trouvables facilement, avec un bon compromis entre consommation et puissance.",
    notes: "",
    imageUrl: "/images/sierra1.jpg",
    gallery: [
        "/images/sierra1.jpg",
        "/images/sierra2.jpg",
        "/images/sierra3.jpg",
        "/images/sierra4.jpg",
        "/images/sierra5.jpg",
    ],
    releaseDate: "",
    purchaseDate: "2021-09-09",
  },
  {
    id: "nas",
    name: "Serveur NAS (TRUENAS-01)",
    role: "Stockage réseau & backups",
    status: "Online",
    os: { name: "TrueNAS SCALE", icon: HardDrive },
    specs: [
      { name: "CPU", value: "Intel Xeon E5-2407 v2", icon: Cpu },
      { name: "RAM", value: "8 GB DDR4 ECC", icon: MemoryStick },
      { name: "Capacité", value: "6 TB (RAID-Z1)", icon: HardDrive },
    ],
    moreSpecs: [
        { name: "CPU Model", value: "Intel Xeon E5-2407 v2 @ 2.40GHz", icon: Cpu },
        { name: "Carte mère", value: "Dell PowerEdge R320", icon: Cpu},
        { name: "RAM Type", value: "8 GB DDR4 ECC", icon: MemoryStick },
        { name: "Disques de données", value: "4 x 4 TB SATA HDD (RAID-Z1)", icon: HardDrive },
        { name: "Disque Système", value: "128GB SATA SSD", icon: HardDrive },
    ],
    software: [
        { name: "ZFS Filesystem", notes: "Pour l'intégrité des données et les snapshots." },
        { name: "Samba/NFS", notes: "Partages réseau."}
    ],
    description: "Serveur NAS basé sur un Dell PowerEdge R320 récupéré. Configuré sur TrueNAS Scale, installé grâce à Clover Bootloader pour lui permettre de démarrer sur un disque NVMe. La configuration RAID-Z1 permet d'avoir 6TB d'espace de stockage en assurant la sécurité des données en cas de perte d'un disque.",
    notes: "Surveillance active et vérification quotidienne automatisée de l'intégrité des disques via SMART.",
    imageUrl: "/images/nas1.png",
    gallery: [
        "/images/nas1.png",
        "/images/nas2.jpg",
        "/images/nas3.jpg",
        "/images/nas4.jpg",
    ],
    releaseDate: "2012",
    purchaseDate: "2021-06-15",
  },
  {
    id: "snowflake",
    name: "Snowflake 2.0",
    role: "PC Principal",
    status: "Online",
    os: { name: "CachyOS (Arch Linux)", icon: Laptop },
    specs: [
      { name: "CPU", value: "AMD Ryzen 7 5800X", icon: Cpu },
      { name: "RAM", value: "32 GB DDR4", icon: MemoryStick },
      { name: "GPU", value: "NVIDIA RTX 3090", icon: Cpu },
    ],
    moreSpecs: [
        { name: "CPU Model", value: "AMD Ryzen 7 5800X (8 Cores / 16 Threads)", icon: Cpu },
        { name: "Carte mère", value: "Asus ROG Strix B550-A Gaming", icon: Cpu},
        { name: "RAM Type", value: "32 GB G.Skill Trident Z RGB 3200MHz CL14", icon: MemoryStick },
        { name: "GPU Model", value: "NVIDIA GeForce RTX 3090 Founders Edition", icon: Cpu },
        { name: "Stockage Principal", value: "2 TB NVMe SSD (Samsung 970 Evo Plus)", icon: HardDrive },
        { name: "Moniteurs", value: 'Gigabyte G34WQC (UWQHD 3400x1440 / 144hz) || LG 24BK450H (FHD 1920x1080 / 60hz)', icon: Laptop}
    ],
    description: "PC principal, utilisé majoritairement pour jouer, entre autres. Monté entièrement par mes soins, le tout sous refroidissement custom.",
    imageUrl: "/images/sf1.JPG",
    gallery: [
        "/images/sf1.JPG",
        "/images/sf2.jpg",
        "/images/sf3.jpg",
        "/images/sf4.jpg",
        "/images/sf5.jpg",
    ],
    purchaseDate: "2021-04-01",
  },
];