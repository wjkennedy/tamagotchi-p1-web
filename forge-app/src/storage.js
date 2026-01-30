import { storage } from '@forge/api';

const defaultPetState = () => ({
  mood: 'content',
  energy: 80,
  hunger: 20,
  cleanliness: 90,
  lastUpdated: new Date().toISOString(),
  dailyNeeds: ['Check in on a Jira issue', 'Leave a kind comment'],
});

export const getPetStateKey = (cloudId, accountId) =>
  `PetState:${cloudId}:${accountId}`;

export const getProjectPetStateKey = (cloudId, projectId) =>
  `ProjectPetState:${cloudId}:${projectId}`;

export const loadPetState = async (cloudId, accountId) => {
  const key = getPetStateKey(cloudId, accountId);
  const stored = await storage.get(key);
  return stored ?? defaultPetState();
};

export const savePetState = async (cloudId, accountId, state) => {
  const key = getPetStateKey(cloudId, accountId);
  await storage.set(key, { ...state, lastUpdated: new Date().toISOString() });
};

export const loadProjectPetState = async (cloudId, projectId) => {
  const key = getProjectPetStateKey(cloudId, projectId);
  const stored = await storage.get(key);
  return stored ?? defaultPetState();
};

export const saveProjectPetState = async (cloudId, projectId, state) => {
  const key = getProjectPetStateKey(cloudId, projectId);
  await storage.set(key, { ...state, lastUpdated: new Date().toISOString() });
};

export const applyDailyDecay = (state) => ({
  ...state,
  energy: Math.max(state.energy - 10, 0),
  hunger: Math.min(state.hunger + 15, 100),
  cleanliness: Math.max(state.cleanliness - 8, 0),
  mood:
    state.energy < 30 || state.hunger > 70 || state.cleanliness < 30
      ? 'grumpy'
      : 'content',
  dailyNeeds: ['Review an updated issue', 'Celebrate a teammate win'],
  lastUpdated: new Date().toISOString(),
});

export const applyScoreEvent = (state, delta = 5) => ({
  ...state,
  energy: Math.min(state.energy + delta, 100),
  hunger: Math.max(state.hunger - Math.round(delta / 2), 0),
  cleanliness: Math.min(state.cleanliness + Math.round(delta / 3), 100),
  mood: 'happy',
  lastUpdated: new Date().toISOString(),
});
