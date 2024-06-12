import { useCallback, useReducer } from 'react';

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        ...state,
        show: true,
        modalUrl: action.url,
        loading: false
      };
    case 'HIDE':
      return {
        ...state,
        show: false
      };
    case 'LOADED':
      console.log('Setting loading to false');
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

const useModal = () => {
  const [state, dispatch] = useReducer(modalReducer, {
    show: false,
    modalUrl: "",
    loading: false
  });

  const handleShow = (url) => dispatch({ type: 'SHOW', url });
  const handleClose = () => dispatch({ type: 'HIDE' });

  // 함수가 변경되지 않도록 useCallback을 사용합니다.
  const handleLoaded = useCallback(() => {
    console.log('handleLoaded called');
    dispatch({ type: 'LOADED' });
  }, []);

  return {
    ...state,
    handleClose,
    handleShow,
    handleLoaded
  };
};

export default useModal;
