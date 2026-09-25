import { useState, useEffect } from 'react';
import { FeaturedProject } from './FeaturedProject';
import { FeaturedProjectConsole, type ProjectLayoutConfig } from './FeaturedProjectConsole';
import mhhs2 from "@/assets/images/thumbnail/mhhs2.webp"
import aftone from "@/assets/images/logo/aftone.png"
import mhhsTle from "@/assets/images/cstm-title/mhhsTle.png"
import kaiv from "@/assets/images/logo/kaiv.png"
import hsno from "@/assets/images/logo/hsno.png"
import matcha2 from "@/assets/images/thumbnail/matcha2.jpg"
import matchaTle from "@/assets/images/cstm-title/matchaTle.png"
import bbdTle from "@/assets/images/cstm-title/bbdTle.webp"
import bbd from "@/assets/images/bbd/bbdhorz.webp"

const DEFAULT_FEATURED_PROJECTS = [
  {
    id: 6,
    title: 'Blue Before Dawn',
    subtitle: 'Short Film',
    description: 'On a quiet beach before sunrise, Julie allows herself to feel something she had long lost.',
    image: bbd,
    category: 'Short Film',
    year: 'TBA',
    status: 'On Development',
    statusColor: 'red',
    watermarkLogo: kaiv,
    videoUrl: 'Not Available',
    titleImage: bbdTle,
    previewVideoUrl: 'Not Available',
    align: 'right' as const,
    vAlign: 'center' as const,
    scale: 7.0,
    marginX: 48,
    marginY: 0,
    credits: [
      { role: 'Director & Writer', name: 'Muhammad Nur Husein' },
      { role: 'Producer', name: 'Nico Bethaven' },
      { role: 'Project Supervisor', name: 'Mia Wong' },
    ],
  },
  {
    id: 1,
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
    align: 'right' as const,
    vAlign: 'center' as const,
    scale: 7.0,
    marginX: 48,
    marginY: 0,
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
];

export function FeaturedProjects() {
  const [layoutOverrides, setLayoutOverrides] = useState<Record<string, ProjectLayoutConfig>>(() => {
    try {
      const saved = localStorage.getItem('featured_project_layouts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeTitle, setActiveTitle] = useState<string>(DEFAULT_FEATURED_PROJECTS[0]?.title || '');

  const handleUpdateConfig = (title: string, config: ProjectLayoutConfig) => {
    setLayoutOverrides((prev) => {
      const next = { ...prev, [title]: config };
      try {
        localStorage.setItem('featured_project_layouts', JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const handleResetConfig = (title: string) => {
    setLayoutOverrides((prev) => {
      const next = { ...prev };
      delete next[title];
      try {
        localStorage.setItem('featured_project_layouts', JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const activeProject = DEFAULT_FEATURED_PROJECTS.find((p) => p.title === activeTitle) || DEFAULT_FEATURED_PROJECTS[0];
  const activeConfig: ProjectLayoutConfig = {
    align: activeProject?.align,
    vAlign: activeProject?.vAlign,
    scale: activeProject?.scale,
    marginX: activeProject?.marginX,
    marginY: activeProject?.marginY,
    ...(layoutOverrides[activeTitle] || {}),
  };

  return (
    <>
      {DEFAULT_FEATURED_PROJECTS.map((project) => {
        const overrides = layoutOverrides[project.title] || {};
        const mergedProject = { ...project, ...overrides };
        return <FeaturedProject key={project.title} project={mergedProject} />;
      })}

      <FeaturedProjectConsole
        projects={DEFAULT_FEATURED_PROJECTS}
        activeTitle={activeTitle}
        onSelectProject={setActiveTitle}
        currentConfig={activeConfig}
        onChangeConfig={handleUpdateConfig}
        onResetConfig={handleResetConfig}
      />
    </>
  );
}