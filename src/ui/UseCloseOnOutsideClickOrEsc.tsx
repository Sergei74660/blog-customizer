import { useEffect } from 'react';

type UseCloseOnOutsideClickOrEsc = {
	isOpenElement: boolean; // Флаг, открыт ли элемент (например, модальное окно или форма)
	onClose?: () => void; // Колбэк, вызываемый при закрытии
	elementRef: React.RefObject<HTMLElement>; // Ссылка на DOM-элемент, вне которого отслеживаем клик
};

export const useCloseOnOutsideClickOrEsc = ({
	isOpenElement,
	elementRef,
	onClose,
}: UseCloseOnOutsideClickOrEsc) => {
	useEffect(() => {
		if (!isOpenElement) {
			// Если элемент закрыт, обработчики не нужны
			return;
		}

		const handleClick = ({ target }: MouseEvent) => {
			// Если клик был вне элемента — вызываем onClose
			if (target instanceof Node && !elementRef.current?.contains(target)) {
				onClose?.();
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			// Закрытие по нажатию Escape
			if (event.key === 'Escape') {
				onClose?.();
			}
		};

		// Добавляем обработчики
		window.addEventListener('mousedown', handleClick);
		window.addEventListener('keydown', handleKeyDown);

		// Убираем обработчики при размонтировании или изменении зависимостей
		return () => {
			window.removeEventListener('mousedown', handleClick);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpenElement, elementRef, onClose]);
};
