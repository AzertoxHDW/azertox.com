import type { PageLoad } from './$types';
import { infrastructure, type Machine } from '$lib/infra-data';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
  const machineId = params.machineId;
  const machine = infrastructure.find(m => m.id === machineId);

  if (!machine) {
    throw error(404, 'Machine non trouvée');
  }

  return {
    machine // Pass the found machine data to the +page.svelte component
  };
};