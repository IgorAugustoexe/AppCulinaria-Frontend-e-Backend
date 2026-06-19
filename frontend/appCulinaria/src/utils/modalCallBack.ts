const modalCallback = new Map<string, () => void>();

export const registerModalCallback = (callback?: () => void) => {
  if (!callback) return undefined;

  const callbackId = `modal-callback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  modalCallback.set(callbackId, callback);
  return callbackId;
};

export const executeModalCallback = (callbackId?: string) => {
  if (!callbackId) return;

  const callback = modalCallback.get(callbackId);
  modalCallback.delete(callbackId);
  callback?.();
};
