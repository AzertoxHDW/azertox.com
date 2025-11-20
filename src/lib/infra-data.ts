import { Server, Cpu, MemoryStick, HardDrive, Network, Laptop, PowerCircle, PlugIcon } from "lucide-svelte"; // Add any other icons you use

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
  // Device details for non-rack machines
  deviceType?: string; // e.g., "Desktop PC", "Laptop", "Workstation", "Server"
  location?: string; // e.g., "Home Office", "Data Center", "Mobile"
  formFactor?: string; // e.g., "Tower", "Laptop", "Rack-mount", "Small Form Factor"
  mobility?: string; // e.g., "Stationary", "Portable", "Mobile"
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
      { name: "RAM Type", value: "4x4GB DDR3 ECC @ 1600MHz", icon: MemoryStick },
      { name: "Stockage VMs/Data", value: "1 TB SATA SSD (Crucial MX500)", icon: HardDrive },
      { name: "NIC 1", value: "Onboard Dual Intel 1GbE", icon: Network },
      { name: "Alimentation", value: "Corsair RM650e", icon: PlugIcon },
    ],
    software: [
        { name: "Proxmox Virtual Environment", version: "8", notes: "" },
    ],
    description: "Machine conçue sur-mesure pour l'hébergement de serveurs de jeu. Pensée avec des composants low-cost et trouvables facilement, avec un bon compromis entre consommation et puissance.",
    notes: "",
    imageUrl: "/images/sierra2.jpg",
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
        { name: "RAM Type", value: "2x4GB DDR4 ECC", icon: MemoryStick },
        { name: "Disques de données", value: "4 x 4 TB SATA HDD (RAID-Z1)", icon: HardDrive },
        { name: "Disque Système", value: "128GB SATA SSD", icon: HardDrive },
    ],
    software: [
        { name: "ZFS Filesystem", notes: "Pour l'intégrité des données et les snapshots." },
        { name: "Samba/NFS", notes: "Partages réseau."}
    ],
    description: "Serveur NAS basé sur un Dell PowerEdge R320 récupéré. Configuré sur TrueNAS Scale, installé grâce à Clover Bootloader pour lui permettre de démarrer sur un disque NVMe. La configuration RAID-Z1 permet d'avoir 6TB d'espace de stockage en assurant la sécurité des données en cas de perte d'un disque.",
    notes: "Surveillance active et vérification quotidienne automatisée de l'intégrité des disques via SMART.",
    imageUrl: "/images/nas4.jpg",
    gallery: [
        "/images/nas4.jpg",
        "/images/nas2.jpg",
        "/images/nas3.jpg",
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
        { name: "Alimentation", value: "Corsair SF750 Platinum", icon: PlugIcon },
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
    deviceType: "PC de bureau",
    location: "Bureau personnel",
    formFactor: "Tour mini-ITX",
    mobility: "Fixe",
  },
  {
    id: "skylight2",
    name: "Skylight",
    role: "Station de travail",
    status: "Online",
    os: { name: "Windows 11", icon: Laptop },
    specs: [
      { name: "CPU", value: "Intel Core i7-7820X", icon: Cpu },
      { name: "RAM", value: "16 GB DDR4", icon: MemoryStick },
      { name: "GPU", value: "NVIDIA GTX 980Ti", icon: Cpu },
    ],
    moreSpecs: [
        { name: "CPU Model", value: "Intel Core i7-7820X (8 Cores / 16 Threads)", icon: Cpu },
        { name: "Carte mère", value: "Asus ROG Rampage VI Extreme (X299)", icon: Cpu},
        { name: "RAM Type", value: "2x8 GB G.Skill Aegis 3200MHz CL16", icon: MemoryStick },
        { name: "GPU Model", value: "EVGA GeForce GTX 980Ti Classified ACX2.0", icon: Cpu },
        { name: "Stockage Principal", value: "128 GB M.2 SSD", icon: HardDrive },
        { name: "Alimentation", value: "Phanteks Revolt X 1000W", icon: PlugIcon },
    ],
    software: [
        { name: "DaVinci Resolve", version: "20", notes: "" },
        { name: "Adobe Photoshop", version: "2022", notes: "" },
        { name: "DJI Studio", version: "", notes: "" },
    ],
    description: "Station de travail principale, basée sur la configuration de mon ancien PC remise en service après réparations",
    imageUrl: "/images/sl1.jpg",
    gallery: [
        "/images/sl1.jpg",
        "/images/sl2.jpg",
        "/images/sl3.jpg",
        "/images/sl4.jpg",
    ],
    releaseDate: "2019",
    deviceType: "Station de travail",
    location: "Bureau secondaire",
    formFactor: "Tour ATX",
    mobility: "Fixe",
  },
  {
    id: "zephyrus",
    name: "Zephyrus",
    role: "Laptop principal",
    status: "Online",
    os: { name: "Windows 11", icon: Laptop },
    specs: [
      { name: "CPU", value: "Intel Core i7-12700H", icon: Cpu },
      { name: "RAM", value: "16 GB DDR5", icon: MemoryStick },
      { name: "GPU", value: "NVIDIA RTX 3060", icon: Cpu },
    ],
    moreSpecs: [
        { name: "Modèle", value: "Asus ROG Zephyrus M16", icon: Cpu},
        { name: "CPU Model", value: "Intel Core i7-12700H (14 Cores / 20 Threads)", icon: Cpu },
        { name: "RAM Type", value: "2x8 GB DDR5 4800MHz", icon: MemoryStick },
        { name: "GPU Model", value: "NVIDIA GeForce RTX 3060", icon: Cpu },
        { name: "Stockage Principal", value: "1 TB NVMe SSD", icon: HardDrive },
        { name: "Ecran", value: '16" ROG Nebula Display (WQXGA 2560x1600 / 165hz)', icon: Laptop}
    ],
    software: [
        { name: "DaVinci Resolve", version: "20", notes: "" },
        { name: "Adobe Photoshop", version: "2022", notes: "" },
        { name: "DJI Studio", version: "", notes: "" },
    ],
    description: "Station de travail principale, basée sur la configuration de mon ancien PC remise en service après réparations",
    imageUrl: "/images/zp1.jpg",
    gallery: [
        "/images/zp1.jpg",
        "/images/zp2.jpg",
        "/images/zp3.jpg",
    ],
    purchaseDate: "2022-09",
    deviceType: "Ordinateur portable",
    location: "Mobile",
    formFactor: "Laptop 16 pouces",
    mobility: "Portable",
  },
];