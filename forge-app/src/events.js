import { storage } from '@forge/api';
import {
  applyDailyDecay,
  applyScoreEvent,
  loadPetState,
  loadProjectPetState,
  savePetState,
  saveProjectPetState,
} from './storage';

const scoreEvent = (event) => {
  const eventType = event?.eventType || 'unknown';
  if (eventType.includes('comment')) {
    return 6;
  }
  if (eventType.includes('transition')) {
    return 8;
  }
  return 4;
};

export const handleIssueEvent = async (event) => {
  const cloudId = event?.cloudId;
  const accountId = event?.atlassianId || event?.user?.accountId;
  const projectId = event?.issue?.fields?.project?.id;

  if (!cloudId || !accountId) {
    return;
  }

  const current = await loadPetState(cloudId, accountId);
  const delta = scoreEvent(event);
  const updated = applyScoreEvent(current, delta);

  await savePetState(cloudId, accountId, updated);

  if (projectId) {
    const projectState = await loadProjectPetState(cloudId, projectId);
    const updatedProjectState = applyScoreEvent(projectState, delta);
    await saveProjectPetState(cloudId, projectId, updatedProjectState);
  }
};

export const handleCommentEvent = async (event) => {
  const cloudId = event?.cloudId;
  const accountId = event?.atlassianId || event?.user?.accountId;
  const projectId = event?.issue?.fields?.project?.id;

  if (!cloudId || !accountId) {
    return;
  }

  const current = await loadPetState(cloudId, accountId);
  const updated = applyScoreEvent(current, scoreEvent(event));

  await savePetState(cloudId, accountId, updated);

  if (projectId) {
    const projectState = await loadProjectPetState(cloudId, projectId);
    const updatedProjectState = applyScoreEvent(
      projectState,
      scoreEvent(event)
    );
    await saveProjectPetState(cloudId, projectId, updatedProjectState);
  }
};

const decayStateKeys = async (prefix, loader, saver) => {
  const keys = await storage
    .query()
    .where('key', 'startsWith', prefix)
    .getMany();

  await Promise.all(
    keys.results.map(async ({ key }) => {
      const [, cloudId, resourceId] = key.split(':');
      const current = await loader(cloudId, resourceId);
      const updated = applyDailyDecay(current);
      await saver(cloudId, resourceId, updated);
    })
  );
};

export const handleDailyDecay = async () => {
  await decayStateKeys('PetState:', loadPetState, savePetState);
  await decayStateKeys(
    'ProjectPetState:',
    loadProjectPetState,
    saveProjectPetState
  );
};
