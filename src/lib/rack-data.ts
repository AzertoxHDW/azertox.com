/**
 * Shared rack device configuration
 * This file contains the rack layout and device definitions used across the application
 */

export interface RackDeviceFaceplate {
  text?: string;
  leds?: { color: 'green' | 'amber' | 'red' | 'blue'; count: number; blinking?: boolean }[];
  ports?: { type: 'rj45' | 'sfp' | 'usb' | 'fiber'; count: number; arrangement?: 'row' | 'grid' };
  buttons?: { label?: string, count: number };
  vents?: 'horizontal' | 'hexagonal' | 'dots' | boolean;
  displayText?: string;
}

export interface RackDevice {
  id: string;
  name: string;
  uHeight: number;
  type: 'pdu' | 'patch-panel' | 'switch' | 'server-1u' | 'server-2u' | 'server-3u' | 'server-4u' | 'storage-2u' | 'storage-4u' | 'ups' | 'spacer' | 'arm-cluster';
  description: string;
  details?: string[];
  infraMachineId?: string; // ID to link to infrastructure machine
  status?: 'Online' | 'Offline' | 'Warning';
  faceplate?: RackDeviceFaceplate;
  uPosition?: number; // Top U it occupies (e.g., U28 is 28)
}

// Rack configuration constants
export const TOTAL_U_SLOTS = 18;
export const U_HEIGHT_PX = 30;

// Rack devices configuration - single source of truth
export const rackDevices: RackDevice[] = [
  { id: 'u1', name: 'Routeur', uHeight: 1, uPosition: 1, type: 'switch', description: 'Netgear WAX202'},
  { id: 'u2', name: 'PDU', uHeight: 1, uPosition: 2, type: 'pdu', description: 'PDU Digitus 8 prises'},
  { id: 'u3', name: 'Passe-câbles', uHeight: 1, uPosition: 3, type: 'patch-panel', description: 'Passe-câble en brosse', faceplate: { text: '≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡'}},
  { id: 'u4', name: 'Switch + Pi', uHeight: 1, uPosition: 4, type: 'arm-cluster', description: 'Plaque modulaire contenant le switch principal et un Raspberry Pi 4B', status: 'Online', faceplate: { text: "SW / PI", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}},
  { id: 'u5', name: 'Passe-câbles', uHeight: 1, uPosition: 5, type: 'patch-panel', description: 'Passe-câble en brosse', faceplate: { text: '≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡'}},
  { id: 'u6', name: 'Dell PowerEdge R320', uHeight: 1, uPosition: 6, type: 'server-1u', description: 'Serveur de stockage TrueNAS', status: 'Online', faceplate: { text: "TRUENAS", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'nas'},
  { id: 'u7', name: 'Sierra', uHeight: 4, uPosition: 10, type: 'server-4u', description: 'Serveur de virtualisation principal', status: 'Online', faceplate: { text: "PVE-01", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'pve-01'},
  { id: 'u11', name: 'UPS', uHeight: 3, uPosition: 13, type: 'ups', description: 'Onduleur CyberPower 900VA'},
  { id: 'u14', name: 'Echo', uHeight: 2, uPosition: 15, type: 'server-2u', description: 'Serveur de virtualisation secondaire', status: 'Online', faceplate: { text: "PVE-02", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'pve-02'},
];
