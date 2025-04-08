import { IHero } from './Hero.interface';

export interface ISwApiResponse {
	count: number;
	next: null | string;
	previous: null | string;
	results: IHero[];
}
