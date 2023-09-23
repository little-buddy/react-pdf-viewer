import { memo } from 'react';
import Spin from './Spin';

const SpinView = memo(() => (
	<div className=" absolute inset-0 flex justify-center items-center">
		<Spin />
	</div>
));

export default SpinView;
