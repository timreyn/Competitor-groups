import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { allActivities, parseActivityCode } from '../../../lib/activities';
import { useWCIF } from '../WCIFProvider';
import EventGroup from './EventGroup';
import OtherGroup from './OtherGroup';

export default function Group() {
  const { wcif } = useWCIF();
  const { activityId } = useParams();

  const activity = useMemo(
    () => allActivities(wcif).find((a) => activityId && a.id === parseInt(activityId, 10)),
    [wcif, activityId]
  );

  const { eventId } = parseActivityCode(activity?.activityCode || '');

  const everyoneInActivity = useMemo(
    () =>
      wcif.persons
        .map((person) => ({
          ...person,
          assignments: person.assignments?.filter(
            (a) => activityId && parseInt(a.activityId, 10) === parseInt(activityId, 10) // TODO this is a hack because types aren't fixed yet for @wca/helpers
          ),
        }))
        .filter(({ assignments }) => assignments && assignments.length > 0) || [],
    [wcif.persons, activityId]
  );

  const isEventGroup = !eventId.startsWith('other');
  const GroupComponent = isEventGroup ? EventGroup : OtherGroup;

  return (
    <div>
      {wcif.id && activity && everyoneInActivity && (
        <GroupComponent competitionId={wcif.id} activity={activity} persons={everyoneInActivity} />
      )}
    </div>
  );
}
