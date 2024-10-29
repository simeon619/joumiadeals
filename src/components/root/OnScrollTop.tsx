import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);
export default function OnScrollTop({ children }: { children: React.ReactNode }) {
	const scopeAnima = useRef<HTMLDivElement>(null);
	// const scopeTrigger = useRefDomTrigger((state) => state.scopeTrigger);
	const scopeTrigger = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!scopeAnima.current || !scopeTrigger) return;
		const animation = gsap.to(scopeAnima.current, {
			position: 'fixed',
			zIndex: 40,
			left: 0,
			right: 0,
			top: 0,
			// marginTop: 28,
			display: 'flex',
			justifyContent: 'center',
			borderBottom: '1px solid rgb(229, 231, 235)',
			boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
			duration: 2, // Durée de l'animation en secondes
			ease: 'elastic.inOut', // Effet d'animation
			scrollTrigger: {
				trigger: scopeTrigger.current,
				start: 'top top',
				end: 'bottom top',
				toggleActions: 'play reverse play reverse',
				scrub: true, // Active le "scrub" pour une animation fluide basée sur le scroll
			},
		});

		return () => {
			if (animation.scrollTrigger) {
				animation.scrollTrigger.kill();
			}
			animation.kill();
		};
	}, [scopeTrigger]);
	return (
		<>
			<div style={{display: 'none'}} ref={scopeAnima}>
				{children}
			</div>
			<div aria-hidden="true" className="h-1 w-full bg-transparent" ref={scopeTrigger} />
		</>
	);
}
