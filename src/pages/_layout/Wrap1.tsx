/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Wrap1({ child }: { child: any }) {
	return (
		<div className="grid grid-cols-[1fr_minmax(1020px,_1fr)_1fr] gap-x-4 lg:grid-cols-1">
			<div className="block bg-gradient-to-t from-[#677d92] via-[#98745d] to-[#71a2b5] px-4 lg:hidden"></div>
			<div className="bg-white lg:px-8">{child}</div>
			<div className="block bg-gradient-to-t from-[#2b4a67] via-[#ffa366] to-[#66d6ff] px-4 lg:hidden"></div>
		</div>
	);
}
