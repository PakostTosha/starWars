import { IHero } from './Hero.interface';

export interface IPages {
	count: number;
	number: number;
	results: IHero[];
}
