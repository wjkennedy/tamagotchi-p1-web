import ForgeUI, {
  render,
  Fragment,
  Text,
  Heading,
  Link,
  Stack,
  Tag,
  useProductContext,
  useState,
} from '@forge/ui';
import { loadPetState, loadProjectPetState } from './storage';

const PetStatus = ({ state }) => (
  <Fragment>
    <Stack space="space.100">
      <Tag text={`Mood: ${state.mood}`} />
      <Text>{`Energy: ${state.energy}`}</Text>
      <Text>{`Hunger: ${state.hunger}`}</Text>
      <Text>{`Cleanliness: ${state.cleanliness}`}</Text>
      <Text>{`Last updated: ${new Date(state.lastUpdated).toLocaleString()}`}</Text>
    </Stack>
  </Fragment>
);

const DailyNeeds = ({ needs }) => (
  <Fragment>
    <Heading size="small">Daily needs</Heading>
    <Stack space="space.100">
      {needs.map((need) => (
        <Text key={need}>• {need}</Text>
      ))}
    </Stack>
  </Fragment>
);

const CareLinks = ({ issueKey, projectKey }) => (
  <Fragment>
    <Heading size="small">Care actions</Heading>
    <Stack space="space.100">
      {issueKey && (
        <Link href={`/browse/${issueKey}`}>Open this issue</Link>
      )}
      {projectKey && (
        <Link href={`/projects/${projectKey}`}>Visit project board</Link>
      )}
      <Link href="/issues/?jql=updated%20%3E%3D%20-1d">
        Review recently updated issues
      </Link>
    </Stack>
  </Fragment>
);

const IssuePanelApp = () => {
  const context = useProductContext();
  const cloudId = context?.cloudId;
  const accountId = context?.accountId;
  const issueKey = context?.extension?.issue?.key;

  const [state] = useState(async () => loadPetState(cloudId, accountId));

  return (
    <Fragment>
      <Heading>Issue Pet Habitat</Heading>
      <PetStatus state={state} />
      <DailyNeeds needs={state.dailyNeeds} />
      <CareLinks issueKey={issueKey} />
    </Fragment>
  );
};

const ProjectPageApp = () => {
  const context = useProductContext();
  const cloudId = context?.cloudId;
  const projectId = context?.extension?.project?.id;
  const projectKey = context?.extension?.project?.key;

  const [state] = useState(async () =>
    loadProjectPetState(cloudId, projectId)
  );

  return (
    <Fragment>
      <Heading>Project Pet Habitat</Heading>
      <PetStatus state={state} />
      <DailyNeeds needs={state.dailyNeeds} />
      <CareLinks projectKey={projectKey} />
    </Fragment>
  );
};

const DashboardGadgetApp = () => {
  const context = useProductContext();
  const cloudId = context?.cloudId;
  const accountId = context?.accountId;

  const [state] = useState(async () => loadPetState(cloudId, accountId));

  return (
    <Fragment>
      <Heading>Pet Habitat</Heading>
      <PetStatus state={state} />
      <DailyNeeds needs={state.dailyNeeds} />
      <CareLinks />
    </Fragment>
  );
};

export const runIssuePanel = render(<IssuePanelApp />);
export const runProjectPage = render(<ProjectPageApp />);
export const runDashboardGadget = render(<DashboardGadgetApp />);
