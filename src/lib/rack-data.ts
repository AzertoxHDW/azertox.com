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
  { id: 'u1', name: 'PDU', uHeight: 1, uPosition: 1, type: 'pdu', description: 'PDU Digitus 8 prises'},
  { id: 'u2', name: 'Passe-câbles', uHeight: 1, uPosition: 2, type: 'patch-panel', description: 'Passe-câble en brosse', faceplate: { text: '≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡'}},
  { id: 'u6', name: 'Sierra', uHeight: 4, uPosition: 6, type: 'server-4u', description: 'Serveur de virtualisation principal', status: 'Online', faceplate: { text: "PVE-01", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'pve-01'},
  { id: 'u7', name: 'Dell Optiplex R230', uHeight: 1, uPosition: 7, type: 'server-1u', description: 'Serveur inutilisé', status: 'Offline', faceplate: { text: "SPARE", leds: [{color: 'red', count:2}]}},
  { id: 'u8', name: 'Dell Optiplex R320', uHeight: 1, uPosition: 8, type: 'server-1u', description: 'Serveur de stockage TrueNAS', status: 'Online', faceplate: { text: "TRUENAS", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}, infraMachineId: 'nas'},
  { id: 'u9', name: 'Passe-câbles', uHeight: 1, uPosition: 9, type: 'patch-panel', description: 'Passe-câble en brosse', faceplate: { text: '≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡'}},
  { id: 'u10', name: 'Switch + Pi', uHeight: 1, uPosition: 10, type: 'arm-cluster', description: 'Plaque modulaire contenant le switch principal et un Raspberry Pi 4B', status: 'Online', faceplate: { text: "SW / PI", leds: [{color: 'green', count:1}, {color: 'amber', count:1, blinking: true}]}},
];
