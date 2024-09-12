/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Wrap1({ child }: { child: any }) {
	return (
		<div className="grid grid-cols-1 gap-x-4 lg:grid-cols-[1fr_minmax(1050px,_1fr)_1fr]">
			<div className="hidden bg-gradient-to-t from-[#2b4a67] via-[#ffa366] to-[#66d6ff] px-4 lg:block"></div>
			<div className="bg-white px-4">{child}</div>
			<div className="hidden bg-gradient-to-t from-[#2b4a67] via-[#ffa366] to-[#66d6ff] px-4 lg:block"></div>
		</div>
	);
}
