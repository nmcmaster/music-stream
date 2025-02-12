import WeatherSynth from "@/components/WeatherSynth";
import WikiStream from "@/components/WikiStream";
import WikiSynth2 from "@/components/WikiSynth2";
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Datasonifier',
	description: 'Real-time data streams turned into music',
}

export default function Home() {
	return (
		<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-4">
			<div className="w-full max-w-4xl">
				<WeatherSynth />
				{/* <h1 className="text-2xl font-bold mb-6">Wikipedia Edit Sonification</h1> */}
				<WikiSynth2 />
				<div className="mt-8">
					{/* <h2 className="text-xl font-semibold mb-4">Live Edit Stream</h2> */}
					<WikiStream />
				</div>
			</div>
		</main>
	);
}
