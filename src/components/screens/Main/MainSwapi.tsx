import { useCallback, useEffect, useState } from 'react';
import HeroCard from './HeroCard/HeroCard';
import { IPages } from '../../../types/Pages.interface';
import { StarWars } from '../../../services/starwars.services';
import { ISwApiResponse } from '../../../types/SwResponse.interface';
import styles from './MainSwapi.module.scss';
import Pagination from '@mui/material/Pagination';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PaginationItem } from '@mui/material';

function MainSwapi() {
	const navigate = useNavigate();
	const params = useParams();
	const paramsPage = Number(params.page) || 1;

	const [pages, setPages] = useState<IPages[]>([]);
	const [currentPagesNumber, setCurrentPagesNumber] = useState<number>(
		Number(paramsPage < 11 ? paramsPage : 1)
	);

	// Загрузка страницы и добавление в состояние
	const fetchData = useCallback(
		async (pageNumber = 1, url?: string) => {
			const response: ISwApiResponse =
				await StarWars.getPeoplesFromPageOrUrl(url, pageNumber);
			const newPage: IPages = {
				count: response.count,
				number: pageNumber,
				results: response.results,
			};

			setPages((prev) => {
				const newArr = [...prev];
				newArr[currentPagesNumber - 1] = newPage;
				return newArr;
			});
		},
		[currentPagesNumber]
	);

	useEffect(() => {
		if (location.pathname === '/') {
			navigate(`/page/${currentPagesNumber}`, { replace: true });
		}
		if (!pages[currentPagesNumber - 1]) fetchData(currentPagesNumber);
	}, [pages, currentPagesNumber, fetchData, navigate]);

	const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setCurrentPagesNumber(value);
	};

	if (pages[currentPagesNumber - 1] === undefined) {
		return <div>Загрузка данных...</div>;
	} else {
		return (
			<div className='container'>
				<Pagination
					page={currentPagesNumber}
					count={Math.ceil(pages[currentPagesNumber - 1].count / 10)}
					variant='outlined'
					color='secondary'
					className={styles.pagination}
					onChange={handleChange}
					renderItem={(item) => {
						return (
							<PaginationItem
								component={Link}
								to={`/page/${item.page}`}
								{...item}
							/>
						);
					}}
				/>
				<div className={styles.list}>
					{pages[currentPagesNumber - 1].results.map((hero, index) => (
						<HeroCard hero={hero} key={index} />
					))}
				</div>
			</div>
		);
	}
}

export default MainSwapi;
