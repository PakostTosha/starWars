import { Vehicle } from '../../../types/Vehicles.type';

// Массив ключей, отображаемых в таблице
export const KEYS = [
	'name',
	'model',
	'cost_in_credits',
	'length',
	'max_atmosphering_speed',
	'crew',
	'passengers',
];

// Функция сравнения
export const comparator = (orderBy: string, order: 'asc' | 'desc') => {
	return (a: Vehicle, b: Vehicle) => {
		const aValue = a[orderBy as keyof Vehicle];
		const bValue = b[orderBy as keyof Vehicle];

		// Приводим массивы к строкам
		const aString = Array.isArray(aValue) ? aValue.join(', ') : aValue;
		const bString = Array.isArray(bValue) ? bValue.join(', ') : bValue;

		// Проверка на число
		const aNumber = parseFloat(aString);
		const bNumber = parseFloat(bString);

		if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) {
			return order === 'asc' ? aNumber - bNumber : bNumber - aNumber;
		} else {
			return order === 'asc'
				? aString.localeCompare(bString)
				: bString.localeCompare(aString);
		}
	};
};
