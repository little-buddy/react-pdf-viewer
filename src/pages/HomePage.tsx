import React from 'react';
import DateDisplay from '@/components/DateDisplay';

const HomePage: React.FC = () => (
	<div className="mt-8 grid text-orange-400   w-full relative justify-center items-center flex-col">
		<h1 className="aspect-w-4 aspect-h-3 text-4xl">Hello world!</h1>
		<DateDisplay />
	</div>
);

export default HomePage;
