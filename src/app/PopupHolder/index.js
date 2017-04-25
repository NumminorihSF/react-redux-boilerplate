import PopupHolder from './PopupHolder';
import { getPopupRegistration } from './popupRepository';
import { openPopup, closePopup, closeAllPopup } from './actions';
import reducer from './reducer';

export default PopupHolder;
export { getPopupRegistration };
export { openPopup, closePopup, closeAllPopup };
export { reducer };
