export interface Event {
  title: string;
  image: string; // path from public/images
  slug: string;
  location: string;
  date: string; // human-readable date
  time: string; // human-readable time
}

export const events: Event[] = [
  {
    title: 'React Summit 2026',
    image: '/images/event1.png',
    slug: 'react-summit-2026',
    location: 'Amsterdam, NL',
    date: 'May 10–12, 2026',
    time: '09:00 AM'
  },
  {
    title: 'KubeCon + CloudNativeCon Europe 2026',
    image: '/images/event2.png',
    slug: 'kubecon-europe-2026',
    location: 'Barcelona, ES',
    date: 'Mar 22–25, 2026',
    time: '08:30 AM'  
},
  {
    title: 'Next.js Conf 2026',
    image: '/images/event3.png',
    slug: 'nextjs-conf-2026',
    location: 'San Francisco, CA',
    date: 'Oct 14, 2026',
    time: '10:00 AM'
  },
  {
    title: 'JSConf EU 2026',
    image: '/images/event4.png',
    slug: 'jsconf-berlin-2026',
    location: 'Berlin, DE',
    date: 'Jun 4–6, 2026',
    time: '09:30 AM'
  },
  {
    title: 'Hack the Planet — 48h Hackathon',
    image: '/images/event5.png',
    slug: 'hack-the-planet-2026',
    location: 'Virtual',
    date: 'Apr 3–5, 2026',
    time: '16:00 UTC'
  },
  {
    title: 'Node.js Community Day 2026',
    image: '/images/event6.png',
    slug: 'node-community-day-2026',
    location: 'Berlin, DE',
    date: 'Sep 10, 2026',
    time: '09:00 AM'
 }
];