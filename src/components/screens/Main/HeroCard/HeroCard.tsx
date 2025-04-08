import { FC, useEffect, useState } from 'react';
import styles from '../MainSwapi.module.scss';
import { IHero, IOptionalHeroInfo } from '../../../../types/Hero.interface';
import { StarWars } from '../../../../services/starwars.services';
import { HeroCardProps, loadingInfo } from './HeroCard.types';
import { NavLink } from 'react-router-dom';

const HeroCard: FC<HeroCardProps> = ({ hero }) => {
	// Доп. информация о герое
	const [optionalHeroInfo, setOptionalHeroInfo] =
		useState<IOptionalHeroInfo | null>(null);
	// Статус запроса
	const [status, setStatus] = useState<loadingInfo>(loadingInfo.NONE);

	// Получение доп информации о герое с отображением статуса операции
	const showOptionalHeroInfo = async () => {
		// Стираем предыдущие данные, отображаем состояние загрузки
		setOptionalHeroInfo(null);
		setStatus(loadingInfo.LOADING);
		// Вытаскиваем данные и обновляем состояния
		const data = await StarWars.getOptionalHeroInfo(hero);
		if (data !== null) {
			setOptionalHeroInfo(data);
			setStatus(loadingInfo.SUCCES);
		} else {
			setStatus(loadingInfo.ERROR);
		}
	};

	// Статус запроса (ошибка/успешно) виден пару секунд (по умолч.3000мс), статус "загрузка" отображается весь период выполнения запроса
	useEffect(
		(countMs: number = 3000) => {
			let timer: number | undefined;

			if (status === loadingInfo.ERROR || status === loadingInfo.SUCCES) {
				timer = setTimeout(() => {
					setStatus(loadingInfo.NONE);
				}, countMs);
			}

			return () => {
				clearTimeout(timer);
			};
		},
		[status]
	);

	// Отображаемый статус запроса
	let displayedStatus;
	switch (status) {
		case loadingInfo.NONE:
			displayedStatus = null;
			break;
		case loadingInfo.LOADING:
			displayedStatus = (
				<div className={styles.actions__status_loading}>loading...</div>
			);
			break;
		case loadingInfo.ERROR:
			displayedStatus = (
				<div className={styles.actions__status_error}>error</div>
			);
			break;
		case loadingInfo.SUCCES:
			displayedStatus = (
				<div className={styles.actions__status_completed}>completed</div>
			);
			break;
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	const {
		name,
		homeworld,
		films,
		species,
		vehicles,
		starships,
		created,
		edited,
		url,
		...otherInfo
	} = hero;

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h2 className={styles.header__name}>{hero.name}</h2>
				<div className={styles.title}>
					<p>Info</p>
				</div>
			</div>
			<ul className={styles.property__list}>
				{
					//Перебор свойств героя и вывод разметки "название свойства": "значение свойства"
					Object.keys(otherInfo).map((property, index) => {
						const key = property as keyof IHero;
						const propTitle = property.split('_').join(' ');

						return (
							<li className={styles.property__item} key={index}>
								{`${propTitle.charAt(0).toUpperCase()}${propTitle.slice(
									1
								)}`}
								: <u>{hero[key]}</u>
							</li>
						);
					})
				}

				{/* optional property */}
				{optionalHeroInfo && (
					<>
						{
							//Перебор ключей объекта с доп. информацией и вывод разметки "название свойства": "значение свойства"
							Object.keys(optionalHeroInfo).map((property, index) => {
								let stringData: string = 'Отсутствует';
								const key = property as keyof IOptionalHeroInfo;
								if (Array.isArray(optionalHeroInfo[key])) {
									if (optionalHeroInfo[key].length > 0)
										stringData = optionalHeroInfo[key].join(', ');
								} else {
									if (optionalHeroInfo[key].length > 0)
										stringData = optionalHeroInfo[key];
								}

								return key === 'vehicles' ? (
									<li className={styles.property__item} key={index}>
										<NavLink
											to='/vehicles'
											// В элемент Vehicle.tsx по пути /vehicles через useLocation передаём массив URL на транспорт
											state={{
												vehiclesURL: hero[key],
												heroName: hero.name,
											}}
										>{`${property
											.charAt(0)
											.toUpperCase()}${property.slice(1)}`}</NavLink>
										: <u>{stringData}</u>
									</li>
								) : (
									<li className={styles.property__item} key={index}>
										{`${property
											.charAt(0)
											.toUpperCase()}${property.slice(1)}`}
										: <u>{stringData}</u>
									</li>
								);
							})
						}
					</>
				)}
			</ul>
			<div className={styles.actions}>
				<button
					className={styles.actions__button}
					onClick={() => {
						showOptionalHeroInfo();
					}}
				>
					Get more info
				</button>
				<div className={styles.actions__status}>{displayedStatus}</div>
			</div>
			<div className={styles.id}>№{hero.url.toString().split('/')[5]}</div>
		</div>
	);
};

export default HeroCard;
