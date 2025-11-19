<script lang="ts">
  import { FolderIcon, FileTextIcon, FileIcon, ImageIcon } from 'lucide-svelte';
</script>

<div class="my-documents-content">
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
      <span class="font-mono">C:\My Documents</span>
    </div>
  </div>

  <div class="content-area p-3">
    <div class="info-panel bg-gradient-to-r from-blue-50 to-white border border-gray-300 p-3 mb-3 rounded-sm">
      <p class="text-xs mb-1 font-bold">File and Folder Tasks</p>
      <p class="text-xs text-blue-600 hover:underline cursor-pointer mb-1">→ Make a new folder</p>
      <p class="text-xs text-blue-600 hover:underline cursor-pointer">→ Publish this folder to the Web</p>
    </div>

    <div class="files-list space-y-1">
      <button class="file-item w-full flex items-center gap-2 p-1.5 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <FolderIcon class="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div class="text-left flex-grow min-w-0">
          <div class="text-xs font-bold truncate">Projects</div>
          <div class="text-xs text-gray-600">File folder</div>
        </div>
        <div class="text-xs text-gray-600 flex-shrink-0">12/15/2024</div>
      </button>

      <button class="file-item w-full flex items-center gap-2 p-1.5 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <FolderIcon class="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div class="text-left flex-grow min-w-0">
          <div class="text-xs font-bold truncate">Articles</div>
          <div class="text-xs text-gray-600">File folder</div>
        </div>
        <div class="text-xs text-gray-600 flex-shrink-0">11/08/2024</div>
      </button>

      <button class="file-item w-full flex items-center gap-2 p-1.5 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <FolderIcon class="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div class="text-left flex-grow min-w-0">
          <div class="text-xs font-bold truncate">Personal Files</div>
          <div class="text-xs text-gray-600">File folder</div>
        </div>
        <div class="text-xs text-gray-600 flex-shrink-0">10/23/2024</div>
      </button>

      <button class="file-item w-full flex items-center gap-2 p-1.5 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <FileTextIcon class="w-5 h-5 text-gray-600 flex-shrink-0" />
        <div class="text-left flex-grow min-w-0">
          <div class="text-xs font-bold truncate">Resume.doc</div>
          <div class="text-xs text-gray-600">Microsoft Word Document</div>
        </div>
        <div class="text-xs text-gray-600 flex-shrink-0">09/14/2024</div>
      </button>

      <button class="file-item w-full flex items-center gap-2 p-1.5 hover:bg-blue-100 border border-transparent hover:border-blue-300 rounded">
        <ImageIcon class="w-5 h-5 text-gray-600 flex-shrink-0" />
        <div class="text-left flex-grow min-w-0">
          <div class="text-xs font-bold truncate">vacation.jpg</div>
          <div class="text-xs text-gray-600">JPEG Image</div>
        </div>
        <div class="text-xs text-gray-600 flex-shrink-0">08/20/2024</div>
      </button>
    </div>
  </div>
</div>

<style>
  .my-documents-content {
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
