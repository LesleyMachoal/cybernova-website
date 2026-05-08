import { ProjectCard } from '@/components/ui/ProjectCard';
import { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || '/api';

export function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${apiBase}/case-studies`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load projects');
        }

        if (!cancelled) {
          setProjects(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || 'Failed to load projects');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="container content-section">
      <h2>Projects</h2>
      {loading ? <p>Loading projects...</p> : null}
      {error ? <p className="message-error">{error}</p> : null}
      {!loading && !error ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                title: project.title,
                client: project.client,
                year: project.industry || '',
                description: project.challenge || project.solution || project.result || '',
                outcomes: [project.solution, project.result, project.metrics].filter(Boolean),
                thumbnail: project.image || '/assets/projects/securecloud.jpg',
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
