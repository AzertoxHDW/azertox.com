<script lang="ts">
  import { HardDriveIcon, FolderIcon, CdIcon, NetworkIcon } from 'lucide-svelte';
</script>

<div class="my-computer-content">
  <div class="toolbar bg-gray-200 border-b border-gray-400 px-2 py-1 flex items-center gap-1 text-xs">
    <span class="font-bold">File</span>
    <span class="font-bold">Edit</span>
    <span class="font-bold">View</span>
    <span class="font-bold">Favorites</span>
    <span class="font-bold">Tools</span>
    <span class="font-bold">Help</span>
  </div>

  <div class="address-bar bg-gray-200 border-b border-gray-400 px-2 py-1 flex items-center gap-2 text-xs">
    <span class="font-bold">Address:</span>
    <div class="flex-grow bg-white border border-gray-500 px-1 py-0.5">
      <span class="font-mono">My Computer</span>
    </div>
  </div>

  <div class="content-area p-3">
    <div class="info-panel bg-gradient-to-r from-blue-50 to-white border border-gray-300 p-3 mb-3 rounded-sm">
      <p class="text-xs mb-1 font-bold">System Tasks</p>
      <p class="text-xs text-blue-600 hover:underline cursor-pointer mb-1">→ View system information</p>
      <p class="text-xs text-blue-600 hover:underline cursor-pointer">→ Add or remove programs</p>
    </div>

    <p class="text-xs font-bold mb-2">Hard Disk Drives</p>
    <div class="drives-grid grid grid-cols-2 gap-3 mb-4">
      <button class="drive-item flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <HardDriveIcon class="w-8 h-8 text-gray-700 mb-1" />
        <span class="text-xs font-bold">Local Disk (C:)</span>
        <span class="text-xs text-gray-600">47.2 GB free</span>
      </button>
      <button class="drive-item flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <HardDriveIcon class="w-8 h-8 text-gray-700 mb-1" />
        <span class="text-xs font-bold">Data (D:)</span>
        <span class="text-xs text-gray-600">125.8 GB free</span>
      </button>
    </div>

    <p class="text-xs font-bold mb-2">Devices with Removable Storage</p>
    <div class="drives-grid grid grid-cols-2 gap-3">
      <button class="drive-item flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <CdIcon class="w-8 h-8 text-gray-700 mb-1" />
        <span class="text-xs font-bold">CD Drive (E:)</span>
      </button>
      <button class="drive-item flex flex-col items-center p-2 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <NetworkIcon class="w-8 h-8 text-gray-700 mb-1" />
        <span class="text-xs font-bold">Network Drive (Z:)</span>
      </button>
    </div>
  </div>
</div>

<style>
  .my-computer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
  }
  .content-area {
    flex-grow: 1;
    overflow-y: auto;
  }
  .toolbar span {
    padding: 2px 6px;
    cursor: pointer;
  }
  .toolbar span:hover {
    background-color: #d4d4d4;
  }
</style>
