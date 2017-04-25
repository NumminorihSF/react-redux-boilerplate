/** @flow */
import type { Popup } from 'types/Popup';
import underscore from 'underscore';

const _: any = underscore;


const registeredPopups: Map<Class<Popup>, string> = new Map();
const popupsById: Map<string, Class<Popup>> = new Map();

const uniqueIdGenerator = (): string => {
  let uniqueId = _.uniqueId('popup_');
  while (popupsById.has(uniqueId)) {
    uniqueId = _.uniqueId('popup_');
  }
  return uniqueId;
};

export function getPopupRegistration(PopupComponent: Class<Popup>): string {
  if (!registeredPopups.has(PopupComponent)) {
    const popupId = uniqueIdGenerator();
    registeredPopups.set(PopupComponent, popupId);
    popupsById.set(popupId, PopupComponent);
  }
  return registeredPopups.get(PopupComponent) || '';
}

export function getPopupClass(popupId: string): ?Class<Popup> {
  return popupsById.get(popupId);
}

