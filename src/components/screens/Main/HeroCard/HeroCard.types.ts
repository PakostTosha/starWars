import { IHero } from '../../../../types/Hero.interface';

// Доступные статусы запроса
export const enum loadingInfo {
	NONE, //не был отправлен
	LOADING, //загрузка
	ERROR, //ошибка
	SUCCES, //успешно
}

export type HeroCardProps = { hero: IHero };
