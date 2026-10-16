import Image from 'next/image'
import Link from 'next/link'



const games = [{ name: 'Casino', link: "http://10.151.0.73:3000"}, {name: "Horse Racing", link: 'http://10.151.0.157'}, {name: "Bounties", link: 'http://10.151.0.186:3001'}, {name: "The Bank", link: 'http://10.151.0.85:3001'},  {name: "Prediction Market", link: 'http://10.151.0.121:3000'}, {name: "Office Games", link: 'https://table.concertim.com'},   ]

export default function Interior() {
    return (
        <main
            className="interior-page"
            style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Image
                src="/interior.png"
                alt="The illuminated casino interior with chandeliers and gaming tables"
                fill
                preload
                unoptimized
                sizes="100vw"
                className="interior-image"
                style={{ zIndex: 0, objectFit: 'cover', objectPosition: 'center' }}
            />

            <section
                className="interior-content"
                style={{ position: 'relative', zIndex: 1, color: '#f8e9cd' }}
                aria-label="Casino games"
            >
                <div className="interior-game-grid">
                    {games.map((game, index) => (
                        <Link
                            className="interior-game-card cursor-pointer"
                            key={index}
                            href={game.link}
                            style={{ backgroundColor: '#4c2036' }} target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h2>{game.name}</h2>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}
