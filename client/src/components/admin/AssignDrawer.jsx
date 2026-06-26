import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function AssignDrawer({ issue, open, onClose, onConfirm }) {
  const [saving, setSaving] = useState(false);

  if (!issue) return null;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm(issue.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign issue">
      <div className="space-y-4">
        <p className="text-sm text-civic-ink">
          Assign <span className="font-semibold text-civic-dark">"{issue.title}"</span> to yourself?
          Its status will move to <span className="font-semibold">Assigned</span>.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleConfirm} loading={saving}>
            Assign to me
          </Button>
        </div>
      </div>
    </Modal>
  );
}
