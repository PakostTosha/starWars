import styles from './Vehicles.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Vehicle } from '../../../types/Vehicles.type';
import { StarWars } from '../../../services/starwars.services';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TableSortLabel,
	Button,
} from '@mui/material';
import { comparator, KEYS } from './Vehicles.services';

function Vehicles() {
	// Приём данных с URL из карточки героя
	const location = useLocation();
	const { heroName, vehiclesURL } = location.state;
	const navigate = useNavigate();

	// Данные о транспортных средствах
	const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
	// Состояние для сортировки
	const [order, setOrder] = useState<'asc' | 'desc'>('asc');
	const [orderBy, setOrderBy] = useState<string>('');

	// Запрос данных
	const fetchVehiucles = useCallback(async () => {
		const response = await Promise.all(
			vehiclesURL.map((VehicleUrl: string) => {
				return StarWars.getVehiclesInfo(VehicleUrl);
			})
		);
		setVehicles(response);
	}, [vehiclesURL]);

	// Загрузка при монтировании
	useEffect(() => {
		fetchVehiucles();
	}, [fetchVehiucles]);

	// Функция назначения параметров сортировки
	const handleSortChange = (columnKey: string) => {
		if (orderBy === columnKey) {
			setOrder(order === 'asc' ? 'desc' : 'asc');
		} else {
			setOrderBy(columnKey);
			setOrder('asc');
		}
	};

	if (vehicles === null)
		return (
			<h1 className={styles.title}>
				Загрузка информации о транспортных средствах...
			</h1>
		);
	else
		return (
			<div className={styles.container}>
				<h1 className={styles.title}>Транспортные средства {heroName}</h1>
				<TableContainer component={Paper}>
					<Table className={styles.table} size='medium'>
						<TableHead>
							<TableRow>
								{/* Динамически создаём ячейки заранее определённых свойств KEYS */}
								{Object.keys(vehicles[0]).map((key, index) => {
									// Если текущее свойство есть в заданной массиве ключей
									if (KEYS.includes(key)) {
										// Создаём ячейку с этим свойством
										return (
											<TableCell key={index}>
												<TableSortLabel
													className={styles.tableLabel}
													active={orderBy === key}
													direction={
														orderBy === key ? order : 'asc'
													}
													onClick={() => handleSortChange(key)}
												>
													{`${key
														.charAt(0)
														.toUpperCase()}${key.slice(1)}`}
												</TableSortLabel>
											</TableCell>
										);
									}
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{vehicles
								.sort(comparator(orderBy, order))
								.map((vehicleItem, index) => (
									<TableRow key={index}>
										{Object.keys(vehicleItem).map(
											(keyItem, index) => {
												if (KEYS.includes(keyItem))
													return (
														<TableCell key={index}>
															{
																vehicleItem[
																	keyItem as keyof Vehicle
																]
															}
														</TableCell>
													);
											}
										)}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<Button
					className={styles.button}
					variant='contained'
					onClick={() => {
						navigate('/');
					}}
				>
					На главную
				</Button>
			</div>
		);
}

export default Vehicles;
