import axios from 'axios';
import { ISwApiResponse } from '../types/SwResponse.interface';
import { IHero, IOptionalHeroInfo } from '../types/Hero.interface';
import { Vehicle } from '../types/Vehicles.type';

const baseURL: string = 'https://swapi.dev/api/';

export const StarWars = {
	// Получение информации о человеке через url/№ страницы
	async getPeoplesFromPageOrUrl(
		url?: string,
		pageNumber: number = 1
	): Promise<ISwApiResponse> {
		const reqUrl = url ? url : `${baseURL}people/?page=${pageNumber}`;
		try {
			const response = await axios.get(reqUrl);
			const data: ISwApiResponse = response.data;
			return data;
		} catch (error: unknown) {
			console.error(error);
			throw error;
		}
	},
	// Получение доп.информации (homeworld, films, species, vehicles, starships)
	async getOptionalHeroInfo(hero: IHero): Promise<IOptionalHeroInfo> {
		// Инициализация пустого объекта интерфейса IOptionalHeroInfo
		const optionalHeroInfo: IOptionalHeroInfo = {
			films: [],
			homeworld: [],
			species: [],
			starships: [],
			vehicles: [],
		};

		// Перебираем необходимые ключи с URL, которые есть в интерфейсе IHero
		for (const key of Object.keys(optionalHeroInfo) as Array<
			keyof IOptionalHeroInfo
		>) {
			// Массив URL
			const valueOfOptionArr = hero[key as keyof IHero]; //['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/', ...]

			// Отправляем запрос на массив с URL, обрабатываем ответ и записываем в соответсвующее поле ранее инициализированного объекта
			// Проверка: массив URL или нет (т.к. planet содержит единственную ссылку)
			if (Array.isArray(valueOfOptionArr)) {
				try {
					optionalHeroInfo[key] = await Promise.all(
						valueOfOptionArr.map(async (optionInfoUrl) => {
							const response = await axios.get(optionInfoUrl);
							const data = response.data;
							return data?.name || data?.title || null;
						})
					);
				} catch (error) {
					console.error(error);
					throw error;
				}
			} else if (typeof valueOfOptionArr === 'string') {
				try {
					const response = await axios.get(valueOfOptionArr);
					const data = response.data;
					optionalHeroInfo[key] = data?.name || null;
				} catch (error) {
					console.error(error);
					throw error;
				}
			}
		}
		return optionalHeroInfo;
	},
	// Получение информации о транспортном средстве по URL
	async getVehiclesInfo(url: string): Promise<Vehicle> {
		try {
			const response = await axios.get(url);
			const data: Vehicle = response.data;
			return data;
		} catch (error: unknown) {
			console.error(error);
			throw error;
		}
	},
};
