import ModalHolder from './ModalHolder';
import { getModalRegistration } from './modalRepository';
import { openModal, closeModal, closeAllModal } from './actions';
import reducer from './reducer';
import { Priority } from './constants';

export default ModalHolder;
export { getModalRegistration };
export { openModal, closeModal, closeAllModal };
export { reducer };
export { Priority };
