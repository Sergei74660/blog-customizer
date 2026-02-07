import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { useState, useRef, useEffect } from 'react';
import { Text } from 'src/ui/text';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	contentWidthArr,
	fontColors,
	backgroundColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useCloseOnOutsideClickOrEsc } from 'src/ui/UseCloseOnOutsideClickOrEsc';

// Пропсы компонента: текущие настройки и методы их изменения
type FormState = {
	state: ArticleStateType;
	actions: {
		apply: (nextState: ArticleStateType) => void;
		reset: () => void;
	};
};

// Ключи параметров, использующие выпадающие списки
type TSelectName =
	| 'fontFamilyOption'
	| 'fontColor'
	| 'backgroundColor'
	| 'contentWidth';

// Описание поля Select
type TFormSelect = {
	name: TSelectName;
	title: string;
	options: OptionType[];
};

// Форма настройки отображения статьи
export const ArticleParamsForm = (props: FormState) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние открыта ли панель настроек
	const sideBarRef = useRef<HTMLElement>(null); // Референс на панель
	const [formState, setFormState] = useState<ArticleStateType>(props.state); // Данные формы
	const close = (): void | undefined => setIsMenuOpen(false); // Скрыть панель
	// Хук закрытие при клике вне панели или нажатии Escape
	useCloseOnOutsideClickOrEsc({
		isOpenElement: isMenuOpen,
		elementRef: sideBarRef,
		onClose: close,
	});
	// Изменить параметр
	const update = (key: keyof ArticleStateType, value: OptionType) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};
	// Создать поле выбора
	const renderSelect = (selectProps: TFormSelect) => {
		return (
			<Select
				selected={formState[selectProps.name]}
				options={selectProps.options}
				title={selectProps.title}
				onChange={(selected) => update(selectProps.name, selected)}></Select>
		);
	};
	// Обработка кликов вне панели
	useEffect(() => {
		if (!isMenuOpen) {
			return;
		}
		const handleClickOverlay = (event: MouseEvent) => {
			if (
				sideBarRef.current &&
				!sideBarRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('click', handleClickOverlay);

		return document.removeEventListener('click', handleClickOverlay);
	}, [isMenuOpen]);
	// Отправить форму
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		props.actions.apply(formState);
	};
	// Сбросить форму
	const handleReset = (event: React.FormEvent) => {
		event.preventDefault();
		props.actions.reset();
		setFormState(props.state);
	};

	return (
		<>
			<ArrowButton
				isOpen={isMenuOpen}
				onClick={() => {
					setIsMenuOpen((prevState) => !prevState);
				}}
			/>
			<aside
				className={clsx(styles.container, isMenuOpen && styles.container_open)}
				ref={sideBarRef}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as={'h1'} size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					{renderSelect({
						title: 'Шрифт',
						name: 'fontFamilyOption',
						options: fontFamilyOptions,
					})}
					<RadioGroup
						name='font-size'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => update('fontSizeOption', option)}
						title='Размер шрифта'></RadioGroup>
					{renderSelect({
						title: 'Цвет шрифта',
						name: 'fontColor',
						options: fontColors,
					})}
					{Separator()}
					{renderSelect({
						title: 'Цвет фона',
						name: 'backgroundColor',
						options: backgroundColors,
					})}
					{renderSelect({
						title: 'Ширина контента',
						name: 'contentWidth',
						options: contentWidthArr,
					})}
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
