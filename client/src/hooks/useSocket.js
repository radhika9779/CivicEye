import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useSocketStore from '../store/socketStore';
import useIssueStore from '../store/issueStore';

/**
 * Subscribes to the shared Socket.io connection for the lifetime of the
 * calling component. Always keeps the issue store in sync with 'new_issue'
 * and 'issue_updated'. Pass onSosAlert for admin screens that need to react
 * to live SOS broadcasts (banner + sound).
 */
export function useSocket({ isAdmin = false, onSosAlert } = {}) {
  const connect = useSocketStore((s) => s.connect);
  const joinAdminRoom = useSocketStore((s) => s.joinAdminRoom);
  const addIssue = useIssueStore((s) => s.addIssue);
  const updateIssueLive = useIssueStore((s) => s.updateIssueLive);

  useEffect(() => {
    const socket = connect();
    if (isAdmin) joinAdminRoom();

    const handleNewIssue = (issue) => {
      addIssue(issue);
      toast.success(`New report: ${issue.title}`, { icon: '📍' });
    };

    const handleIssueUpdated = (payload) => {
      updateIssueLive(payload);
    };

    const handleSos = (payload) => {
      if (onSosAlert) onSosAlert(payload);
    };

    socket.on('new_issue', handleNewIssue);
    socket.on('issue_updated', handleIssueUpdated);
    socket.on('sos_alert', handleSos);

    return () => {
      socket.off('new_issue', handleNewIssue);
      socket.off('issue_updated', handleIssueUpdated);
      socket.off('sos_alert', handleSos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);
}
