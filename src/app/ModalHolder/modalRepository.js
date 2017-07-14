/** @flow */
import uniqueId from 'utils/uniqueId';

import type { TModal } from './TModal';

const registeredModals: Map<Class<TModal>, string> = new Map();
const modalsById: Map<string, Class<TModal>> = new Map();

const uniqueIdGenerator = (): string => uniqueId();

export function getModalRegistration(ModalComponent: Class<TModal>): string {
  if (!registeredModals.has(ModalComponent)) {
    const modalId = uniqueIdGenerator();
    registeredModals.set(ModalComponent, modalId);
    modalsById.set(modalId, ModalComponent);
  }
  return registeredModals.get(ModalComponent) || '';
}

export function getModalClass(modalId: string): ?Class<TModal> {
  return modalsById.get(modalId);
}

