import { CSSProperties, useState } from 'react';
import clsx from 'clsx';
import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	ArticleStateType,
	defaultArticleState,
} from './constants/articleProps';
import styles from './styles/index.module.scss';

export const App = () => {
	// Состояние страницы
	const [articleState, setArticleState] =
		useState<ArticleStateType>(defaultArticleState);
	// Обработчики применения и сброса настроек
	const handleApply = (nextState: ArticleStateType) => {
		setArticleState(nextState);
	};

	const handleReset = () => {
		setArticleState(defaultArticleState);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				state={defaultArticleState}
				actions={{ apply: handleApply, reset: handleReset }}
			/>
			<Article />
		</main>
	);
};
