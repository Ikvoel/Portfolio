import { FeaturedProject } from './FeaturedProject';
import mhhs2 from "@/assets/images/thumbnail/mhhs2.webp"
import aftone from "@/assets/images/logo/aftone.png"
import mhhsTle from "@/assets/images/cstm-title/mhhsTle.png"
import kaiv from "@/assets/images/logo/kaiv.png"
import hsno from "@/assets/images/logo/hsno.png"
import matcha2 from "@/assets/images/thumbnail/matcha2.jpg"
import matchaTle from "@/assets/images/cstm-title/matchaTle.png"

const featuredProjects = [
  {
    title: 'My Hand, Her Signature',
    subtitle: 'Short Film',
    description: 'A young painter risks losing the most important exhibition of her career as another presence within herself continues to destroy her paintings.',
    image: mhhs2,
    category: 'Short Film',
    year: '2026',
    status: 'Newly Completed',
    statusColor: 'green',
    watermarkLogo: aftone,
    videoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1784634115/MyHandHerSignature_Trailer_lhj3ob.mp4',
    titleImage: mhhsTle,
    previewVideoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1784634115/MyHandHerSignature_Trailer_lhj3ob.mp4',
    credits: [
      { role: 'Writer', name: 'Muhammad Nur Husein, Valerianus Alvin Tjuarsa' },
      { role: 'Director', name: 'Valerianus Alvin Tjuarsa' },
      { role: 'Producer', name: 'Daniella Nediva' },
      { role: 'Production Manager', name: 'Miracle Bernadette Louisa Tumion' },
      { role: 'Director of Photography', name: 'Muhammad Nur Husein' },
      { role: 'Production Designer', name: 'Mark Hector Jedidiah' },
      { role: 'Art Director', name: 'Muhammad Farhan Fidaputra' },
      { role: 'Assistant Director', name: 'Alodia Alfreda' },
      { role: 'Gaffer', name: 'Ilham Nouval' },
      { role: 'Sound Recordist', name: 'Farrel Goan Nessel' },
      { role: 'Editor', name: 'Lady Rahma Cantique Kusuma' },
      { role: 'Colorist', name: 'Marcello Hannan' },
      { role: 'Sound Designer', name: 'Frizello Nathanael' },
      { role: 'Composer', name: 'Muhammad Nur Husein' },
    ],
  },
  {
    title: 'Macha',
    subtitle: 'Short Film',
    description: 'In a calm, understated job interview, Gracia is asked about her favorite drink. Her answer, matcha, triggers a series of intimate memories moments, silent laughter, and a presence that once felt close.',
    image: matcha2,
    category: 'Short MV Film',
    year: '2025',
    status: 'Completed',
    statusColor: 'green',
    watermarkLogo: hsno,
    videoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1783536926/Matcha_-_Trailer_wqodif.mov',
    titleImage: matchaTle,
    previewVideoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1783536926/Matcha_-_Trailer_wqodif.mov',
    credits: [
      { role: 'Writer & Director', name: 'Muhammad Nur Husein' },
      { role: 'Production Support', name: 'Valerianus Alvin Tjuarsa' },
      { role: 'Talent Support', name: 'Lady Rahma Cantique Kusuma, Rachel Ratu Kiana' },
      { role: 'Cast', name: 'Maeluna Quinteva, Muhammad Farhan, Jose Richie' },
      { role: 'Editor & Colorist', name: 'Muhammad Nur Husein' },
    ],
  },
  //  {
  //   title: 'Blue Before Dawn',
  //   subtitle: 'Short MV Film',
  //   description: 'On a quiet beach before sunrise, Julie allows herself to feel something she had long lost.',
  //   image: 'https://i.ibb.co.com/mFM9zg4r/pexels-aleksandr-neplokhov-486399-3971223.jpg',
  //   category: 'Short MV Film',
  //   year: '2026',
  //   status: 'On Development',
  //   statusColor: 'red',
  //   watermarkLogo: kaiv,
  //   videoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1783536926/Matcha_-_Trailer_wqodif.mov',
  //   previewVideoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1783536926/Matcha_-_Trailer_wqodif.mov',
  //   credits: [
  //     { role: 'Director', name: 'Mark Lee' },
  //     { role: 'Music Producer', name: 'Yoko Shimomura' },
  //     { role: 'Choreographer', name: 'Mia Wong' },
  //   ],
  // },
];

export function FeaturedProjects() {
  return (
    <>
      {featuredProjects.map((project, index) => (
        <FeaturedProject key={index} project={project} />
      ))}
    </>
  );
}